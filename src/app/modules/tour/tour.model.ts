import mongoose from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new mongoose.Schema<ITourType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TourType = mongoose.model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new mongoose.Schema<ITour>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  costFrom: {
    type: Number,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  include: {
    type: [String],
    default: [],
  },
  exclude: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
  },
  tourPlan: {
    type: [String],
    default: [],
  },
  maxGuest: {
    type: Number,
  },
  minAge: {
    type: Number,
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Division",
    required: true,
  },
  tourType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourType",
    required: true,
  },
},{
  timestamps: true,
  versionKey: false
});

export const Tour = mongoose.model<ITour>("Tour", tourSchema);
