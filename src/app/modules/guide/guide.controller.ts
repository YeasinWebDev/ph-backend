import { NextFunction, Request, Response } from "express";
import { GuideService } from "./guide.service";
import { sendResponse } from "../../../utils/sendResponse";

const applyForGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const payload = {
      nidPhoto: req.file?.path,
      ...req.body,
      user,
    };
    const result = await GuideService.applyForGuide(payload);

    sendResponse(res, 200, "Guide applied successfully", result);
  } catch (error) {
    next(error);
  }
};

const approveGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guideId = req.params.id;
    const status = req.body.status;
    const result = await GuideService.approveGuide(guideId, status);
    sendResponse(res, 200, "Guide approved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAllGuides = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await GuideService.getAllGuides();
    sendResponse(res, 200, "Guides fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const GuideController = {
  applyForGuide,
  approveGuide,
  getAllGuides,
};
