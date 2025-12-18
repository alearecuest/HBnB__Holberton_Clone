import { Router, Request, Response } from "express";
import { PlaceService } from "../services/PlaceService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const place = await PlaceService.create(req.body);
        res.status(201).json(place);
    } catch (err) {
        res.status(400).json({ error: "Could not create place" });
    }
});


export default router;