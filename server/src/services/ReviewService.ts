import { reviewRepository } from "../repositories/ReviewRepository";
import { Review } from "../entities/Review";

export class ReviewService {
    static async create(reviewData: Partial<Review>): Promise<Review> {
        const review = reviewRepository.create(reviewData);
        return reviewRepository.save(review);
    }

    static async findById(id: string): Promise<Review | null> {
        return reviewRepository.findOne({
            where: { id },
            relations: ["user", "place"],
        });
    }

    static async update(id: string, data: Partial<Review>): Promise<Review | null> {
        const review = await reviewRepository.findOneBy({ id });
        if (!review) return null;
        Object.assign(review, data);
        return reviewRepository.save(review);
    }

    static async delete(id: string): Promise<void> {
        await reviewRepository.delete(id);
    }

    static async findByPlace(placeId: string): Promise<Review[]> {
        return reviewRepository.find({
            where: { place: { id: placeId } },
            relations: ["user", "place"],
        });
    }
}