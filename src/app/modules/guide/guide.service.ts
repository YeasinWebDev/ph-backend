import AppError from "../../errorHelpers/AppError";
import { Guide } from "./guide.model";
import { JwtPayload } from "jsonwebtoken";
import { GuideStatus } from "./guide.interface";
import { IUser } from "../user/user.interface";
import { IDivision } from "../division/division.interface";

interface IGuide {
  user: JwtPayload;
  nidPhoto: string;
  division: string;
}
const applyForGuide = async (body: IGuide) => {
  const isUserExist = await Guide.findOne({ user: body.user.userId });
  if (isUserExist) {
    throw new AppError("You have already applied for guide", 400);
  }
  const payload = {
    user: body.user.userId,
    nidPhoto: body.nidPhoto,
    division: body.division,
    status: GuideStatus.PENDING,
  };

  const result = await Guide.create(payload);
  return result;
};

const approveGuide = async (guideId: string, status: GuideStatus) => {
  const isGuideExist = await Guide.findById(guideId);
  if (!isGuideExist) {
    throw new AppError("Guide not found", 400);
  }
  if (isGuideExist.status === GuideStatus.APPROVED || isGuideExist.status === GuideStatus.REJECTED) {
    throw new AppError("Guide already approved or rejected", 400);
  }

  if (status === "APPROVED") {
    status = GuideStatus.APPROVED;
  } else if (status === "REJECTED") {
    status = GuideStatus.REJECTED;
  }

  const result = await Guide.findByIdAndUpdate(guideId, { status }, { new: true });
  return result;
};

const getAllGuides = async () => {
  const guides = await Guide.find({}).populate("user", "name").populate("division", "name");

  const formatted = guides.map((guide) => ({
    _id: guide._id,
    user: (guide.user as unknown as IUser)?.name,
    division: (guide.division as unknown as IDivision)?.name,
    nidPhoto: guide.nidPhoto,
    status: guide.status,
    createdAt: guide.createdAt,
    updatedAt: guide.updatedAt,
  }));

  return formatted;
};

export const GuideService = { applyForGuide, approveGuide, getAllGuides };
