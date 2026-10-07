"use strict";

const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const { GENDER, USER_TYPE, USER_STATUS, SIGNUP_STEP, DEVICE_TYPES } = require("../utils/constants");

/************* User Model ***********/
const userSchema = new Schema({
    name: { type: String, trim: true },
    email: { type: String, index: true },
    password: { type: String },
    userType: { type: Number, enum: Object.values(USER_TYPE), default: USER_TYPE.USER },
    profileUrl: { type: String, default: '' },
    gender: { type: String, enum: Object.values(GENDER) },
    dob: { type: Date },
    phone: { type: String, index: true },
    status: { type: Number, enum: Object.values(USER_STATUS) },
    signupStep: { type: Number, enum: Object.values(SIGNUP_STEP), default: SIGNUP_STEP.FIRST },
    timeZone: { type: String },
    country: { type: String },
    deviceToken: { type: String },
    deviceType: { type: Number, enum: Object.values(DEVICE_TYPES) },
    enabled2FA: { type: Boolean },
    isPhoneVerified: { type: Boolean },
}, { timestamps: true, versionKey: false });

/** Compound indexes */
userSchema.index({ userType: 1, status: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

module.exports = MONGOOSE.model('users', userSchema);
