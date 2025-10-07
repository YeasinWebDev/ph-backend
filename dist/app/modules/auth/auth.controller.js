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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../../utils/sendResponse");
const userTokens_1 = require("../../../utils/userTokens");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
const creadentialsLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
            // console.log(err)
            if (err) {
                return next(err === null || err === void 0 ? void 0 : err.message);
            }
            if (!user) {
                return next(new Error(info.message));
            }
            if (!user.isVerified) {
                return next(new Error("User is not verified"));
            }
            // const jwtpayload = {userId:user._id,email:user.email,role:user.role}
            const tokenInfo = (0, userTokens_1.createToken)(user);
            res.cookie("accessToken", tokenInfo.accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
            res.cookie("refreshToken", tokenInfo.refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
            (0, sendResponse_1.sendResponse)(res, 200, "Login Successfully", Object.assign(Object.assign({}, tokenInfo), { user: rest }));
        }))(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
const getNewAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new Error("Refresh Token Not Found");
        }
        const tokenInfo = yield auth_service_1.authServices.getNewAccessToken(refreshToken);
        res.cookie("accessToken", tokenInfo.accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
        (0, sendResponse_1.sendResponse)(res, 200, "Get New Access Token", tokenInfo);
    }
    catch (error) {
        next(error);
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        (0, sendResponse_1.sendResponse)(res, 200, "Logout Successfully", {});
    }
    catch (error) {
        next(error);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = req.user;
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        yield auth_service_1.authServices.changePassword(decoded, newPassword, oldPassword);
        (0, sendResponse_1.sendResponse)(res, 200, "Reset Password Successfully", {});
    }
    catch (error) {
        next(error);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = req.user;
        const { newPassword, id } = req.body;
        yield auth_service_1.authServices.resetPassword(decoded, newPassword, id);
        (0, sendResponse_1.sendResponse)(res, 200, "Reset Password Successfully", {});
    }
    catch (error) {
        next(error);
    }
});
const setPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = req.user;
        const password = req.body.password;
        yield auth_service_1.authServices.setPassword(decoded.userId, password);
        (0, sendResponse_1.sendResponse)(res, 200, "Reset Password Successfully", {});
    }
    catch (error) {
        next(error);
    }
});
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        yield auth_service_1.authServices.forgetPassword(email);
        (0, sendResponse_1.sendResponse)(res, 200, "Email sent Successfully", {});
    }
    catch (error) {
        next(error);
    }
});
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let redirecTo = req.query.state ? req.query.state : "";
    if (redirecTo) {
        redirecTo = redirecTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new Error("User Not Found");
    }
    const tokenInfo = (0, userTokens_1.createToken)(user);
    res.cookie("accessToken", tokenInfo.accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie("refreshToken", tokenInfo.refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirecTo}`);
});
exports.authControllers = {
    creadentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    changePassword,
    googleCallback,
    setPassword,
    forgetPassword,
};
