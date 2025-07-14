import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../app/config/env";
import { IsActive, IUser } from "../app/modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../app/modules/user/user.model";

export const createToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(jwtPayload, "yeasin", "1d");
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESS_EXPIRES
  );

  return { accessToken, refreshToken };
};


export const createNewAccessTokenByRefreshToken = async (refreshToken: string) => {
  const verfiyRefreshToken = verifyToken(
      refreshToken,
      envVars.JWT_REFRESH_SECRET
    ) as JwtPayload;
  
    const isUserExist = await User.findOne({
      email: verfiyRefreshToken.email,
    });
  
    if (!isUserExist) {
      throw new Error("User Not Found");
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
      throw new Error(`User is ${isUserExist.isActive}`);
    }
    if(isUserExist.isDeleted){
      throw new Error("User Deleted");
    }
  
    const userPayload = {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role,
    };
  
    const accessToken = generateToken(userPayload, "yeasin", "1d");
  
    return { accessToken };
};