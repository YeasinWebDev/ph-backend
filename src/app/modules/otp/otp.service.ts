import crypto from "crypto";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../../utils/sendEmail";
const OTP_EXPIRATION = 5 * 60; // 5minute

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 400);
  }
  if (user?.isVerified) {
    throw new AppError("User is already verified", 401);
  }

  const otp = generateOtp();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Verification code",
    templateName: "otp",
    templateData: { name, otp },
  });
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 400);
  }
  if(user?.isVerified){
    throw new AppError("User is already verified", 401);
  }
  const redisKey = `otp:${email}`;
  const storedOTP = await redisClient.get(redisKey);
  if (!storedOTP) {
    throw new AppError("OTP expired", 400);
  }
  if (storedOTP !== otp) {
    throw new AppError("Invalid OTP", 400);
  }
  user.isVerified = true;
  await Promise.all([user.save(), redisClient.del(redisKey)]);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
