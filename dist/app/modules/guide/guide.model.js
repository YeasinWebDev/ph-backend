"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guide = exports.guideSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const guide_interface_1 = require("./guide.interface");
exports.guideSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    nidPhoto: {
        type: String,
        required: true,
    },
    division: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Division",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(guide_interface_1.GuideStatus),
        default: guide_interface_1.GuideStatus.PENDING,
    },
}, { timestamps: true, versionKey: false });
exports.Guide = mongoose_1.default.model("Guide", exports.guideSchema);
