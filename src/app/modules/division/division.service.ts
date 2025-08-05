import { NextFunction, Request, Response } from "express";
import { Division } from "./division.model";
import AppError from "../../errorHelpers/AppError";
import { sendResponse } from "../../../utils/sendResponse";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createDevision = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;

  try {
    const isExist = await Division.findOne({ name: data.name });
    if (isExist) {
      throw new AppError("Division already exist", 400);
    }
    const payload = { ...data, thumbnail: req.file?.path };
    const result = await Division.create(payload);

    sendResponse(res, 200, "Division created successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAllDevision = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedQuery: Record<string, string> = Object.entries(req.query).reduce((acc, [key, value]) => {
      if (typeof value === "string") {
        acc[key] = value;
      } else if (Array.isArray(value)) {
        acc[key] = typeof value[0] === "string" ? value[0] : "";
      } else {
        acc[key] = "";
      }
      return acc;
    }, {} as Record<string, string>);
    const quaryBuilder = new QueryBuilder(Division.find(), parsedQuery);
    const divisions = await quaryBuilder.search([]).filter().sort().fields().pagination().getResults();

    const meta = await quaryBuilder.getMeta();

    sendResponse(res, 200, "Division fetched successfully", {
      meta,
      divisions,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleDevision = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    const result = await Division.findOne({ slug });
    sendResponse(res, 200, "Division fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateDevision = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const divisionId = req.params.id;
    const data = req.body;
    const findDivision = await Division.findById(divisionId);
    if (!findDivision) {
      throw new AppError("Division not found", 400);
    }

    const isExist = await Division.findOne({
      name: data.name,
      _id: { $ne: divisionId },
    });
    if (!isExist) {
      throw new AppError("Division not exist", 400);
    }

    const payload = { ...data, thumbnail: req.file?.path };

    const result = await Division.findByIdAndUpdate(divisionId, payload, {
      new: true,
      runValidators: true,
    });

    if (req.file?.path && isExist.thumbnail) {
      await deleteImageFromCloudinary(isExist.thumbnail);
    }
    sendResponse(res, 200, "Division updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteDivision = async (req: Request, res: Response, next: NextFunction) => {
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
  getSingleDevision,
};
