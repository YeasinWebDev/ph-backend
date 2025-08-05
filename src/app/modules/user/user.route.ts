// import jwt, { JwtPayload } from "jsonwebtoken";
import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { malterUpload } from "../../config/multer.config";

export const UserRouters = Router();

UserRouters.post(
  "/register",
  malterUpload.single("file"),
  validateRequest(createUserZodSchema),
  userController.createUser
);

UserRouters.get(
  "/me",
  checkAuth(...Object.values(Role)),
  userController.getMe
)
UserRouters.get(
  "/all",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  userController.getAllUsers
);

UserRouters.get(
  '/:id',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  userController.getUser
)

UserRouters.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  malterUpload.single("file"),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);
