import { Response } from "express";

interface IMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPage?: number;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any,
  meta?: IMeta
) => {
  res.status(statusCode).json({
    success: true,
    message,
    meta,
    data,
  });
};
