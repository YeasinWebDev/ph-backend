import mongoose from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new mongoose.Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Division = mongoose.model<IDivision>("Division", divisionSchema);