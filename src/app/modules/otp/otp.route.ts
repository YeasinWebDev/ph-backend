// src/modules/otp/otp.routes.ts
import express from "express";
import { OTPController } from "./otp.controller";

export const otpRouter = express.Router();

otpRouter.post("/send", OTPController.sendOTP);
otpRouter.post("/verify", OTPController.verifyOTP);

