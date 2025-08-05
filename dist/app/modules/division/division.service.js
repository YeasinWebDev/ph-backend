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
exports.DivisionService = void 0;
const division_model_1 = require("./division.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sendResponse_1 = require("../../../utils/sendResponse");
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createDevision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    try {
        const isExist = yield division_model_1.Division.findOne({ name: data.name });
        if (isExist) {
            throw new AppError_1.default("Division already exist", 400);
        }
        const payload = Object.assign(Object.assign({}, data), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
        const result = yield division_model_1.Division.create(payload);
        (0, sendResponse_1.sendResponse)(res, 200, "Division created successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const getAllDevision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedQuery = Object.entries(req.query).reduce((acc, [key, value]) => {
            if (typeof value === "string") {
                acc[key] = value;
            }
            else if (Array.isArray(value)) {
                acc[key] = typeof value[0] === "string" ? value[0] : "";
            }
            else {
                acc[key] = "";
            }
            return acc;
        }, {});
        const quaryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), parsedQuery);
        const divisions = yield quaryBuilder.search([]).filter().sort().fields().pagination().getResults();
        const meta = yield quaryBuilder.getMeta();
        (0, sendResponse_1.sendResponse)(res, 200, "Division fetched successfully", {
            meta,
            divisions,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleDevision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const result = yield division_model_1.Division.findOne({ slug });
        (0, sendResponse_1.sendResponse)(res, 200, "Division fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const updateDevision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const divisionId = req.params.id;
        const data = req.body;
        const findDivision = yield division_model_1.Division.findById(divisionId);
        if (!findDivision) {
            throw new AppError_1.default("Division not found", 400);
        }
        const isExist = yield division_model_1.Division.findOne({
            name: data.name,
            _id: { $ne: divisionId },
        });
        if (!isExist) {
            throw new AppError_1.default("Division not exist", 400);
        }
        const payload = Object.assign(Object.assign({}, data), { thumbnail: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path });
        const result = yield division_model_1.Division.findByIdAndUpdate(divisionId, payload, {
            new: true,
            runValidators: true,
        });
        if (((_c = req.file) === null || _c === void 0 ? void 0 : _c.path) && isExist.thumbnail) {
            yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isExist.thumbnail);
        }
        (0, sendResponse_1.sendResponse)(res, 200, "Division updated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteDivision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const divisionId = req.params.id;
        const findDivision = yield division_model_1.Division.findById(divisionId);
        if (!findDivision) {
            throw new AppError_1.default("Division not found", 400);
        }
        const result = yield division_model_1.Division.findByIdAndDelete(divisionId);
        (0, sendResponse_1.sendResponse)(res, 200, "Division deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.DivisionService = {
    createDevision,
    getAllDevision,
    updateDevision,
    deleteDivision,
    getSingleDevision,
};
