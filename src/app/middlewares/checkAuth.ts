import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    try {
      const decoded = verifyToken(
        accessToken as string,
        "yeasin"
      ) as JwtPayload;
      if (!authRoles.includes(decoded.role)) {
        throw new Error("You are not permitted to access this route");
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
