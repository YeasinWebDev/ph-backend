import { NextFunction, Request, Response } from "express";
// import catchAsync from "../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { BookingService } from "./booking.service";
import { sendResponse } from "../../../utils/sendResponse";

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decodeToken = req.user as JwtPayload;
    const booking = await BookingService.createBooking(
    req.body,
    decodeToken.userId
  );
  sendResponse(res, 201, "Booking created successfully", booking);
  } catch (error) {
    console.log(error,"error")
    next(error)
  }
};

// const getUserBookings = async (req: Request, res: Response) => {
//   const bookings = await BookingService.getUserBookings();
//   sendResponse(res, 201, "Bookings retrieved successfully", bookings);
// };
// const getSingleBooking = async (req: Request, res: Response) => {
//   const booking = await BookingService.getBookingById();
//   sendResponse(res, 201, "Booking retrieved successfully", booking);
// };
// const getAllBookings = async (req: Request, res: Response) => {
//   const bookings = await BookingService.getAllBookings();
//   sendResponse(res, 201, "Bookings retrieved successfully", bookings);
// };
// const updateBookingStatus = async (req: Request, res: Response) => {
//   const updated = await BookingService.updateBookingStatus();
//   sendResponse(res, 201, "Booking status updated successfully", updated);
// };
export const BookingController = {
  createBooking,
  // getAllBookings,
  // getSingleBooking,
  // getUserBookings,
  // updateBookingStatus,
};
