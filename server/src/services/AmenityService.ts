import { amenityRepository } from "../repositories/AmenityRepository";
import { Amenity } from "../entities/Amenity";

export class AmenityService {
    static async create(amenityData: Partial<Amenity>): Promise<Amenity> {
        const amenity = amenityRepository.create(amenityData);
        return amenityRepository.save(amenity);
    }
}