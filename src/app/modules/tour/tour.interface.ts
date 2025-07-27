import { Types } from "mongoose";

export interface ITourType {
  name: string;
}

export interface ITour {
  name: string;
  slug: string;
  images?: string[];
  description?: string;
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  include?: string[];
  exclude?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
  departureLocation?: string;
  arrivalLocation?: string;
  deleteImages?: string[];
}
