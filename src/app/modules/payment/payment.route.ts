import { Router } from "express";
import { PaymentController } from "./payment.controller";

export const paymentRoute = Router();

paymentRoute.post("/init-payment/:bookingId", PaymentController.initPayment);
paymentRoute.post("/success", PaymentController.successPayment);
paymentRoute.post("/cancel", PaymentController.cancelPayment);
paymentRoute.post("/fail", PaymentController.failPayment);
