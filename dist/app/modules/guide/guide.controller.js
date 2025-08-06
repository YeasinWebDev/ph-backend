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
exports.GuideController = void 0;
const guide_service_1 = require("./guide.service");
const sendResponse_1 = require("../../../utils/sendResponse");
const applyForGuide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const payload = Object.assign(Object.assign({ nidPhoto: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }, req.body), { user });
        const result = yield guide_service_1.GuideService.applyForGuide(payload);
        (0, sendResponse_1.sendResponse)(res, 200, "Guide applied successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const approveGuide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guideId = req.params.id;
        const status = req.body.status;
        const result = yield guide_service_1.GuideService.approveGuide(guideId, status);
        (0, sendResponse_1.sendResponse)(res, 200, "Guide approved successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const getAllGuides = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield guide_service_1.GuideService.getAllGuides();
        (0, sendResponse_1.sendResponse)(res, 200, "Guides fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.GuideController = {
    applyForGuide,
    approveGuide,
    getAllGuides,
};
