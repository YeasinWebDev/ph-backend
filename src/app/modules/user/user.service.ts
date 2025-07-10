import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, name } = payload;

  const user = await User.create({
    email,
    name,
  });
 
  return user;
};

const getAllUsers = async () =>{
  const allUser = await User.find()
  return allUser
}

export const UserService = {
  createUser,
  getAllUsers
};
