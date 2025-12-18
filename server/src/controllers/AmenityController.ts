import { Router, Request, Response } from "express";
import { AmenityService } from "../services/AmenityService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const amenity = await AmenityService.create(req.body);
        res.status(201).json(amenity);
    } catch (err) {
        res.status(400).json({ error: "Could not create amenity" });
    }
});


export default router;