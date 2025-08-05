"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const user_interface_1 = require("./user.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const authProviderSchema = new mongoose_1.default.Schema({
    provider: {
        type: String,
        required: true,
    },
    providerId: {
        type: String,
        required: true,
    },
}, { versionKey: false, _id: false });
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
    bookings: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Booking" }],
    guides: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Guide" }],
}, { timestamps: true, versionKey: false });
exports.User = mongoose_1.default.model("User", userSchema);
