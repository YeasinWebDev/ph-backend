import { NextFunction, Request, Response } from "express"
import { authServices } from "./auth.service"
import { sendResponse } from "../../../utils/sendResponse"
import { createToken } from "../../../utils/userTokens"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import passport from "passport"

const creadentialsLogin = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        passport.authenticate("local", async( err:any, user:any, info:any)=>{
            // console.log(err)
            if(err){
                return next(err?.message)
            }
            if(!user){
                return next(new Error(info.message))
            }

            // const jwtpayload = {userId:user._id,email:user.email,role:user.role}
            const tokenInfo = createToken(user)
            res.cookie("accessToken",tokenInfo.accessToken,
                {httpOnly:true,secure:false}
            )
            res.cookie("refreshToken",tokenInfo.refreshToken,
                {httpOnly:true,secure:false}
            )

            const {password,...rest} = user.toObject()

            sendResponse(res,200,"Login Successfully",{...tokenInfo,user:rest})
        })(req,res,next)
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

const changePassword = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const decoded = req.user as JwtPayload

        const newPassword = req.body.newPassword
        const oldPassword = req.body.oldPassword

        await authServices.changePassword(decoded,newPassword, oldPassword)
        
        sendResponse(res,200,"Reset Password Successfully",{})
    } catch (error) {
        next(error)
    }
}
const resetPassword = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const decoded = req.user as JwtPayload

        const {newPassword,id} = req.body

        await authServices.resetPassword(decoded,newPassword,id)
        
        sendResponse(res,200,"Reset Password Successfully",{})
    } catch (error) {
        next(error)
    }
}
const setPassword = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const decoded = req.user as JwtPayload
        const password = req.body.password

        await authServices.setPassword(decoded.userId, password)
        
        sendResponse(res,200,"Reset Password Successfully",{})
    } catch (error) {
        next(error)
    }
}

const forgetPassword = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const email = req.body.email
        await authServices.forgetPassword(email)
        
        sendResponse(res,200,"Email sent Successfully",{})
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
    changePassword,
    googleCallback,
    setPassword,
    forgetPassword
}