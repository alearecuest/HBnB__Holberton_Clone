import { Router, Request, Response } from "express";
import { AmenityService } from "../services/AmenityService";
import { validateBody } from "../middlewares/validateBody";
import { amenityCreateSchema, amenityUpdateSchema } from "../schemas/amenitySchema";
import { authenticateJWT, requireAdmin } from "../middlewares/auth";

const router = Router();

router.post(
    "/",
    authenticateJWT,
    requireAdmin,
    validateBody(amenityCreateSchema),
    async (req: Request, res: Response) => {
        try {
            const amenity = await AmenityService.create(req.body);
            res.status(201).json(amenity);
        } catch (err) {
            res.status(400).json({ error: "Could not create amenity" });
        }
    }
);

router.put(
    "/:id",
    authenticateJWT,
    requireAdmin,
    validateBody(amenityUpdateSchema),
    async (req: Request, res: Response) => {
        try {
            const amenityId = req.params.id;
            const amenity = await AmenityService.update(amenityId, req.body);
            res.json(amenity);
        } catch (err) {
            res.status(400).json({ error: "Could not update amenity" });
        }
    }
);

router.get("/", async (_req, res) => {
    const amenities = await AmenityService.getAll();
    res.json(amenities);
});

export default router;