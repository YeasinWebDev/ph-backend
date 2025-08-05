"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRouter = void 0;
// src/modules/otp/otp.routes.ts
const express_1 = __importDefault(require("express"));
const otp_controller_1 = require("./otp.controller");
exports.otpRouter = express_1.default.Router();
exports.otpRouter.post("/send", otp_controller_1.OTPController.sendOTP);
exports.otpRouter.post("/verify", otp_controller_1.OTPController.verifyOTP);
