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
      unique: true,
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

divisionSchema.pre("save", function (next) {
  if(!this.isModified("name")) return next();
  this.slug = this.name.toLowerCase().split(" ").join("-") + "-" + "division";
  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IDivision>; ;
  if(!update.name) return next();
  update.slug = update.name.toLowerCase().split(" ").join("-") + "-" + "division";
  this.setUpdate(update);
  next();
});

export const Division = mongoose.model<IDivision>("Division", divisionSchema);
