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
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const env_1 = require("../../config/env");
const sendResponse_1 = require("../../../utils/sendResponse");
const initPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingId = req.params.bookingId;
        const result = yield payment_service_1.PaymentService.initPayment(bookingId);
        (0, sendResponse_1.sendResponse)(res, 200, "Payment initialized successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const successPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.successPayment(req.query);
    if (result.success)
        return res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=success`);
});
const cancelPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.cancelPayment(req.query);
    if (!result.success)
        return res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=canceled`);
});
const failPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.failPayment(req.query);
    if (!result.success)
        return res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=failed`);
});
const getInvoiceDownloadUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.params;
    const result = yield payment_service_1.PaymentService.getInvoiceDownloadUrl(paymentId);
    (0, sendResponse_1.sendResponse)(res, 200, "Invoice download url fetched successfully", result);
});
const validatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.validatePayment(req.body);
    (0, sendResponse_1.sendResponse)(res, 200, "Payment validated successfully", result);
});
exports.PaymentController = {
    initPayment,
    successPayment,
    cancelPayment,
    failPayment,
    getInvoiceDownloadUrl,
    validatePayment
};
