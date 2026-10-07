'use strict';

const winston = require('winston');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CONFIG = require('../../config');
const mongoose = require('mongoose');

const SALT_ROUNDS = 10;

let utils = {};

/**
 * Colorful console log helpers.
 */
utils.log = {
    success: (msg) => console.log('\x1b[32m%s\x1b[0m', msg),
    error: (msg) => console.log('\x1b[31m%s\x1b[0m', msg),
    info: (msg) => console.log('\x1b[36m%s\x1b[0m', msg),
};

/**
 * Winston logger — writes error logs to file.
 */
utils.logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'data/logs/error.log', level: 'error' }),
    ],
});

/**
 * Hash a plaintext password.
 */
utils.hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plaintext with hashed password.
 */
utils.comparePassword = async (plainText, hash) => {
    return bcrypt.compare(plainText, hash);
};

/**
 * Create a JWT token.
 */
utils.encryptJwt = (payload, expiresIn) => {
    return jwt.sign(payload, CONFIG.JWT_SECRET || CONFIG.ADMIN_JWT_SIGN_KEY, { expiresIn: expiresIn || CONFIG.JWT_EXPIRY || '24h' });
};

/**
 * Decrypt/verify a JWT token.
 */
utils.decryptJwt = (token) => {
    try {
        return jwt.verify(token, CONFIG.JWT_SECRET || CONFIG.ADMIN_JWT_SIGN_KEY);
    } catch (err) {
        return null;
    }
};

/**
 * Convert a Joi validation error into a human-readable string.
 */
utils.convertErrorIntoReadableForm = (error) => {
    let errorMessage = '';
    if (error.message) {
        errorMessage = error.message;
    }
    if (error.details && error.details.length) {
        errorMessage = error.details.map(d => d.message).join(', ');
    }
    return { message: errorMessage };
};

/**
 * Convert a string to a Mongoose ObjectId.
 */
utils.convertIdToMongooseId = (id) => {
    return new mongoose.Types.ObjectId(id);
};

/**
 * Generate OTP of given length.
 */
utils.generateOTP = (length = 6) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

/**
 * Generate token expiry date from now + seconds.
 */
utils.generateExpiryTime = (seconds) => {
    return new Date(Date.now() + seconds * 1000);
};

module.exports = utils;
