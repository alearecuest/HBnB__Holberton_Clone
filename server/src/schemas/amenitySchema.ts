import { z } from "zod";

export const amenityCreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

export const amenityUpdateSchema = amenityCreateSchema.partial();