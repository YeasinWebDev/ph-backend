import { Router } from "express";
import { authControllers } from "./auth.controller";

export const authRouter = Router()

authRouter.post("/login",authControllers.creadentialsLogin)