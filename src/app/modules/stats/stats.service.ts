import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE });
  const totalInactiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE });
  const totalBlockedUsersPromise = User.countDocuments({ isActive: IsActive.BLOCKED });

  const newUsersInSevenDaysPromise = User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const newUsersInThirtyDaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  const usersByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [totalUsers, totalActiveUsers, totalInactiveUsers, totalBlockedUsers, newUsersInSevenDays, newUsersInThirtyDays, usersByRole] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInactiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInSevenDaysPromise,
    newUsersInThirtyDaysPromise,
    usersByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newUsersInSevenDays,
    newUsersInThirtyDays,
    usersByRole,
  };
};

const getTourStats = async () => {
  const totalToursPromise = Tour.countDocuments();

  const totalTourByTourTypePromise = Tour.aggregate([
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
    {
      $unwind: "$type",
    },
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    {
      $unwind: "$division",
    },
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHighestBookedToursPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        bookingCount: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$tourId"],
              },
            },
          },
        ],
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
    {
      $project: {
        _id: 0,
        "tour.name": 1,
        "tour.slug": 1,
        bookingCount: 1,
      },
    },
  ]);

  const [totalTours, totalTourByTourType, avgTourCost, totalTourByDivision, totalHighestBookedTours] = await Promise.all([
    totalToursPromise,
    totalTourByTourTypePromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    totalHighestBookedToursPromise,
  ]);

  return {
    totalTours,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTours,
  };
};

const getBookingStats = async () => {
  const totalBookingsPromise = Booking.countDocuments();

  const totalBookingsByStatusPromise = Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingPerTourPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        bookingCount: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
    {
      $project: {
        _id: 0,
        "tour.name": 1,
        "tour.slug": 1,
        bookingCount: 1,
      },
    },
  ]);

  const avgGuestCountPerBookingPromise = Booking.aggregate([
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingsLast7DaysPromise = Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

  const bookingsLast30DaysPromise = Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
  const totalBookingByUniqueUsersPromise = Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const [totalBookings, totalBookingsByStatus, bookingPerTour, avgGuestCountPerBooking, bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUsers] = await Promise.all([
    totalBookingsPromise,
    totalBookingsByStatusPromise,
    bookingPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingsLast7DaysPromise,
    bookingsLast30DaysPromise,
    totalBookingByUniqueUsersPromise,
  ]);

  return {
    totalBookings,
    totalBookingsByStatus,
    bookingPerTour,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0]?.avgGuestCount,
    bookingsLast7Days,
    bookingsLast30Days,
    totalBookingByUniqueUsers,
  };
};

const getPaymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();

  const totalPaymentByStatusPromise = Payment.aggregate([
    //stage 1 group
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Payment.aggregate([
    //stage1 match stage
    {
      $match: { status: PAYMENT_STATUS.PAID },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    //stage 1 group stage
    {
      $group: {
        _id: null,
        avgPaymentAMount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    //stage 1 group stage
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = await Promise.all([
    totalPaymentPromise,
    totalPaymentByStatusPromise,
    totalRevenuePromise,
    avgPaymentAmountPromise,
    paymentGatewayDataPromise,
  ]);
  return { totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData };
};

export const StatsService = {
  getBookingStats,
  getPaymentStats,
  getTourStats,
  getUserStats,
};
