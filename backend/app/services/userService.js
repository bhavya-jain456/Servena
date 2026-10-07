'use strict';

const { UserModel } = require('../models');

let userService = {};

/**
 * Get a single user by criteria.
 */
userService.getUser = async (criteria, projection = {}) => {
    return UserModel.findOne(criteria, projection).lean();
};

/**
 * Get multiple users by criteria.
 */
userService.getUsers = async (criteria, projection = {}) => {
    return UserModel.find(criteria, projection).lean();
};

/**
 * Create a new user.
 */
userService.createUser = async (data) => {
    return UserModel.create(data);
};

/**
 * Update a user.
 */
userService.updateUser = async (criteria, dataToUpdate, projection) => {
    return UserModel.findOneAndUpdate(criteria, dataToUpdate, { new: true, projection }).lean();
};

/**
 * Delete a user (soft delete via status change).
 */
userService.deleteUser = async (criteria) => {
    return UserModel.findOneAndUpdate(criteria, { status: 3 }, { new: true }).lean();
};

module.exports = userService;
