// controllers/stats.controller.ts
import { Request, Response } from "express";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../../utils/sendResponse";

const getBookingStats = async (req: Request, res: Response) => {
    const stats = await StatsService.getBookingStats();
    sendResponse(res,200,"Booking stats fetched successfully",stats)
}

const getPaymentStats = async (req: Request, res: Response) => {
    const stats = await StatsService.getPaymentStats();
    sendResponse(res,200,"Payment stats fetched successfully",stats)
}

const getUserStats = async (req: Request, res: Response) => {
    const stats = await StatsService.getUserStats();
    sendResponse(res,200,"User stats fetched successfully",stats)
}

const getTourStats = async (req: Request, res: Response) => {
    const stats = await StatsService.getTourStats();
    sendResponse(res,200,"Tour stats fetched successfully",stats)
}

export const StatsController = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats,
};