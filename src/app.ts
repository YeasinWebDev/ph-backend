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
import { divisionRouter } from "./app/modules/division/division.route";
import { tourRouter } from "./app/modules/tour/tour.route";
import { bookingRoutes } from "./app/modules/booking/booking.route";
import { paymentRoute } from "./app/modules/payment/payment.route";
import { otpRouter } from "./app/modules/otp/otp.route";
import { statsRouter } from "./app/modules/stats/stats.route";
import { guideRoutes } from "./app/modules/guide/guide.route";

const app = express();

app.use(expressSession({
  secret:envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.set("trust proxy", 1)
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [envVars.FRONTEND_URL,"http://localhost:3000"],
  credentials: true
}));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Management System Backend",
  });
});

app.use("/api/v1/user", UserRouters);
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/division", divisionRouter)
app.use('/api/v1/tour', tourRouter)
app.use("/api/v1/booking", bookingRoutes)
app.use("/api/v1/payment", paymentRoute)
app.use("/api/v1/otp",otpRouter)
app.use("/api/v1/stats",statsRouter)
app.use("/api/v1/guide",guideRoutes)



app.use(notFound)
app.use(globalErrorHandler);

export default app;
