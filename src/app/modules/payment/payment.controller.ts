import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../../utils/sendResponse";

const initPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await PaymentService.initPayment(bookingId as string);
    sendResponse(res, 200, "Payment initialized successfully", result);
  } catch (error) {
    next(error);
  }
};

const successPayment = async (req: Request, res: Response) => {
  const result = await PaymentService.successPayment(
    req.query as Record<string, string>
  );

  if (result.success)
    return res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=success`
    );
};

const cancelPayment = async (req: Request, res: Response) => {
  const result = await PaymentService.cancelPayment(
    req.query as Record<string, string>
  );

  if (!result.success)
    return res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=canceled`
    );
};

const failPayment = async (req: Request, res: Response) => {
  const result = await PaymentService.failPayment(
    req.query as Record<string, string>
  );

  if (!result.success)
    return res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=failed`
    );
};

export const PaymentController = {
  initPayment,
  successPayment,
  cancelPayment,
  failPayment,
};
