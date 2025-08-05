"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login", auth_controller_1.authControllers.creadentialsLogin);
exports.authRouter.post("/refresh-token", auth_controller_1.authControllers.getNewAccessToken);
exports.authRouter.post("/logout", auth_controller_1.authControllers.logout);
exports.authRouter.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authControllers.changePassword);
exports.authRouter.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authControllers.setPassword);
exports.authRouter.post("/forget-password", auth_controller_1.authControllers.forgetPassword);
exports.authRouter.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authControllers.resetPassword);
exports.authRouter.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectUrl = req.query.redirect || "/";
    passport_1.default.authenticate("google", {
        scope: ["email", "profile"],
        state: redirectUrl,
    })(req, res, next);
}));
exports.authRouter.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${env_1.envVars.FRONTEND_URL}/login?error=There is an error with your account.Please contact with support team` }), auth_controller_1.authControllers.googleCallback);
