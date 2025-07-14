import cors from "cors";
import express, { Request, Response } from "express";
import { UserRouters } from "./app/modules/user/user.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { authRouter } from "./app/modules/auth/auth.route";
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import "./app/config/passport"
import { envVars } from "./app/config/env";

const app = express();

app.use(expressSession({
  secret:envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Management System Backend",
  });
});

app.use("/api/v1/user", UserRouters);
app.use("/api/v1/auth", authRouter)
app.use(globalErrorHandler);

app.use(notFound)

export default app;
