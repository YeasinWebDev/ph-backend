import { IAuthProvider, IsActive } from "./../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { createNewAccessTokenByRefreshToken, createToken } from "../../../utils/userTokens";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import { sendEmail } from "../../../utils/sendEmail";

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

const changePassword = async (decoded: JwtPayload, newPassword: string, oldPassword: string) => {
  const isUserExist = await User.findOne({ email: decoded.email });

  if (!isUserExist) {
    throw new Error("User Not Found");
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, isUserExist?.password as string);

  if (!isPasswordMatched) {
    throw new Error("Old Password Not Matched");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  isUserExist.password = hashPassword;

  await isUserExist.save();
};
const resetPassword = async (decoded: JwtPayload, newPassword: string,id:string) => {

  if(id !== decoded.userId){
    throw new AppError("Tou can not reset password of another user",400);
  }

  const isUserExist = await User.findOne({ email: decoded.email });

  if (!isUserExist) {
    throw new AppError("User Not Found",400);
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  isUserExist.password = hashPassword;

  await isUserExist.save();
};
const setPassword = async (userId: string, plainPassword: string) => {
  const isUserExist = await User.findOne({ _id: userId });

  if (!isUserExist) {
    throw new Error("User Not Found");
  }
  if (isUserExist.password && isUserExist.auths.some((auth) => auth.provider === "google")) {
    throw new AppError("Password already set , now you can change the password from your profile password update", 400);
  }
  const hashPassword = await bcrypt.hash(plainPassword, 10);

  const creadentialsProvider: IAuthProvider = { provider: "credentials", providerId: isUserExist.email };

  const auths = [...isUserExist.auths, creadentialsProvider];

  isUserExist.auths = auths;
  isUserExist.password = hashPassword;
  await isUserExist.save();
};

const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError("User does not exist", 400);
  }
  if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
    throw new AppError(`User is ${isUserExist.isActive}`, 400);
  }
  if (isUserExist.isDeleted) {
    throw new AppError("User is deleted", 400);
  }

  const jwtPayloadData = {
    userId: isUserExist._id,
    role: isUserExist.role,
    email: isUserExist.email,
  };

  const resetToken = jwt.sign(jwtPayloadData, "yeasin", { expiresIn: "10min" });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

  sendEmail({
    to:isUserExist.email,
    subject:"Reset Password",
    templateName:"forgetPassword",
    templateData:{
      name:isUserExist.name,
      resetUILink
    }
  })
};

export const authServices = {
  // creadentialsLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgetPassword,
};
