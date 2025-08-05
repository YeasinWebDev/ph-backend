import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, IUser, Role } from "../modules/user/user.interface";
import bcrypt from "bcryptjs";
import { CallbackError } from "mongoose";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
          return done(null, false, { message: `User is ${user.isActive}` });
        }
        if (user.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        const isGoogleAuth = user.auths?.some((auth) => auth.provider === "google");

        if (isGoogleAuth && !user.password) {
          return done(null, false, { message: "Login with Google" });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password as string);

        if (!isPasswordMatched) {
          return done(null, false, { message: "Invalid Password" });
        }

        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (user && (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE)) {
          return done(null, false, { message: `User is ${user.isActive}` });
        }
        if (user && user.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        if (!user) {
          user = await User.create({
            email: profile.emails?.[0].value,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log(error, "Google Strategy Error");
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: Partial<IUser>, done: (err: CallbackError, id?: unknown) => void) => done(null, user._id));

passport.deserializeUser(async (id: string, done: (err: CallbackError|null, user?: Partial<IUser>|null) => void) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error as CallbackError);
  }
});
