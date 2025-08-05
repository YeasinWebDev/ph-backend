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
exports.UserService = void 0;
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createUser = (payload, picture) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload, rest = __rest(payload, ["email"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new Error("User already exist");
    }
    if (!(payload === null || payload === void 0 ? void 0 : payload.password)) {
        throw new AppError_1.default("Password is required", 400);
    }
    const hashPassword = yield bcryptjs_1.default.hash(payload.password, 10);
    rest.password = hashPassword;
    const authProbider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ picture,
        email, auths: [authProbider] }, rest));
    return user;
});
const updateUser = (userId, payload, decodedToken, picture) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default("You are not authorized", 401);
        }
    }
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new Error("User not found");
    }
    if (decodedToken.role === user_interface_1.Role.SUPER_ADMIN && isUserExist.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default("You are not authorized", 401);
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new Error("You are not authorized");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new Error("You are not authorized");
        }
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, Object.assign(Object.assign({}, payload), { picture }), {
        new: true,
        runValidators: true,
    });
    if (picture && isUserExist.picture) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isUserExist.picture);
    }
    return newUpdatedUser;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield user_model_1.User.find();
    return allUser;
});
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    return user;
});
const getMe = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    return user;
});
exports.UserService = {
    createUser,
    getAllUsers,
    updateUser,
    getUser,
    getMe,
};
