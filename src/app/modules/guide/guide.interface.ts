import { Types } from "mongoose";

export enum GuideStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export interface IGuide {
  _id?: string;
  user:Types.ObjectId;
  nidPhoto: string;
  division:Types.ObjectId;
  status: GuideStatus;
}
