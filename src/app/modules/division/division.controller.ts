import { DivisionService } from "./division.service";
import { NextFunction, Request, Response } from "express";

const createDivision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await DivisionService.createDevision(req, res, next);
};

const getAllDivision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await DivisionService.getAllDevision(req, res, next);
};

const getSingleDivision = async (req: Request, res: Response, next: NextFunction) => {
  await DivisionService.getSingleDevision(req, res, next);
};

const updateDivision = async (req: Request, res: Response, next: NextFunction) => {
  await DivisionService.updateDevision(req, res, next);                                                                         
};

const deleteDivision = async (req: Request, res: Response, next: NextFunction) => {
  await DivisionService.deleteDivision(req, res, next);
};

export const divisionController = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision
};
