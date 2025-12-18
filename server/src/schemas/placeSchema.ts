import { z } from "zod";

export const placeCreateSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    latitude: z.number(),
    longitude: z.number(),
    amenities: z.array(z.string().uuid()).optional(),
});

export const placeUpdateSchema = placeCreateSchema.partial();