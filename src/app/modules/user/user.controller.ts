import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { sendResponse } from "../../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const picture = req.file?.path;
    const user = await UserService.createUser(req.body, picture);
    sendResponse(res, 200, "User created successfully", user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const verify = req.user as JwtPayload;
    const newPicture = req.file?.path;
    const user = await UserService.updateUser(
      req.params.id,
      req.body,
      verify,
      newPicture
    );
    sendResponse(res, 200, "User updated successfully", user);
  } catch (error) {
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

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getUser(req.params.id);
    sendResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getMe(req.user as JwtPayload);
    sendResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
  getUser,
  getMe
};
