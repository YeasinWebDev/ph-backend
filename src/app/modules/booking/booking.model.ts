import mongoose, { SchemaTypeOptions } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interfaces";

const bookingSchema = new mongoose.Schema<IBooking>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
    },
    guestCount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(BOOKING_STATUS),
        default: "PENDING",
    }as SchemaTypeOptions<BOOKING_STATUS> ,
}, { timestamps: true, versionKey: false });


export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);