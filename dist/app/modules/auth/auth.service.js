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
exports.authServices = void 0;
const user_interface_1 = require("./../user/user.interface");
const userTokens_1 = require("../../../utils/userTokens");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const sendEmail_1 = require("../../../utils/sendEmail");
// const creadentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;
//   const isUserExist = await User.findOne({ email });
//   if (!isUserExist) {
//     throw new Error("User Not Found");
//   }
//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     isUserExist?.password as string
//   );
//   if (!isPasswordMatched) {
//     throw new Error("Invalid Password");
//   }
//   const userWithoutPassword = isUserExist.toObject();
//   delete userWithoutPassword.password;
//   const Tokendata = createToken(userWithoutPassword);
//   return { ...Tokendata, user: userWithoutPassword };
// };
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield (0, userTokens_1.createNewAccessTokenByRefreshToken)(refreshToken);
    return Object.assign({}, accessToken);
});
const changePassword = (decoded, newPassword, oldPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: decoded.email });
    if (!isUserExist) {
        throw new Error("User Not Found");
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(oldPassword, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (!isPasswordMatched) {
        throw new Error("Old Password Not Matched");
    }
    const hashPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    isUserExist.password = hashPassword;
    yield isUserExist.save();
});
const resetPassword = (decoded, newPassword, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (id !== decoded.userId) {
        throw new AppError_1.default("you can not reset password of another user", 400);
    }
    const isUserExist = yield user_model_1.User.findOne({ email: decoded.email });
    if (!isUserExist) {
        throw new AppError_1.default("User Not Found", 400);
    }
    const hashPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    isUserExist.password = hashPassword;
    yield isUserExist.save();
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ _id: userId });
    if (!isUserExist) {
        throw new Error("User Not Found");
    }
    if (isUserExist.password && isUserExist.auths.some((auth) => auth.provider === "google")) {
        throw new AppError_1.default("Password already set , now you can change the password from your profile password update", 400);
    }
    const hashPassword = yield bcryptjs_1.default.hash(plainPassword, 10);
    const creadentialsProvider = { provider: "credentials", providerId: isUserExist.email };
    const auths = [...isUserExist.auths, creadentialsProvider];
    isUserExist.auths = auths;
    isUserExist.password = hashPassword;
    yield isUserExist.save();
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default("User does not exist", 400);
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(`User is ${isUserExist.isActive}`, 400);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default("User is deleted", 400);
    }
    const jwtPayloadData = {
        userId: isUserExist._id,
        role: isUserExist.role,
        email: isUserExist.email,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayloadData, "yeasin", { expiresIn: "10min" });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: isUserExist.email,
        subject: "Reset Password",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    });
});
exports.authServices = {
    // creadentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgetPassword,
};
