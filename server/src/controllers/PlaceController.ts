import { Router, Request, Response } from "express";
import { PlaceService } from "../services/PlaceService";
import { validateBody } from "../middlewares/validateBody";
import { placeCreateSchema, placeUpdateSchema } from "../schemas/placeSchema";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

router.post(
    "/",
    authenticateJWT,
    validateBody(placeCreateSchema),
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            req.body.ownerId = userId;
            const place = await PlaceService.create(req.body);
            res.status(201).json(place);
        } catch (err) {
            res.status(400).json({ error: "Could not create place" });
        }
    }
);


export default router;