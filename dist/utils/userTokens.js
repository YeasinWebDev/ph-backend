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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenByRefreshToken = exports.createToken = void 0;
const env_1 = require("../app/config/env");
const user_interface_1 = require("../app/modules/user/user.interface");
const jwt_1 = require("./jwt");
const user_model_1 = require("../app/modules/user/user.model");
const createToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, "yeasin", "1d");
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESS_EXPIRES);
    return { accessToken, refreshToken };
};
exports.createToken = createToken;
const createNewAccessTokenByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verfiyRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    const isUserExist = yield user_model_1.User.findOne({
        email: verfiyRefreshToken.email,
    });
    if (!isUserExist) {
        throw new Error("User Not Found");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new Error(`User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new Error("User Deleted");
    }
    const userPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = (0, jwt_1.generateToken)(userPayload, "yeasin", "1d");
    return { accessToken };
});
exports.createNewAccessTokenByRefreshToken = createNewAccessTokenByRefreshToken;
