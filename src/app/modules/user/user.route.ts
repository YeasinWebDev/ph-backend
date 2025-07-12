import jwt, { JwtPayload } from "jsonwebtoken";
import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

export const UserRouters = Router();

UserRouters.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);
UserRouters.get(
  "/all",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  userController.getAllUsers
);
UserRouters.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);
