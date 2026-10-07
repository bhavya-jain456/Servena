'use strict';

let CONSTANTS = {};

CONSTANTS.SERVER = {
    ONE: 1
};

CONSTANTS.SERVER_TYPES = {
    API: 'api',
    SOCKET: 'socket'
};

CONSTANTS.AVAILABLE_AUTHS = {
    ADMIN: 'admin',
    STAFF: 'staff',
    USER: 'user',
    ADMIN_STAFF: 'admin_staff',
    USER_STAFF: 'user_staff',
    ADMIN_USER: 'admin_user',
    ALL: 'all',
    CRON: 'cron',
};

CONSTANTS.TOKEN_TYPES = {
    LOGIN: 1,
    RESET_PASSWORD: 2,
    OTP: 3,
    BACKUP_LOGIN: 4,
    CRON_TOKEN: 7,
    USER_2FA: 8,
    PHONE_VERIFICATION_FOR_2FA: 9
};

CONSTANTS.DATABASE_VERSIONS = {
    ONE: 1,
};

CONSTANTS.DEFAULT = {
    STATUS: {
        ACTIVE: 1,
        INACTIVE: 2,
        DELETED: 3
    }
};

CONSTANTS.USER_TYPE = {
    USER: 1,
    STAFF: 2,
    SUPER_ADMIN: 3
};

CONSTANTS.USER_STATUS = {
    ACTIVE: 1,
    INACTIVE: 2,
    DELETED: 3,
    DISABLED: 4
};

CONSTANTS.GENDER = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other'
};

CONSTANTS.DEVICE_TYPES = {
    IOS: 1,
    ANDROID: 2,
    WEB: 3
};

CONSTANTS.SIGNUP_STEP = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
};

CONSTANTS.PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

CONSTANTS.NORMAL_PROJECTION = { __v: 0, createdAt: 0, updatedAt: 0 };

CONSTANTS.ERROR_TYPES = {
    DATA_NOT_FOUND: 'DATA_NOT_FOUND',
    BAD_REQUEST: 'BAD_REQUEST',
    MONGO_EXCEPTION: 'MONGO_EXCEPTION',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    FORBIDDEN: 'FORBIDDEN',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
};

CONSTANTS.MESSAGES = {
    SUCCESS: 'Success.',
    SOMETHING_WENT_WRONG: 'Something went wrong.',
    UNAUTHORIZED: 'Unauthorized.',
    FORBIDDEN: (method, path) => `You are not allowed to ${method} ${path}.`,
    NOT_FOUND: 'Not found.',
    USER_NOT_EXIST: 'User does not exist.',
    USER_ALREADY_EXISTS: 'User already exists.',
    INVALID_PASSWORD: 'Invalid password.',
    LOGGED_IN_SUCCESSFULLY: 'Logged in successfully.',
    INVALID_OTP: 'Invalid OTP.',
    OTP_EXPIRED: 'OTP has expired.',
    CREATED: 'Created successfully.',
    UPDATED: 'Updated successfully.',
    DELETED: 'Deleted successfully.',
};

CONSTANTS.LOG_APIS = [];
CONSTANTS.SLACK_LOG_APIS = [];

module.exports = CONSTANTS;
