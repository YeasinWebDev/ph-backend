// tour-type
import { NextFunction, Request, Response } from "express";
import { Tour, TourType } from "./tour.model";
import AppError from "../../errorHelpers/AppError";
import { sendResponse } from "../../../utils/sendResponse";

// tourTypes
const createTourType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isExist = await TourType.findOne({ name: req.body.name });
    if (isExist) {
      throw new AppError("Tour type already exist", 400);
    }
    const result = await TourType.create(req.body);
    sendResponse(res, 200, "Tour type created successfully", result);
  } catch (error) {
    next(error);
  }
};

const allToursType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await TourType.find();
    sendResponse(res, 200, "Tours fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateToursType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isExist = await TourType.findOne({ _id: req.params.id });
    if (!isExist) {
      throw new AppError("Tour type not exist", 400);
    }
    const result = await TourType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    sendResponse(res, 200, "Tours updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteToursType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await TourType.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, "Tours deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

// tour

const createTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Tour.create(req.body);
    sendResponse(res, 200, "Tour created successfully", result);
  } catch (error) {
    next(error);
  }
};

const allTours = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Tour.find().populate(["tourType", "division"]);
    sendResponse(res, 200, "Tours fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tourId = req.params.id;
    const data = req.body;

    const isExist = await Tour.findById(tourId);
    if (!isExist) {
      throw new AppError("Tour not exist", 400);
    }

    const result = await Tour.findByIdAndUpdate(tourId, data, {
      new: true,
    });
    sendResponse(res, 200, "Tour updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteTour = async(req:Request, res:Response, next:NextFunction)=>{
   const tourId= req.params.id;
   try {
    const result = await Tour.findByIdAndDelete(tourId);
    sendResponse(res, 200, "Tour deleted successfully", result);
   } catch (error) {
    next(error)
   }
}

export const TourService = {
  createTourType,
  allToursType,
  updateToursType,
  deleteToursType,
  // tour
  createTour,
  allTours,
  updateTour,
  deleteTour
};
