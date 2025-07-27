import { getTransactionId } from "../../../utils/getTransactionId";
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interfaces";
import { Booking } from "./booking.model";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError("User phone and address is required", 400);
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError("No Tour Cost Found!", 400);
    }
    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId,
          amount,
        },
      ],
      { session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userAddress = (updateBooking?.user as any).address;
    const userEmail = (updateBooking?.user as any).email;
    const userPhoneNumber = (updateBooking?.user as any).phone;
    const userName = (updateBooking?.user as any).name;

    const sslPayload = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: amount,
      transactionId: transactionId,
    };

    const sslCommerz = await SSLService.sslPaymentInit(sslPayload);
    // console.log(sslCfommerz);

    await session.commitTransaction();
    await session.endSession();
    return {
      booking: updateBooking,
      payment:sslCommerz.GatewayPageURL
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const BookingService = { createBooking };
