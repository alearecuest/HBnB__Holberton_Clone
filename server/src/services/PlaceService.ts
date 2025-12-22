import { placeRepository } from "../repositories/PlaceRepository";
import { Place } from "../entities/Place";

export class PlaceService {
    static async create(placeData: Partial<Place>): Promise<Place> {
        const place = placeRepository.create(placeData);
        return placeRepository.save(place);
    }

    static async getAll(): Promise<Place[]> {
        return placeRepository.find();
    }
}