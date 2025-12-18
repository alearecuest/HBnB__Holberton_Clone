import { AppDataSource } from "../../ormconfig";
import { Review } from "../entities/Review";
import { Repository } from "typeorm";

export const reviewRepository: Repository<Review> = AppDataSource.getRepository(Review);