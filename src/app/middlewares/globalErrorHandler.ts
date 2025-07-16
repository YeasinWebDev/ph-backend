import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import { TErrorSources } from "../interfaces/error.types"
import { handlerDuplicateError } from "../../helpers/handleDuplicateError"
import { handleCastError } from "../../helpers/handleCastError"
import { handlerValidationError } from "../../helpers/handlerValidationError"
import { handleZodError } from "../../helpers/handleZodError"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"


    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if(err.name === "ZodError") {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if(err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }else if (err instanceof Error) {
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err : envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}