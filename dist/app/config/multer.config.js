"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.malterUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const stroage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.CloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLocaleLowerCase()
                .replace(/\s+/g, "-")
                .replace(/\./g, "-")
                .replace(/[^a-z0-9.-]/g, ""); // non alpha numeric - !@#$
            const uniqueFIleName = Math.random().toString(36).substring(2) +
                "-" +
                Date.now() +
                "-" +
                fileName;
            return uniqueFIleName;
        },
    },
});
exports.malterUpload = (0, multer_1.default)({ storage: stroage });
