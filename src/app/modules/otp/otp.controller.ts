import { NextFunction, Request, Response } from "express";
import { OTPService } from "./otp.service";
import { sendResponse } from "../../../utils/sendResponse";

const sendOTP = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, name } = req.body;
    await OTPService.sendOTP(email, name);
    sendResponse(res, 200, "OTP sent successfully", null);
  } catch (error) {
    next(error)
  }
};

const verifyOTP = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, otp } = req.body;
    await OTPService.verifyOTP(email, otp);
    sendResponse(res, 200, "OTP verified successfully", null);
  } catch (error) {
    next(error)
  }
};

export const OTPController = {
  sendOTP,
  verifyOTP,
};
