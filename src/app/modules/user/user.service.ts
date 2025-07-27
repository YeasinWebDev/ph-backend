import { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createUser = async (payload: Partial<IUser>, picture?: string) => {
  const { email, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new Error("User already exist");
  }

  const hashPassword = await bcrypt.hash(payload?.password!, 10);

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
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new Error("User not found");
  }

  /**
   * email - can not update
   * name, phone, password address
   * password - re hashing
   *  only admin superadmin - role, isDeleted...
   *
   * promoting to superadmin - superadmin
   */

  if (isUserExist.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new Error("You are not authorized");
    }

    if (isUserExist.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new Error("You are not authorized");
    }
  }

  if (isUserExist.isActive || isUserExist.isDeleted || isUserExist.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new Error("You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const newUpdatedUser = await User.findByIdAndUpdate(
    userId,
    { ...payload, picture },
    {
      new: true,
      runValidators: true,
    }
  );

  if(picture && isUserExist.picture){
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
