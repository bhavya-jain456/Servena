const path = require('path');

let PLATFORM = process.env.PLATFORM || 'project';

let defaults = {
    PLATFORM: PLATFORM,
    SERVER_TYPE_ENV: process.env.SERVER_TYPE || '',
    ROOT_PATH: path.normalize(__dirname + '/../app'),
    ENV_STAGING: "staging",
    ENV_DEVELOPMENT: "development",
    ENV_PRODUCTION: "production",
    ENVIRONMENT: process.env.NODE_ENV || 'production',
    DEFAULT_TZ: process.env.TZ || 'UTC',
    show: function () {
        console.log('environment: ' + this.ENVIRONMENT);
    },

    /** API Authentication Key — required in header as "X-API-KEY" */
    API_AUTH_KEY: process.env.API_AUTH_KEY || 'apitestkey',
    SOCKET_SERVER_AUTH_KEY: process.env.SOCKET_SERVER_AUTH_KEY || 'apitestkey',

    SMTP: {
        TRANSPORT: {
            host: process.env.NODEMAILER_HOST || `node-mailer-host-name`,
            auth: {
                user: process.env.NODEMAILER_USER || `node-mailer-user`,
                pass: process.env.NODEMAILER_PASSWORD || `node-mailer-password`
            },
            secure: false,
            tls: { rejectUnauthorized: false },
        },
        SENDER: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        SENDER_EMAIL: process.env.SENDER_EMAIL || "",
        SENDER_NAME: process.env.SENDER_NAME || ""
    },

    MONGODB: {
        PROTOCOL: process.env.DB_PROTOCOL || 'mongodb',
        HOST: process.env.DB_HOST || '127.0.0.1',
        PORT: process.env.DB_PORT || 27017,
        NAME: process.env.DB_NAME || 'project',
        USER: process.env.DB_USER || 'username',
        PASSWORD: process.env.DB_PASS || 'password',
        get URL() { return process.env.dbUrl || `${this.PROTOCOL}://${this.USER}:${this.PASSWORD}@${this.HOST}:${this.PORT}/${this.NAME}` },
    },

    REDIS: {
        PORT: process.env.REDIS_PORT || '6379',
        HOST: process.env.REDIS_HOST || '127.0.0.1',
        PASSWORD: process.env.REDIS_PASSWORD || ''
    },

    SERVER: {
        PROTOCOL: process.env.SERVER_PROTOCOL || 'http',
        HOST: process.env.SERVER_HOST || '0.0.0.0',
        PORT: process.env.SERVER_PORT || '3000',
        SOCKET_PORT: process.env.SERVER_SOCKET_PORT || '4000',
        get URL() { return `${this.PROTOCOL}://${this.HOST}:${this.PORT}` }
    },

    SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',
    S3_ASSETS_URL: process.env.S3_ASSETS_URL ? process.env.S3_ASSETS_URL + "/" : 'http://localhost:3000/',
    WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
    ADMIN_WEB_URL: process.env.ADMIN_WEB_URL || 'http://localhost:3000',

    swagger: require('./swagger'),

    SWAGGER_AUTH: {
        USERNAME: process.env.SWAGGER_AUTH_USERNAME || 'username',
        PASSWORD: process.env.SWAGGER_AUTH_PASSWORD || 'password'
    },

    S3_BUCKET: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'access-key-id',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'secret-access-key',
        bucketName: process.env.S3_BUCKET_NAME || 'bucket-name',
    },

    AWS: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'aws_access_key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'aws_secret_key',
        awsRegion: process.env.AWS_REGION || 'us-east-1',
    },

    PATH_TO_UPLOAD_FILES_ON_LOCAL: process.env.PATH_TO_UPLOAD_FILES_ON_LOCAL || '/uploads/files',

    SUPER_USER: {
        EMAIL: process.env.SU_EMAIL || 'su@yopmail.com',
        PASSWORD: process.env.SU_PASS || 'pass123',
        NAME: process.env.SU_NAME || 'Super Admin'
    },

    UPLOAD_TO_S3_BUCKET: process.env.UPLOAD_TO_S3_BUCKET || false,
    JWT_SECRET: process.env.JWT_SECRET || 'changeme_jwt_secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
    ADMIN_JWT_SIGN_KEY: process.env.ADMIN_JWT_SIGN_KEY || 'changeme_admin_jwt_key',
    RUN_CRON: process.env.RUN_CRON || true,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '',
    ALLOWED_DOMAINS: process.env.ALLOWED_DOMAINS || "['http://localhost:3000']",
    ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY || 'secret-key',

    RATE_LIMIT: {
        WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
};

let currentEnvironment = process.env.NODE_ENV || 'production';

let development = require('./env/development');
let production = require('./env/production');
let staging = require('./env/staging');

function myConfig(envConfig) {
    return { ...defaults, ...envConfig };
};

const resolvedConfig = {
    development: myConfig(development),
    production: myConfig(production),
    staging: myConfig(staging)
}[currentEnvironment];

// #4 Crash if critical secrets are defaults in production
// #7 Force ALLOWED_ORIGINS in production (no wildcard CORS)
if (currentEnvironment === 'production') {
    const requiredEnvVars = ['API_AUTH_KEY', 'JWT_SECRET', 'ADMIN_JWT_SIGN_KEY'];
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    if (missing.length) {
        console.error(`FATAL: Missing required env vars in production: ${missing.join(', ')}`);
        process.exit(1);
    }
    if (!process.env.ALLOWED_ORIGINS) {
        console.error('FATAL: ALLOWED_ORIGINS must be set in production (no wildcard CORS)');
        process.exit(1);
    }
}

module.exports = resolvedConfig;
