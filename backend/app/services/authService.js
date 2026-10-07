'use strict';

const { MESSAGES, ERROR_TYPES, TOKEN_TYPES, AVAILABLE_AUTHS, USER_TYPE, USER_STATUS } = require('../utils/constants');
const { createErrorResponse } = require("../helpers");
const { UserModel, SessionModel } = require('../models');
const CONFIG = require('../../config');
const { decryptJwt, convertIdToMongooseId } = require("../utils/utils");
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');

let authService = {};

/**
 * Middleware: Validate API key from X-API-KEY header.
 */
authService.validateApiKey = () => {
    return (request, response, next) => {
        if (request.headers['x-api-key'] == CONFIG.API_AUTH_KEY || request.headers['x-api-key'] == CONFIG.SOCKET_SERVER_AUTH_KEY) {
            return next();
        } else {
            const origin = request.headers.origin;
            if (JSON.parse(CONFIG.ALLOWED_DOMAINS.replace(/'/g, "\"")).includes(origin)) {
                return next();
            }
        }
        let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
        return response.status(responseObject.statusCode).json(responseObject);
    };
};

/**
 * Middleware: Validate authenticated user via JWT.
 */
authService.userValidate = (authType) => {
    return (request, response, next) => {
        validateUser(request, authType).then((isAuthorized) => {
            if (typeof(isAuthorized) == 'string') {
                let responseObject = createErrorResponse(MESSAGES.FORBIDDEN(request.method, request.route.path), ERROR_TYPES.FORBIDDEN);
                return response.status(responseObject.statusCode).json(responseObject);
            }
            if (isAuthorized) {
                return next();
            }
            let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        }).catch((err) => {
            let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        });
    };
};

/**
 * Validate user's token and fetch details.
 */
let validateUser = async (request, authType) => {
    try {
        // Check session in DB first
        let session = await SessionModel.findOne({
            token: request.headers.authorization,
            tokenType: { $in: [TOKEN_TYPES.LOGIN, TOKEN_TYPES.BACKUP_LOGIN] }
        }).lean();

        // Fallback to JWT decode
        if (!session) {
            session = decryptJwt(request.headers.authorization);
            if (!session) return false;
            session.tokenExpDate = new Date((session.exp * 1000));
            session.userId = convertIdToMongooseId(session.userId || session.id);
        }

        // Check expiry
        if (!session || (session && session.tokenExpDate < new Date())) {
            return false;
        }

        // Role-based authorization
        if (authType == AVAILABLE_AUTHS.USER && session.userType != USER_TYPE.USER) return false;
        if (authType == AVAILABLE_AUTHS.ADMIN && session.userType != USER_TYPE.SUPER_ADMIN) return false;
        if (authType == AVAILABLE_AUTHS.STAFF && session.userType != USER_TYPE.STAFF) return false;
        if (authType == AVAILABLE_AUTHS.ADMIN_STAFF && session.userType == USER_TYPE.USER) return false;
        if (authType == AVAILABLE_AUTHS.ALL && ![USER_TYPE.SUPER_ADMIN, USER_TYPE.STAFF, USER_TYPE.USER].includes(session.userType)) return false;

        let user = await UserModel.findOne({ _id: session.userId }).lean();
        if (user) {
            if (user.status === USER_STATUS.DISABLED) return false;
            request.userSession = session;
            request.user = user;
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

/**
 * Rate limiter factory.
 */
authService.createRateLimiter = (options = {}) => {
    return rateLimit({
        windowMs: options.windowMs || CONFIG.RATE_LIMIT.WINDOW_MS,
        max: options.max || CONFIG.RATE_LIMIT.MAX_REQUESTS,
        message: createErrorResponse(options.message || 'Too many requests, please try again later.', ERROR_TYPES.BAD_REQUEST),
        keyGenerator: (request) => {
            return requestIp.getClientIp(request);
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

module.exports = authService;
