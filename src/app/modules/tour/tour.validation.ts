import { Types } from "mongoose";
import z from "zod";

// tour types
export const createTourTypeZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
});
export const updateTourTypeZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
});



// tour
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const createTourSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  images: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().nonnegative().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().int().positive().optional(),
  minAge: z.number().int().nonnegative().optional(),
  division: objectIdSchema,
  tourType: objectIdSchema,
});


export const updateTourSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  images: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().nonnegative().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().int().positive().optional(),
  minAge: z.number().int().nonnegative().optional(),
  division: objectIdSchema.optional(),
  tourType: objectIdSchema.optional(),
});
