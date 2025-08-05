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
exports.PaymentService = void 0;
const booking_model_1 = require("./../booking/booking.model");
const invoice_1 = require("../../../utils/invoice");
const sendEmail_1 = require("../../../utils/sendEmail");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const booking_interfaces_1 = require("../booking/booking.interfaces");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default("Payment Not Found. You have not booked this tour", 404);
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking);
    const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const userPhoneNumber = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    const sslPayload = {
        address: userAddress !== null && userAddress !== void 0 ? userAddress : "",
        email: userEmail !== null && userEmail !== void 0 ? userEmail : "",
        phoneNumber: userPhoneNumber !== null && userPhoneNumber !== void 0 ? userPhoneNumber : "",
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId,
    };
    const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL,
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID,
        }, { new: true, runValidators: true, session: session });
        const updatedBooking = (yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interfaces_1.BOOKING_STATUS.COMPLETE }, { new: true, runValidators: true, session })
            .populate("tour", "name")
            .populate("user", "name email")
            .exec());
        if (!updatedPayment || !updatedBooking) {
            throw new Error("Payment or Booking not found");
        }
        if (!updatedBooking.user || !updatedBooking.tour) {
            throw new Error("Booking must have a user and tour");
        }
        const invoiceData = {
            transactionId: updatedPayment.transactionId,
            bookingDate: updatedBooking.createdAt,
            userName: updatedBooking.user.name,
            tourTitle: updatedBooking.tour.name,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
        };
        const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment._id, { invoiceUrl: cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.secure_url }, { runValidators: true, session });
        yield (0, sendEmail_1.sendEmail)({
            to: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Completed Successfully" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.FAILED,
        }, { new: true, runValidators: true, session: session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interfaces_1.BOOKING_STATUS.FAILED }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Failed" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELED,
        }, { new: true, runValidators: true, session: session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interfaces_1.BOOKING_STATUS.CANCEL }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Canceled" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getInvoiceDownloadUrl = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId).select("invoiceUrl");
    if (!payment) {
        throw new AppError_1.default("Payment not found", 401);
    }
    if (!payment.invoiceUrl) {
        throw new AppError_1.default("No invoice found", 401);
    }
    return payment.invoiceUrl;
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield sslCommerz_service_1.SSLService.validatePayment(payload);
});
exports.PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl,
    validatePayment,
};
