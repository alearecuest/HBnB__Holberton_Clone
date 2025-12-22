import { amenityRepository } from "../repositories/AmenityRepository";
import { Amenity } from "../entities/Amenity";

export class AmenityService {
    static async create(amenityData: Partial<Amenity>): Promise<Amenity> {
        const amenity = amenityRepository.create(amenityData);
        return amenityRepository.save(amenity);
    }

    static async update(id: string, data: Partial<Amenity>): Promise<Amenity | null> {
        const amenity = await amenityRepository.findOneBy({ id });
        if (!amenity) return null;
        Object.assign(amenity, data);
        return amenityRepository.save(amenity);
    }

    static async getAll(): Promise<Amenity[]> {
        return amenityRepository.find();
    }
}