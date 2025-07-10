import { Router } from "express";
import { userController } from "./user.controller";
 
export const UserRouters = Router()

UserRouters.post('/register', userController.createUser)
UserRouters.get('/all', userController.getAllUsers)