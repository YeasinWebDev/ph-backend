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
exports.TourService = void 0;
const tour_model_1 = require("./tour.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sendResponse_1 = require("../../../utils/sendResponse");
const tour_constant_1 = require("./tour.constant");
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// tourTypes
const createTourType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExist = yield tour_model_1.TourType.findOne({ name: req.body.name });
        if (isExist) {
            throw new AppError_1.default("Tour type already exist", 400);
        }
        const result = yield tour_model_1.TourType.create(req.body);
        (0, sendResponse_1.sendResponse)(res, 200, "Tour type created successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const allToursType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const result = yield tour_model_1.TourType.find(query);
        const totalToursType = yield tour_model_1.TourType.countDocuments();
        (0, sendResponse_1.sendResponse)(res, 200, "Tours fetched successfully", {
            tourTypes: result,
            totalToursType,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateToursType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExist = yield tour_model_1.TourType.findOne({ _id: req.params.id });
        if (!isExist) {
            throw new AppError_1.default("Tour type not exist", 400);
        }
        const result = yield tour_model_1.TourType.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        (0, sendResponse_1.sendResponse)(res, 200, "Tours updated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteToursType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield tour_model_1.TourType.findByIdAndDelete(req.params.id);
        (0, sendResponse_1.sendResponse)(res, 200, "Tours deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
// tour
const createTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const slug = req.body.name.toLowerCase().split(" ").join("-");
        req.body.slug = slug;
        const payload = Object.assign(Object.assign({}, req.body), { images: (_a = req.files) === null || _a === void 0 ? void 0 : _a.map((file) => file.path) });
        const result = yield tour_model_1.Tour.create(payload);
        (0, sendResponse_1.sendResponse)(res, 200, "Tour created successfully", result);
    }
    catch (error) {
        next(error);
    }
});
// const allTours = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const query = req.query;
//     const sort = req.query.sort || "-createdAt";
//     const search = req.query.search || "";
//     const fields =
//       ((req.query.fields as string) || "").split(",").join(" ") || "";
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     for (const field of excludeFields) {
//       delete query[field];
//     }
//     const result = await Tour.find({
//       $or: toursearchFields.map((field) => ({
//         [field]: {
//           $regex: search,
//           $options: "i",
//         },
//       })),
//     })
//       .find(query)
//       .sort(sort as string)
//       .select(fields)
//       .populate(["tourType", "division"])
//       .skip(skip)
//       .limit(limit);
//     const totalTour = await Tour.countDocuments();
//     const meta ={
//       total: totalTour,
//       page,
//       limit,
//       totalPages: Math.ceil(totalTour / limit),
//     }
//     sendResponse(res, 200, "Tours fetched successfully", {
//       tours: result,
//       meta
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const allTours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const quaryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), parsedQuery);
        const tours = yield quaryBuilder.search(tour_constant_1.toursearchFields).filter().sort().fields().pagination().getResults();
        const meta = yield quaryBuilder.getMeta();
        (0, sendResponse_1.sendResponse)(res, 200, "Tours fetched successfully", {
            meta,
            tours,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const tourId = req.params.id;
        const isExist = yield tour_model_1.Tour.findById(tourId);
        if (!isExist) {
            throw new AppError_1.default("Tour not exist", 400);
        }
        const payload = Object.assign(Object.assign({}, req.body), { images: (_b = req.files) === null || _b === void 0 ? void 0 : _b.map((file) => file.path) });
        // update images
        if (payload.image && payload.image.length > 0 && isExist.images && isExist.images.length > 0) {
            payload.images = [...isExist.images, ...payload.images];
        }
        if (payload.deleteImages && payload.deleteImages.length > 0 && isExist.images && isExist.images.length > 0) {
            const restDbImages = isExist.images.filter((image) => !payload.deleteImages.includes(image));
            const updatedPayloadImages = (payload.Images || [])
                .filter((image) => !(payload === null || payload === void 0 ? void 0 : payload.deleteImages.includes(image)))
                .filter((image) => !restDbImages.includes(image));
            payload.images = [...restDbImages, ...updatedPayloadImages];
        }
        const result = yield tour_model_1.Tour.findByIdAndUpdate(tourId, payload, {
            new: true,
        });
        // delete images from cloudinary
        if (payload.deleteImages && payload.deleteImages.length > 0) {
            yield Promise.all(payload.deleteImages.map((image) => (0, cloudinary_config_1.deleteImageFromCloudinary)(image)));
        }
        (0, sendResponse_1.sendResponse)(res, 200, "Tour updated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const getSingleTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const result = yield tour_model_1.Tour.findOne({ slug });
        (0, sendResponse_1.sendResponse)(res, 200, "Tour fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = req.params.id;
    try {
        const result = yield tour_model_1.Tour.findByIdAndDelete(tourId);
        (0, sendResponse_1.sendResponse)(res, 200, "Tour deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.TourService = {
    createTourType,
    allToursType,
    updateToursType,
    deleteToursType,
    // tour
    createTour,
    allTours,
    updateTour,
    deleteTour,
    getSingleTour,
};
