import mongoose from "mongoose";
import { GuideStatus } from "./guide.interface";

export const guideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nidPhoto: {
      type: String,
      required: true,
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GuideStatus),
      default: GuideStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Guide = mongoose.model("Guide", guideSchema);
