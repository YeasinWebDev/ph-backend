"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const bookingRouter = express_1.default.Router();
// api/v1/booking
bookingRouter.post("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.validateRequest)(booking_validation_1.createBookingZodSchema), booking_controller_1.BookingController.createBooking);
// api/v1/booking
// bookingRouter.get("/",
//     checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     BookingController.getAllBookings
// );
// // api/v1/booking/my-bookings
// bookingRouter.get("/my-bookings",
//     checkAuth(...Object.values(Role)),
//     BookingController.getUserBookings
// );
// // api/v1/booking/bookingId
// bookingRouter.get("/:bookingId",
//     checkAuth(...Object.values(Role)),
//     BookingController.getSingleBooking
// );
// // api/v1/booking/bookingId/status
// bookingRouter.patch("/:bookingId/status",
//     checkAuth(...Object.values(Role)),
//     validateRequest(updateBookingStatusZodSchema),
//     BookingController.updateBookingStatus
// );
exports.bookingRoutes = bookingRouter;
