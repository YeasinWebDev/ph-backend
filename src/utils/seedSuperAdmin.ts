import bcrypt from "bcryptjs";
import { envVars } from "../app/config/env";
import { User } from "../app/modules/user/user.model";
import { IAuthProvider } from "../app/modules/user/user.interface";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, 10);

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    if (!isSuperAdminExist) {
      const superAdmin = await User.create({
        name: "Super Admin",
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        isVerified: true,
        auth: [authProvider],
      });
      console.log("super admin created");
    } else {
      console.log("super admin already exist");
    }
  } catch (error) {}
};
