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
exports.globalErrorHandler = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handleDuplicateError_1 = require("../../helpers/handleDuplicateError");
const handleCastError_1 = require("../../helpers/handleCastError");
const handlerValidationError_1 = require("../../helpers/handlerValidationError");
const handleZodError_1 = require("../../helpers/handleZodError");
const cloudinary_config_1 = require("../config/cloudinary.config");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err, req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let errorSources = [];
    let statusCode = 500;
    let message = "Something Went Wrong!!";
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && req.files.length) {
        const imagesUrls = (_a = req.files) === null || _a === void 0 ? void 0 : _a.map((file) => file.path);
        yield Promise.all(imagesUrls.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    if (typeof err === "object" && err !== null) {
        const error = err;
        if (error.code === 11000) {
            const simplifiedError = (0, handleDuplicateError_1.handlerDuplicateError)({ message: err.message || "Duplicate key" });
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
        }
        else if (error.name === "CastError") {
            const simplifiedError = (0, handleCastError_1.handleCastError)();
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
        }
        else if (error.name === "ValidationError") {
            const simplifiedError = (0, handlerValidationError_1.handlerValidationError)(error);
            statusCode = simplifiedError.statusCode;
            errorSources = simplifiedError.errorSources;
            message = simplifiedError.message;
        }
        else if (error.name === "ZodError") {
            const simplifiedError = (0, handleZodError_1.handleZodError)(error);
            statusCode = simplifiedError.statusCode;
            errorSources = simplifiedError.errorSources;
            message = simplifiedError.message;
        }
        else if (err instanceof AppError_1.default) {
            statusCode = (_b = error.statusCode) !== null && _b !== void 0 ? _b : 500;
            message = (_c = error.message) !== null && _c !== void 0 ? _c : "Something Went Wrong!!";
        }
        else if (err instanceof Error) {
            message = (_d = error.message) !== null && _d !== void 0 ? _d : "Something Went Wrong!!";
        }
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
    });
});
exports.globalErrorHandler = globalErrorHandler;
