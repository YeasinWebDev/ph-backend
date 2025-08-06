import z from "zod";

export const createGuideZodSchema = z.object({
    division: z.string(),
});