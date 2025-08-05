"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const user_route_1 = require("./app/modules/user/user.route");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const auth_route_1 = require("./app/modules/auth/auth.route");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/config/passport");
const env_1 = require("./app/config/env");
const division_route_1 = require("./app/modules/division/division.route");
const tour_route_1 = require("./app/modules/tour/tour.route");
const booking_route_1 = require("./app/modules/booking/booking.route");
const payment_route_1 = require("./app/modules/payment/payment.route");
const otp_route_1 = require("./app/modules/otp/otp.route");
const stats_route_1 = require("./app/modules/stats/stats.route");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.set("trust proxy", 1);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONTEND_URL,
    credentials: true
}));
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend",
    });
});
app.use("/api/v1/user", user_route_1.UserRouters);
app.use("/api/v1/auth", auth_route_1.authRouter);
app.use("/api/v1/division", division_route_1.divisionRouter);
app.use('/api/v1/tour', tour_route_1.tourRouter);
app.use("/api/v1/booking", booking_route_1.bookingRoutes);
app.use("/api/v1/payment", payment_route_1.paymentRoute);
app.use("/api/v1/otp", otp_route_1.otpRouter);
app.use("/api/v1/stats", stats_route_1.statsRouter);
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
