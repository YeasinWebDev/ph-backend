import { NextFunction, Request, Response } from "express";
import { Division } from "./division.model";
import AppError from "../../errorHelpers/AppError";
import { sendResponse } from "../../../utils/sendResponse";

const createDevision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  try {
    const isExist = await Division.findOne({ name: data.name });
    if (isExist) {
      throw new AppError("Division already exist", 400);
    }
    let slug = data.name.toLowerCase() + "-" + "division";
    const result = await Division.create({ ...data, slug });

    sendResponse(res, 200, "Division created successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAllDevision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await Division.find({});
    sendResponse(res, 200, "Division fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateDevision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const divisionId = req.params.id;
    const data = req.body;
    const findDivision = await Division.findById(divisionId);
    if (!findDivision) {
      throw new AppError("Division not found", 400);
    }
    if (data?.name) {
      data.slug = data.name.toLowerCase() + "-" + "division";
    }

    const result = await Division.findByIdAndUpdate(divisionId, data, {
      new: true,
    });
    sendResponse(res, 200, "Division updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteDivision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const divisionId = req.params.id;
    const findDivision = await Division.findById(divisionId);
    if (!findDivision) {
      throw new AppError("Division not found", 400);
    }
    const result = await Division.findByIdAndDelete(divisionId);
    sendResponse(res, 200, "Division deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

export const DivisionService = {
  createDevision,
  getAllDevision,
  updateDevision,
  deleteDivision,
};
