import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

export const authRouter = Router();

authRouter.post("/login", authControllers.creadentialsLogin);
authRouter.post("/refresh-token", authControllers.getNewAccessToken);
authRouter.post("/logout", authControllers.logout);
authRouter.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authControllers.resetPassword
);

authRouter.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirectUrl = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["email", "profile"],
      state: redirectUrl as string,
    })(req, res, next);
  }
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authControllers.googleCallback
);
