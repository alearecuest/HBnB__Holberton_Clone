import { Router, Response, Request } from "express";
import { ReviewService } from "../services/ReviewService";
import { validateBody } from "../middlewares/validateBody";
import { reviewCreateSchema, reviewUpdateSchema } from "../schemas/reviewSchema";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth";

const router = Router({ mergeParams: true });

router.get("/", async (req: Request<{ placeId: string }>, res) => {
    const { placeId } = req.params;
    try {
        const reviews = await ReviewService.findByPlace(placeId);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch reviews" });
    }
});

router.post(
    "/",
    authenticateJWT,
    validateBody(reviewCreateSchema),
    async (req: AuthenticatedRequest & Request<{ placeId: string }>, res: Response) => {
        try {
            const { placeId } = req.params;
            const userId = req.user!.userId;
            const reviewData = {
                ...req.body,
                userId,
                placeId,
            };
            const review = await ReviewService.create(reviewData);
            res.status(201).json(review);
        } catch (err) {
            res.status(400).json({ error: "Could not create review" });
        }
    }
);

router.put(
    "/:id",
    authenticateJWT,
    validateBody(reviewUpdateSchema),
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const reviewId = req.params.id;
            const userId = req.user!.userId;
            const isAdmin = req.user!.isAdmin;
            const review = await ReviewService.findById(reviewId);
            if (!review) return res.status(404).json({ error: "Review not found" });
            if (!isAdmin && review.user.id !== userId) {
                return res.status(403).json({ error: "Forbidden" });
            }
            const updated = await ReviewService.update(reviewId, req.body);
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: "Could not update review" });
        }
    }
);

router.delete(
    "/:id",
    authenticateJWT,
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const reviewId = req.params.id;
            const userId = req.user!.userId;
            const isAdmin = req.user!.isAdmin;
            const review = await ReviewService.findById(reviewId);
            if (!review) return res.status(404).json({ error: "Review not found" });
            if (!isAdmin && review.user.id !== userId) {
                return res.status(403).json({ error: "Forbidden" });
            }
            await ReviewService.delete(reviewId);
            res.json({ message: "Review deleted" });
        } catch (err) {
            res.status(400).json({ error: "Could not delete review" });
        }
    }
);

router.get(
    "/place/:placeId",
    async (req: Request<{ placeId: string }>, res) => {
        const { placeId } = req.params;
        const reviews = await ReviewService.findByPlace(placeId);
        res.json(reviews);
    }
);

export default router;