import { Booking } from "./../booking/booking.model";
import { generatePdf } from "../../../utils/invoice";
import { sendEmail } from "../../../utils/sendEmail";
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS, IBooking } from "../booking/booking.interfaces";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError("Payment Not Found. You have not booked this tour", 404);
  }

  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as unknown as IUser).address;
  const userEmail = (booking?.user as unknown as IUser).email;
  const userPhoneNumber = (booking?.user as unknown as IUser).phone;
  const userName = (booking?.user as unknown as IUser).name;

  const sslPayload = {
    address: userAddress ?? "",
    email: userEmail ?? "",
    phoneNumber: userPhoneNumber ?? "",
    name: userName,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};
const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { new: true, runValidators: true, session: session }
    );

    const updatedBooking = (await Booking.findByIdAndUpdate(updatedPayment?.booking, { status: BOOKING_STATUS.COMPLETE }, { new: true, runValidators: true, session })
      .populate("tour", "name")
      .populate("user", "name email")
      .exec()) as unknown as IBooking & { tour: ITour; user: IUser };

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


    const pdfBuffer = await generatePdf(invoiceData);

    const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");

    await Payment.findByIdAndUpdate(updatedPayment?._id, { invoiceUrl: cloudinaryResult?.secure_url }, { runValidators: true, session });

   await sendEmail({
      to: (updatedBooking?.user as unknown as IUser).email,
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

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { new: true, runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(updatedPayment?.booking, { status: BOOKING_STATUS.FAILED }, { runValidators: true, session });

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Failed" };
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELED,
      },
      { new: true, runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(updatedPayment?.booking, { status: BOOKING_STATUS.CANCEL }, { runValidators: true, session });

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Canceled" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getInvoiceDownloadUrl = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select("invoiceUrl");

  if (!payment) {
    throw new AppError("Payment not found", 401);
  }

  if (!payment.invoiceUrl) {
    throw new AppError("No invoice found", 401);
  }

  return payment.invoiceUrl;
};

const validatePayment = async (payload: unknown) => {
  return await SSLService.validatePayment(payload);
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
  validatePayment,
};
