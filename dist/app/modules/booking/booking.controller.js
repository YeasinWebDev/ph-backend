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
exports.BookingController = void 0;
const booking_service_1 = require("./booking.service");
const sendResponse_1 = require("../../../utils/sendResponse");
const createBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodeToken = req.user;
        const booking = yield booking_service_1.BookingService.createBooking(req.body, decodeToken.userId);
        (0, sendResponse_1.sendResponse)(res, 201, "Booking created successfully", booking);
    }
    catch (error) {
        next(error);
    }
});
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
exports.BookingController = {
    createBooking,
    // getAllBookings,
    // getSingleBooking,
    // getUserBookings,
    // updateBookingStatus,
};
