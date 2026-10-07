'use strict';

const { SessionModel } = require('../models');

let sessionService = {};

/**
 * Get a session.
 */
sessionService.getSession = async (criteria) => {
    return SessionModel.findOne(criteria).lean();
};

/**
 * Create or update a session.
 */
sessionService.upsertSession = async (criteria, data) => {
    return SessionModel.findOneAndUpdate(criteria, data, { new: true, upsert: true }).lean();
};

/**
 * Remove a session.
 */
sessionService.removeSession = async (criteria) => {
    return SessionModel.deleteOne(criteria);
};

module.exports = sessionService;
