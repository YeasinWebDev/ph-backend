import { Response } from "express";
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any,
  meta?: { total: number }
) => {
  res.status(statusCode).json({
    success: true,
    message,
    meta,
    data,
  });
};
