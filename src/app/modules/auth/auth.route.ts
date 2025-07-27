import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

export const authRouter = Router();

authRouter.post("/login", authControllers.creadentialsLogin);
authRouter.post("/refresh-token", authControllers.getNewAccessToken);
authRouter.post("/logout", authControllers.logout);
authRouter.post("/change-password", checkAuth(...Object.values(Role)), authControllers.changePassword);
authRouter.post("/set-password", checkAuth(...Object.values(Role)), authControllers.setPassword);
authRouter.post("/forget-password", authControllers.forgetPassword);
authRouter.post("/reset-password", checkAuth(...Object.values(Role)), authControllers.resetPassword);


authRouter.get("/google", async (req: Request, res: Response, next: NextFunction) => {
  const redirectUrl = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: redirectUrl as string,
  })(req, res, next);
});

authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is an error with your account.Please contact with support team` }), authControllers.googleCallback);
