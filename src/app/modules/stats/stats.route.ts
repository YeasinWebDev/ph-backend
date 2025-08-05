import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

export const statsRouter = express.Router();

statsRouter.get(
    "/booking",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getBookingStats
);
statsRouter.get(
    "/payment",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getPaymentStats
);
statsRouter.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getUserStats
);
statsRouter.get(
    "/tour",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getTourStats
);
