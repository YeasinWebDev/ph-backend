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
exports.GuideService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const guide_model_1 = require("./guide.model");
const guide_interface_1 = require("./guide.interface");
const applyForGuide = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield guide_model_1.Guide.findOne({ user: body.user.userId });
    if (isUserExist) {
        throw new AppError_1.default("You have already applied for guide", 400);
    }
    const payload = {
        user: body.user.userId,
        nidPhoto: body.nidPhoto,
        division: body.division,
        status: guide_interface_1.GuideStatus.PENDING,
    };
    const result = yield guide_model_1.Guide.create(payload);
    return result;
});
const approveGuide = (guideId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const isGuideExist = yield guide_model_1.Guide.findById(guideId);
    if (!isGuideExist) {
        throw new AppError_1.default("Guide not found", 400);
    }
    if (isGuideExist.status === guide_interface_1.GuideStatus.APPROVED || isGuideExist.status === guide_interface_1.GuideStatus.REJECTED) {
        throw new AppError_1.default("Guide already approved or rejected", 400);
    }
    if (status === "APPROVED") {
        status = guide_interface_1.GuideStatus.APPROVED;
    }
    else if (status === "REJECTED") {
        status = guide_interface_1.GuideStatus.REJECTED;
    }
    const result = yield guide_model_1.Guide.findByIdAndUpdate(guideId, { status }, { new: true });
    return result;
});
const getAllGuides = () => __awaiter(void 0, void 0, void 0, function* () {
    const guides = yield guide_model_1.Guide.find({}).populate("user", "name").populate("division", "name");
    const formatted = guides.map((guide) => {
        var _a, _b;
        return ({
            _id: guide._id,
            user: (_a = guide.user) === null || _a === void 0 ? void 0 : _a.name,
            division: (_b = guide.division) === null || _b === void 0 ? void 0 : _b.name,
            nidPhoto: guide.nidPhoto,
            status: guide.status,
            createdAt: guide.createdAt,
            updatedAt: guide.updatedAt,
        });
    });
    return formatted;
});
exports.GuideService = { applyForGuide, approveGuide, getAllGuides };
