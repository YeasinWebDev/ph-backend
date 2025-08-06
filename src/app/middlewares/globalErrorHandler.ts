import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { TErrorSources } from "../interfaces/error.types";
import { handlerDuplicateError } from "../../helpers/handleDuplicateError";
import { handleCastError } from "../../helpers/handleCastError";
import { handlerValidationError } from "../../helpers/handlerValidationError";
import { handleZodError } from "../../helpers/handleZodError";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";
import mongoose from "mongoose";
import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = async (err: { name?: string; code?: number; stack?: string; message?: string; statusCode?: number }, req: Request, res: Response, _next:NextFunction) => {
  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";

  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  if (req.files && req.files.length) {
    const imagesUrls = (req.files as Express.Multer.File[])?.map((file) => file.path);
    await Promise.all(imagesUrls.map((url) => deleteImageFromCloudinary(url)));
  }

  if (typeof err === "object" && err !== null) {
    const error = err as { name?: string; code?: number; stack?: string; message?: string; statusCode?: number };

    if (error.code === 11000) {
      const simplifiedError = handlerDuplicateError({ message: err.message || "Duplicate key" });
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
    } else if (error.name === "CastError") {
      const simplifiedError = handleCastError();
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
    } else if (error.name === "ValidationError") {
      const simplifiedError = handlerValidationError(error as mongoose.Error.ValidationError);
      statusCode = simplifiedError.statusCode;
      errorSources = simplifiedError.errorSources as TErrorSources[];
      message = simplifiedError.message;
    } else if (error.name === "ZodError") {
      const simplifiedError = handleZodError(error as ZodError);
      statusCode = simplifiedError.statusCode;
      errorSources = simplifiedError.errorSources as TErrorSources[];
      message = simplifiedError.message;
    } else if (err instanceof AppError) {
      statusCode = error.statusCode ?? 500;
      message = error.message ?? "Something Went Wrong!!";
    } else if (err instanceof Error) {
      message = error.message ?? "Something Went Wrong!!";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
  });
};
