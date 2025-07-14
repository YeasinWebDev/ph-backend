import { NextFunction, Request, Response } from "express"
import { authServices } from "./auth.service"
import { sendResponse } from "../../../utils/sendResponse"
import { createToken } from "../../../utils/userTokens"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"

const creadentialsLogin = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const loginInfo = await authServices.creadentialsLogin(req.body)

        res.cookie("accessToken",loginInfo.accessToken,
            {httpOnly:true,secure:false}
        )
        res.cookie("refreshToken",loginInfo.refreshToken,
            {httpOnly:true,secure:false}
        )

        sendResponse(res,200,"Login Successfully",loginInfo)
    } catch (error) {
        next(error)
    }
}

const getNewAccessToken = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            throw new Error("Refresh Token Not Found")
        }
        const tokenInfo = await authServices.getNewAccessToken(refreshToken)

        res.cookie("accessToken",tokenInfo.accessToken,
            {httpOnly:true,secure:false}
        )
        sendResponse(res,200,"Get New Access Token",tokenInfo)
    } catch (error) {
        next(error)
    }
}

const logout = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        res.clearCookie("accessToken",{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
        })
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
        })
        sendResponse(res,200,"Logout Successfully",{})
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const decoded = req.user as JwtPayload

        const newPassword = req.body.newPassword
        const oldPassword = req.body.oldPassword

        await authServices.resetPassword(decoded,newPassword, oldPassword)
        
        sendResponse(res,200,"Reset Password Successfully",{})
    } catch (error) {
        next(error)
    }
}
const googleCallback = async (req:Request,res:Response,next:NextFunction) =>{
    let redirecTo = req.query.state ? req.query.state as string : ""
    if(redirecTo){
        redirecTo = redirecTo.slice(1)
    }
    const user = req.user
    if(!user){
        throw new Error("User Not Found")
    }

    const tokenInfo = createToken(user)
    res.cookie("accessToken",tokenInfo.accessToken,
            {httpOnly:true,secure:false}
    )
    res.cookie("refreshToken",tokenInfo.refreshToken,
            {httpOnly:true,secure:false}
    )

    res.redirect(`${envVars.FRONTEND_URL}/${redirecTo}`)
}

export const authControllers = {
    creadentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback
}