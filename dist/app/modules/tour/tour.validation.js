"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourSchema = exports.createTourSchema = exports.updateTourTypeZodSchema = exports.createTourTypeZodSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
// tour types
exports.createTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
});
exports.updateTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
});
// tour
const objectIdSchema = zod_1.default.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
exports.createTourSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    images: zod_1.default.array(zod_1.default.string().url()).optional(),
    description: zod_1.default.string().optional(),
    location: zod_1.default.string().optional(),
    costFrom: zod_1.default.number().nonnegative().optional(),
    startDate: zod_1.default.coerce.date().optional(),
    endDate: zod_1.default.coerce.date().optional(),
    include: zod_1.default.array(zod_1.default.string()).optional(),
    exclude: zod_1.default.array(zod_1.default.string()).optional(),
    amenities: zod_1.default.array(zod_1.default.string()).optional(),
    tourPlan: zod_1.default.array(zod_1.default.string()).optional(),
    maxGuest: zod_1.default.number().int().positive().optional(),
    minAge: zod_1.default.number().int().nonnegative().optional(),
    division: objectIdSchema,
    tourType: objectIdSchema,
    departureLocation: zod_1.default.string().optional(),
    arrivalLocation: zod_1.default.string().optional(),
});
exports.updateTourSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required").optional(),
    slug: zod_1.default.string().min(1, "Slug is required").optional(),
    images: zod_1.default.array(zod_1.default.string().url()).optional(),
    description: zod_1.default.string().optional(),
    location: zod_1.default.string().optional(),
    costFrom: zod_1.default.number().nonnegative().optional(),
    startDate: zod_1.default.coerce.date().optional(),
    endDate: zod_1.default.coerce.date().optional(),
    include: zod_1.default.array(zod_1.default.string()).optional(),
    exclude: zod_1.default.array(zod_1.default.string()).optional(),
    amenities: zod_1.default.array(zod_1.default.string()).optional(),
    tourPlan: zod_1.default.array(zod_1.default.string()).optional(),
    maxGuest: zod_1.default.number().int().positive().optional(),
    minAge: zod_1.default.number().int().nonnegative().optional(),
    division: objectIdSchema.optional(),
    tourType: objectIdSchema.optional(),
    departureLocation: zod_1.default.string().optional(),
    arrivalLocation: zod_1.default.string().optional(),
    deleteImages: zod_1.default.array(zod_1.default.string()).optional(),
});
