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
exports.seedSuperAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../app/config/env");
const user_model_1 = require("../app/modules/user/user.model");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, 10);
        const authProvider = {
            provider: "credentials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        if (!isSuperAdminExist) {
            yield user_model_1.User.create({
                name: "Super Admin",
                email: env_1.envVars.SUPER_ADMIN_EMAIL,
                password: hashedPassword,
                role: "SUPER_ADMIN",
                isVerified: true,
                auth: [authProvider],
            });
            console.log("super admin created");
        }
        else {
            console.log("super admin already exist");
        }
    }
    catch (error) {
        console.log(error, "from seedSuperAdmin");
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
