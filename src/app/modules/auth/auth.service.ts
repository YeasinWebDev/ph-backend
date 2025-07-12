import { generateToken } from "../../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const creadentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new Error("User Not Found");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist?.password as string
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid Password");
  }

  const userWithoutPassword = isUserExist.toObject();
  delete userWithoutPassword.password;

  const jwtPayload = {
    userId: userWithoutPassword._id,
    email: userWithoutPassword.email,
    role: userWithoutPassword.role,
  };

  const accessToken = generateToken(jwtPayload, "yeasin", "1d");

  return { accessToken, userWithoutPassword };
};

export const authServices = {
  creadentialsLogin,
};
