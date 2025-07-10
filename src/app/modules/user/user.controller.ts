import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { sendResponse } from "../../../utils/sendResponse";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);
    sendResponse(res, 200, "User created successfully", user);
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    const meta = { total: users.length };
    sendResponse(res, 200, "Users fetched successfully", users, meta);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const userController = {
  createUser,
  getAllUsers,
};
