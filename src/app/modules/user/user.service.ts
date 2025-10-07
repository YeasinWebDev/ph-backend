import { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";

const createUser = async (payload: Partial<IUser>, picture?: string) => {
  const { email, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new Error("User already exist");
  }

  if (!payload?.password) {
    throw new AppError("Password is required", 400);
  }

  const hashPassword = await bcrypt.hash(payload.password, 10);

  rest.password = hashPassword;

  const authProbider: IAuthProvider = {
    provider: "credentials",
    providerId: email,
  };

  const user = await User.create({
    picture,
    email,
    auths: [authProbider],
    ...rest,
  });

  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload, picture?: string) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    if (userId !== decodedToken?.userId) {
      throw new AppError("You are not authorized", 401);
    }
  }

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new Error("User not found");
  }

  // if (decodedToken.role === Role.SUPER_ADMIN && isUserExist.role === Role.SUPER_ADMIN) {
  //   throw new AppError("You are not authorized", 401);
  // }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError("You are not authorized", 401);
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError("You are not authorized", 401);
    }
  }
  const newUpdatedUser = await User.findByIdAndUpdate(
    userId,
    { ...payload, picture },
    {
      new: true,
      runValidators: true,
    }
  );

  if (picture && isUserExist.picture) {
    await deleteImageFromCloudinary(isUserExist.picture);
  }

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const allUser = await User.find();
  return allUser;
};

const getUser = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};

const getMe = async (decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId);
  return user;
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
  getUser,
  getMe,
};
