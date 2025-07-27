import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { malterUpload } from "../../config/multer.config";

export const divisionRouter = Router();

divisionRouter.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  malterUpload.single("file"),
  validateRequest(createDivisionZodSchema),
  divisionController.createDivision
);

divisionRouter.get("/", divisionController.getAllDivision);

divisionRouter.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  malterUpload.single("file"),
  validateRequest(updateDivisionZodSchema),
  divisionController.updateDivision
);

divisionRouter.get(
  "/:slug",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  divisionController.getSingleDivision
);

divisionRouter.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  divisionController.deleteDivision
);
