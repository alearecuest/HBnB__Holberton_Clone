import { Router, Request, Response } from "express";
import { ReviewService } from "../services/ReviewService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const review = await ReviewService.create(req.body);
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ error: "Could not create review" });
    }
});


export default router;