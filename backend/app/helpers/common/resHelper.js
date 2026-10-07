let RESPONSE = {
    ERROR: {
        DATA_NOT_FOUND: (msg) => ({
            statusCode: 404,
            msg: msg || '',
            status: false,
            type: 'DATA_NOT_FOUND',
        }),
        BAD_REQUEST: (msg, data) => {
            let obj = { statusCode: 400, status: false, msg: msg || '', type: 'BAD_REQUEST' };
            if (data) obj = { ...obj, data };
            return obj;
        },
        MONGO_EXCEPTION: (msg) => ({
            statusCode: 100,
            msg: msg || '',
            status: false,
            type: 'MONGO_EXCEPTION',
        }),
        ALREADY_EXISTS: (msg) => ({
            statusCode: 400,
            msg: msg || '',
            status: false,
            type: 'ALREADY_EXISTS',
        }),
        FORBIDDEN: (msg) => ({
            statusCode: 403,
            msg: msg || '',
            status: false,
            type: 'Forbidden',
        }),
        INTERNAL_SERVER_ERROR: (msg) => ({
            statusCode: 500,
            msg: msg || '',
            status: false,
            type: 'INTERNAL_SERVER_ERROR',
        }),
        UNAUTHORIZED: (msg) => ({
            statusCode: 401,
            msg: msg || '',
            status: false,
            type: 'UNAUTHORIZED',
        })
    },
    SUCCESS: {
        MISSCELANEOUSAPI: (msg, data) => {
            let obj = { statusCode: 200, status: true, msg: msg || '', type: 'Default' };
            if (data) obj = { ...obj, data };
            return obj;
        }
    }
};

/**
 * Create a valid SUCCESS response object.
 */
function createSuccessResponse(message, data) {
    return RESPONSE.SUCCESS.MISSCELANEOUSAPI(message, data);
}

/**
 * Create a valid ERROR response object.
 */
function createErrorResponse(message, errorType, data) {
    return RESPONSE.ERROR[errorType](message, data);
}

module.exports = {
    createErrorResponse,
    createSuccessResponse
};
