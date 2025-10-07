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
exports.checkAuth = void 0;
const jwt_1 = require("../../utils/jwt");
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_interface_1 = require("../modules/user/user.interface");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.authorization || req.cookies.accessToken;
    try {
        const decoded = (0, jwt_1.verifyToken)(accessToken, "yeasin");
        const isUserExist = yield user_model_1.User.findOne({ email: decoded.email });
        if (!isUserExist) {
            throw new AppError_1.default("User does not exist", 400);
        }
        // if (!isUserExist.isVerified) {
        //   throw new AppError("User is not verified", 400);
        // }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(`User is ${isUserExist.isActive}`, 400);
        }
        if (isUserExist.isDeleted) {
            throw new AppError_1.default("User is deleted", 400);
        }
        if (!authRoles.includes(decoded.role)) {
            throw new Error("You are not permitted to access this route");
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
