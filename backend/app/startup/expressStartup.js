"use strict";

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const routes = require('../routes');
const routeUtils = require('../utils/routeUtils');
const { log, logger } = require('../utils/utils');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const { v4: uuid } = require('uuid');
const { ALLOWED_ORIGINS } = require('../../config/index');
const CONFIG = require('../../config/index');
const HELPERS = require('../helpers');

if (!fs.existsSync('data/logs')) {
    fs.mkdirSync('data/logs', { recursive: true });
}

let whitelist = (ALLOWED_ORIGINS || '').split(",").map(item => item.trim()).filter(item => item);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

module.exports = async function (app) {
    // ── Security middleware ──────────────────────────────────────

    if (whitelist && whitelist.length) {
        app.use(cors(corsOptions));
    } else {
        app.use(cors());
    }

    app.use(helmet());
    app.use(mongoSanitize());                           // #1 NoSQL injection protection
    app.use(hpp());                                     // #5 HTTP parameter pollution
    app.use(rateLimit({                                 // #2 Global rate limit
        windowMs: CONFIG.RATE_LIMIT.WINDOW_MS,
        max: CONFIG.RATE_LIMIT.MAX_REQUESTS,
        standardHeaders: true,
        legacyHeaders: false,
    }));

    // ── Body parsing — 1MB default, not 50MB ────────────────────
    // ponytail: override per-route with express.json({ limit: '10mb' }) if you need bigger payloads
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ limit: '1mb', extended: true }));

    // ── Request correlation ID ──────────────────────────────────
    app.use((req, res, next) => {
        req.id = req.headers['x-request-id'] || uuid();
        res.setHeader('x-request-id', req.id);
        next();
    });

    // ── Request logging ─────────────────────────────────────────
    app.use((req, res, next) => {
        console.log(`[${req.id}] ${req.method} ${req.url} at ${new Date().toISOString()}`);
        const start = process.hrtime.bigint();
        res.on("finish", () => {
            let end = process.hrtime.bigint();
            let seconds = Number(end - start) / 1000000000;
            let message = `[${req.id}] ${req.method} ${res.statusCode} ${req.url} took ${seconds.toFixed(3)}s`;

            if (res.statusCode >= 200 && res.statusCode <= 299) { log.success(message); }
            else if (res.statusCode >= 400) {
                log.error(message);
                logger.error(JSON.stringify({
                    requestId: req.id,
                    method: req.method,
                    reqUrl: req.route ? req.route.path : req.url,
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                }));
            }
            else { log.info(message); }
        });
        next();
    });

    // Initialize routes.
    await routeUtils.route(app, routes);

    // ── Catch-all error handler (MUST be after routes) ──────────
    // Prevents stack trace leaks to clients
    app.use((err, req, res, next) => {
        logger.error(JSON.stringify({
            requestId: req.id,
            url: req.url,
            error: err.message,
        }));
        res.status(500).json(HELPERS.createErrorResponse('Internal Server Error', 'INTERNAL_SERVER_ERROR'));
    });
};
