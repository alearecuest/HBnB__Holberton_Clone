import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export function validateBody(schema: AnyZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: "Validation error", details: result.error.errors });
        }
        req.body = result.data;
        next();
    };
}