import { IsActive } from "./../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../../utils/jwt";
import { createNewAccessTokenByRefreshToken, createToken } from "../../../utils/userTokens";
import { envVars } from "../../config/env";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";

// const creadentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new Error("User Not Found");
//   }

//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     isUserExist?.password as string
//   );

//   if (!isPasswordMatched) {
//     throw new Error("Invalid Password");
//   }

//   const userWithoutPassword = isUserExist.toObject();
//   delete userWithoutPassword.password;

//   const Tokendata = createToken(userWithoutPassword);

//   return { ...Tokendata, user: userWithoutPassword };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenByRefreshToken(refreshToken);

  return { ...accessToken };
};

const resetPassword = async (decoded: JwtPayload, newPassword: string, oldPassword: string) => {
  const isUserExist = await User.findOne({ email: decoded.email });

  if (!isUserExist) {
    throw new Error("User Not Found");
  }

  const isPasswordMatched = await bcrypt.compare(
    oldPassword,
    isUserExist?.password as string
  );

  if (!isPasswordMatched) {
    throw new Error("Old Password Not Matched");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  isUserExist.password = hashPassword;

  await isUserExist.save();

}

export const authServices = {
  // creadentialsLogin,
  getNewAccessToken,
  resetPassword
};
