import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { GuideController } from "./guide.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createGuideZodSchema } from "./guide.validation";
import { malterUpload } from "../../config/multer.config";

export const guideRoutes = Router();

guideRoutes.post("/apply", checkAuth(Role.USER), malterUpload.single("file"), validateRequest(createGuideZodSchema), GuideController.applyForGuide);

guideRoutes.post("/approve/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), GuideController.approveGuide);

guideRoutes.get("/", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), GuideController.getAllGuides);
