"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const booking_interfaces_1 = require("./booking.interfaces");
const bookingSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tour: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
    },
    payment: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Payment",
    },
    guestCount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(booking_interfaces_1.BOOKING_STATUS),
        default: "PENDING",
    },
}, { timestamps: true, versionKey: false });
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
