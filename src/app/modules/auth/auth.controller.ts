import { User } from "./../user/user.model";
import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";
import { sendResponse } from "../../../utils/sendResponse";
import { createToken } from "../../../utils/userTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { IUser } from "../user/user.interface";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";

interface Iuser extends IUser {
  toObject: () => Record<string, unknown>;
}

// const creadentialsLogin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     passport.authenticate("local", async (err: unknown, user: Iuser, info: { message: string }) => {
//       if (err) {
//         return next((err as Error)?.message);
//       }
//       if (!user) {
//         return next(new Error(info.message));
//       }
//       if(!user.isVerified){
//         return next(new Error("Your account is not verified"));
//       }

//       const tokenInfo = createToken(user);
//       res.cookie("accessToken", tokenInfo.accessToken, { httpOnly: true, secure: true ,sameSite:'none'});
//       res.cookie("refreshToken", tokenInfo.refreshToken, { httpOnly: true, secure: true,sameSite:'none' });
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const { password, ...rest } = user.toObject();

//       sendResponse(res, 200, "Login Successfully", { ...tokenInfo, user: rest });
//     })(req, res, next);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

export const creadentialsLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return new AppError("User not found", 404);
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password!);
    if (!isPasswordMatch) {
      return new AppError("Invalid Password", 400);
    }

    const tokenInfo = createToken(user);
    res.cookie("accessToken", tokenInfo.accessToken, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie("refreshToken", tokenInfo.refreshToken, { httpOnly: true, secure: true, sameSite: "none" });
    const { password, ...userData } = user.toObject();

    sendResponse(res, 200, "Login Successful", { ...tokenInfo, user: userData });
  } catch (error) {
    next(error);
  }
};

const getNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error("Refresh Token Not Found");
    }
    const tokenInfo = await authServices.getNewAccessToken(refreshToken);

    res.cookie("accessToken", tokenInfo.accessToken, { httpOnly: true, secure: true, sameSite: "none" });
    sendResponse(res, 200, "Get New Access Token", tokenInfo);
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    sendResponse(res, 200, "Logout Successfully", {});
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = req.user as JwtPayload;

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    await authServices.changePassword(decoded, newPassword, oldPassword);

    sendResponse(res, 200, "Reset Password Successfully", {});
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = req.user as JwtPayload;

    const { newPassword, id } = req.body;

    await authServices.resetPassword(decoded, newPassword, id);

    sendResponse(res, 200, "Reset Password Successfully", {});
  } catch (error) {
    next(error);
  }
};
const setPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = req.user as JwtPayload;
    const password = req.body.password;

    await authServices.setPassword(decoded.userId, password);

    sendResponse(res, 200, "Reset Password Successfully", {});
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;
    await authServices.forgetPassword(email);

    sendResponse(res, 200, "Email sent Successfully", {});
  } catch (error) {
    next(error);
  }
};

const googleCallback = async (req: Request, res: Response) => {
  let redirecTo = req.query.state ? (req.query.state as string) : "";
  if (redirecTo) {
    redirecTo = redirecTo.slice(1);
  }
  const user = req.user;
  if (!user) {
    throw new Error("User Not Found");
  }

  const tokenInfo = createToken(user);
  res.cookie("accessToken", tokenInfo.accessToken, { httpOnly: true, secure: true, sameSite: "none" });
  res.cookie("refreshToken", tokenInfo.refreshToken, { httpOnly: true, secure: true, sameSite: "none" });

  res.redirect(`${envVars.FRONTEND_URL}/${redirecTo}`);
};

export const authControllers = {
  creadentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  changePassword,
  googleCallback,
  setPassword,
  forgetPassword,
};
