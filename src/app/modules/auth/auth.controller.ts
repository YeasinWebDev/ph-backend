import { NextFunction, Request, Response } from "express"
import { authServices } from "./auth.service"
import { sendResponse } from "../../../utils/sendResponse"

const creadentialsLogin = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const loginInfo = await authServices.creadentialsLogin(req.body)
        sendResponse(res,200,"Login Successfully",loginInfo)
    } catch (error) {
        next(error)
    }
}

export const authControllers = {
    creadentialsLogin
}