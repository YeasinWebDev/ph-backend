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
exports.Tour = exports.TourType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tourTypeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.TourType = mongoose_1.default.model("TourType", tourTypeSchema);
const tourSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    images: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    costFrom: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    include: {
        type: [String],
        default: [],
    },
    exclude: {
        type: [String],
        default: [],
    },
    amenities: {
        type: [String],
        default: [],
    },
    tourPlan: {
        type: [String],
        default: [],
    },
    maxGuest: {
        type: Number,
    },
    minAge: {
        type: Number,
    },
    division: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Division",
        required: true,
    },
    tourType: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "TourType",
        required: true,
    },
    departureLocation: {
        type: String,
    },
    arrivalLocation: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false
});
tourSchema.pre("save", function (next) {
    if (!this.isModified("name"))
        return next();
    this.slug = this.name.toLowerCase().split(" ").join("-");
    next();
});
tourSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        ;
        if (!update.name)
            return next();
        update.slug = update.name.toLowerCase().split(" ").join("-");
        this.setUpdate(update);
        next();
    });
});
exports.Tour = mongoose_1.default.model("Tour", tourSchema);
