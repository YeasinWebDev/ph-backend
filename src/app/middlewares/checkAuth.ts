import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    try {
      const decoded = verifyToken(accessToken as string, "yeasin") as JwtPayload;

      const isUserExist = await User.findOne({ email: decoded.email });

      if (!isUserExist) {
        throw new AppError("User does not exist", 400);
      }
      // if (!isUserExist.isVerified) {
      //   throw new AppError("User is not verified", 400);
      // }
      if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(`User is ${isUserExist.isActive}`, 400);
      }
      if (isUserExist.isDeleted) {
        throw new AppError("User is deleted", 400);
      }

      if (!authRoles.includes(decoded.role)) {
        throw new Error("You are not permitted to access this route");
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
