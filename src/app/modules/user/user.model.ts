import { IsActive, IUser, Role } from "./user.interface";
import mongoose from "mongoose";

const authProviderSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, _id: false }
);

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guide" }],
  },
  { timestamps: true, versionKey: false }
);

export const User = mongoose.model<IUser>("User", userSchema);
