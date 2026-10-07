"use strict";

// Example controller — replace with your own business logic.

const { createSuccessResponse } = require("../helpers");
const { MESSAGES } = require('../utils/constants');

let controller = {};

/**
 * Health check endpoint.
 */
controller.healthCheck = async (payload) => {
    return createSuccessResponse('Server is running.', { timestamp: new Date().toISOString() });
};

module.exports = controller;
