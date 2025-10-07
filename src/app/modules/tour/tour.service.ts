// tour-type
import { NextFunction, Request, Response } from "express";
import { Tour, TourType } from "./tour.model";
import AppError from "../../errorHelpers/AppError";
import { sendResponse } from "../../../utils/sendResponse";
import { toursearchFields } from "./tour.constant";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

// tourTypes
const createTourType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isExist = await TourType.findOne({ name: req.body.name });
    if (isExist) {
      throw new AppError("Tour type already exist", 400);
    }
    const result = await TourType.create(req.body);
    sendResponse(res, 200, "Tour type created successfully", result);
  } catch (error) {
    next(error);
  }
};

const allToursType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const result = await TourType.find(query);
    const totalToursType = await TourType.countDocuments();
    sendResponse(res, 200, "Tours fetched successfully", {
      tourTypes: result,
      totalToursType,
    });
  } catch (error) {
    next(error);
  }
};

const updateToursType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isExist = await TourType.findOne({ _id: req.params.id });
    if (!isExist) {
      throw new AppError("Tour type not exist", 400);
    }
    const result = await TourType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    sendResponse(res, 200, "Tours updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteToursType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TourType.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, "Tours deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

// tour

const createTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Tour name is required" });
    }

    const slug = req.body.name.toLowerCase().split(" ").join("-");
    req.body.slug = slug;

    const payload = {
      ...req.body,
      images: (req.files as Express.Multer.File[])?.map((file) => file.path),
    };
    const result = await Tour.create(payload);
    sendResponse(res, 200, "Tour created successfully", result);
  } catch (error) {
    next(error);
  }
};

// const allTours = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const query = req.query;
//     const sort = req.query.sort || "-createdAt";
//     const search = req.query.search || "";
//     const fields =
//       ((req.query.fields as string) || "").split(",").join(" ") || "";
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     for (const field of excludeFields) {
//       delete query[field];
//     }

//     const result = await Tour.find({
//       $or: toursearchFields.map((field) => ({
//         [field]: {
//           $regex: search,
//           $options: "i",
//         },
//       })),
//     })
//       .find(query)
//       .sort(sort as string)
//       .select(fields)
//       .populate(["tourType", "division"])
//       .skip(skip)
//       .limit(limit);

//     const totalTour = await Tour.countDocuments();

//     const meta ={
//       total: totalTour,
//       page,
//       limit,
//       totalPages: Math.ceil(totalTour / limit),
//     }
//     sendResponse(res, 200, "Tours fetched successfully", {
//       tours: result,
//       meta
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const allTours = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedQuery: Record<string, string> = Object.entries(req.query).reduce((acc, [key, value]) => {
      if (typeof value === "string") {
        acc[key] = value;
      } else if (Array.isArray(value)) {
        acc[key] = typeof value[0] === "string" ? value[0] : "";
      } else {
        acc[key] = "";
      }
      return acc;
    }, {} as Record<string, string>);
    const quaryBuilder = new QueryBuilder(Tour.find(), parsedQuery);
    const tours = await quaryBuilder.search(toursearchFields).filter().sort().fields().pagination().getResults();

    const meta = await quaryBuilder.getMeta();

    sendResponse(res, 200, "Tours fetched successfully", {
      meta,
      tours,
    });
  } catch (error) {
    next(error);
  }
};
const updateTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tourId = req.params.id;

    const isExist = await Tour.findById(tourId);
    if (!isExist) {
      throw new AppError("Tour not exist", 400);
    }

    const payload = {
      ...req.body,
      images: (req.files as Express.Multer.File[])?.map((file) => file.path),
    };

    // update images
    if (payload.image && payload.image.length > 0 && isExist.images && isExist.images.length > 0) {
      payload.images = [...isExist.images, ...payload.images];
    }

    if (payload.deleteImages && payload.deleteImages.length > 0 && isExist.images && isExist.images.length > 0) {
      const restDbImages = isExist.images.filter((image) => !payload.deleteImages.includes(image));

      const updatedPayloadImages = (payload.Images || [])
        .filter((image: string) => !payload?.deleteImages.includes(image))
        .filter((image: string) => !restDbImages.includes(image));

      payload.images = [...restDbImages, ...updatedPayloadImages];
    }

    const result = await Tour.findByIdAndUpdate(tourId, payload, {
      new: true,
    });

    // delete images from cloudinary
    if (payload.deleteImages && payload.deleteImages.length > 0) {
      await Promise.all(payload.deleteImages.map((image: string) => deleteImageFromCloudinary(image)));
    }

    sendResponse(res, 200, "Tour updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const getSingleTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    const result = await Tour.findOne({ slug });
    sendResponse(res, 200, "Tour fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteTour = async (req: Request, res: Response, next: NextFunction) => {
  const tourId = req.params.id;
  try {
    const result = await Tour.findByIdAndDelete(tourId);
    sendResponse(res, 200, "Tour deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

export const TourService = {
  createTourType,
  allToursType,
  updateToursType,
  deleteToursType,
  // tour
  createTour,
  allTours,
  updateTour,
  deleteTour,
  getSingleTour,
};
