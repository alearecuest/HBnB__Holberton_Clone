import { PlacePhoto } from "../entities/PlacePhoto";
import { placePhotoRepository } from "../repositories/PlacePhotoRepository";
import { placeRepository } from "../repositories/PlaceRepository";
import { Place } from "../entities/Place";

export class PlaceService {
  static async create(placeData: Partial<Place>): Promise<Place> {
    const place = placeRepository.create(placeData);
    return placeRepository.save(place);
  }

  static async getAll(): Promise<Place[]> {
    return placeRepository.find({
      relations: ["photos"],
    });
  }

  static async addPhotos(placeId: string, photosData: Array<{ url: string }>) {
    const place = await placeRepository.findOne({ where: { id: placeId } });
    if (!place) throw new Error("Place not found");
    const photos = photosData.map(data => {
      const photo = placePhotoRepository.create({ ...data, place });
      return photo;
    });
    await placePhotoRepository.save(photos);
    return photos;
  }
}