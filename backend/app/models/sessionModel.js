"use strict";

const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const { TOKEN_TYPES } = require("../utils/constants");

/************* Session Model ***********/
const sessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', index: true },
    token: { type: String },
    tokenType: { type: Number, enum: Object.values(TOKEN_TYPES) },
    tokenExpDate: { type: Date },
    remoteAddress: { type: String },
    userType: { type: Number },
    appVersion: { type: String },
    deviceType: { type: String },
}, { timestamps: true, versionKey: false });

sessionSchema.index({ token: 1, tokenType: 1 });

module.exports = MONGOOSE.model('sessions', sessionSchema);
