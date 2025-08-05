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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../../utils/sendResponse");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const picture = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const user = yield user_service_1.UserService.createUser(req.body, picture);
        (0, sendResponse_1.sendResponse)(res, 200, "User created successfully", user);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const verify = req.user;
        const newPicture = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
        const user = yield user_service_1.UserService.updateUser(req.params.id, req.body, verify, newPicture);
        (0, sendResponse_1.sendResponse)(res, 200, "User updated successfully", user);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_service_1.UserService.getAllUsers();
        const meta = { total: users.length };
        (0, sendResponse_1.sendResponse)(res, 200, "Users fetched successfully", users, meta);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.UserService.getUser(req.params.id);
        (0, sendResponse_1.sendResponse)(res, 200, "User fetched successfully", user);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.UserService.getMe(req.user);
        (0, sendResponse_1.sendResponse)(res, 200, "User fetched successfully", user);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.userController = {
    createUser,
    getAllUsers,
    updateUser,
    getUser,
    getMe
};
