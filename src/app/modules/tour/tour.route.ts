import { Router } from "express";
import { TourController } from "./tour.controler";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourSchema, createTourTypeZodSchema, updateTourSchema, updateTourTypeZodSchema } from "./tour.validation";
import { malterUpload } from "../../config/multer.config";

export const tourRouter = Router();

tourRouter.post(
  "/create-tour-type",
  validateRequest(createTourTypeZodSchema),
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.createTourType
);

tourRouter.get(
  "/tour-types",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.allToursType
);

tourRouter.patch(
  "/tour-types/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(updateTourTypeZodSchema),
  TourController.updateToursType
);

tourRouter.delete(
  "/tour-types/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.deleteToursType
);

// tour

tourRouter.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  malterUpload.array("files"),
  validateRequest(createTourSchema),
  TourController.createTour
);

tourRouter.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.allTours
);

tourRouter.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN), 
  malterUpload.array("files"),
  validateRequest(updateTourSchema),
  TourController.updateTour
);

tourRouter.get(
  "/:slug",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.getSingleTour
);

tourRouter.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.deleteTour
);