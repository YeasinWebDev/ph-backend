"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, message, data, meta) => {
    res.status(statusCode).json({
        success: true,
        message,
        meta,
        data,
    });
};
exports.sendResponse = sendResponse;
