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
exports.BookingService = void 0;
const getTransactionId_1 = require("../../../utils/getTransactionId");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const tour_model_1 = require("../tour/tour.model");
const user_model_1 = require("../user/user.model");
const booking_interfaces_1 = require("./booking.interfaces");
const booking_model_1 = require("./booking.model");
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transactionId = (0, getTransactionId_1.getTransactionId)();
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if ((user === null || user === void 0 ? void 0 : user.isVerified) === false) {
            throw new AppError_1.default("User is not verified", 400);
        }
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.default("User phone and address is required", 400);
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!(tour === null || tour === void 0 ? void 0 : tour.costFrom)) {
            throw new AppError_1.default("No Tour Cost Found!", 400);
        }
        const guestCount = (_a = payload.guestCount) !== null && _a !== void 0 ? _a : 1;
        const amount = Number(tour.costFrom) * Number(guestCount);
        const booking = yield booking_model_1.Booking.create([
            Object.assign({ user: userId, status: booking_interfaces_1.BOOKING_STATUS.PENDING }, payload),
        ], { session });
        const payment = yield payment_model_1.Payment.create([
            {
                booking: booking[0]._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId,
                amount,
            },
        ], { session });
        const updateBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, {
            payment: payment[0]._id,
        }, { new: true, runValidators: true, session })
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");
        const userAddress = (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).address;
        const userEmail = (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).email;
        const userPhoneNumber = (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).phone;
        const userName = (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).name;
        const sslPayload = {
            address: userAddress !== null && userAddress !== void 0 ? userAddress : "",
            email: userEmail !== null && userEmail !== void 0 ? userEmail : "",
            phoneNumber: userPhoneNumber !== null && userPhoneNumber !== void 0 ? userPhoneNumber : "",
            name: userName,
            amount: amount,
            transactionId: transactionId,
        };
        const sslCommerz = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        yield session.endSession();
        return {
            booking: updateBooking,
            payment: sslCommerz.GatewayPageURL,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
exports.BookingService = { createBooking };
