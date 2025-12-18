import { z } from "zod";

export const reviewCreateSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(1),
});

export const reviewUpdateSchema = z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(1).optional(),
});