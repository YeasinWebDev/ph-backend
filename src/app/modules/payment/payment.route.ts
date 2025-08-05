import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const paymentRoute = Router();

paymentRoute.post("/init-payment/:bookingId", PaymentController.initPayment);
paymentRoute.post("/success", PaymentController.successPayment);
paymentRoute.post("/cancel", PaymentController.cancelPayment);
paymentRoute.post("/fail", PaymentController.failPayment);
paymentRoute.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), PaymentController.getInvoiceDownloadUrl);
paymentRoute.post("/validate-payment", PaymentController.validatePayment);