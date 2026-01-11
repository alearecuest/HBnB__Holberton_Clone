import { PlacePhoto } from "../entities/PlacePhoto";
import { placePhotoRepository } from "../repositories/PlacePhotoRepository";
import { placeRepository } from "../repositories/PlaceRepository";
import { amenityRepository } from "../repositories/AmenityRepository";
import { Place } from "../entities/Place";

export class PlaceService {
  static async create(placeData: Partial<Place>): Promise<Place> {
    const { amenities: amenityIds, ...rest } = placeData;
    const place = placeRepository.create(rest);

    if (amenityIds && Array.isArray(amenityIds) && amenityIds.length > 0) {
      const amenities = await amenityRepository.findByIds(amenityIds as string[]);
      place.amenities = amenities;
    }

    return placeRepository.save(place);
  }

  static async deletePhoto(placeId: string, photoIndex: number, userId: string) {
    const place = await placeRepository.findOne({
      where: { id: placeId },
      relations: ["owner", "photos", "amenities"]
    });
    if (!place || !place.owner || place.owner.id !== userId) return false;
    if (!place.photos || photoIndex < 0 || photoIndex >= place.photos.length) return false;

    const photoToDelete = place.photos[photoIndex];
    if (photoToDelete && photoToDelete.id) {
      await placePhotoRepository.delete(photoToDelete.id);
    }
    return true;
  }

  static async getAll(): Promise<Place[]> {
    return placeRepository.find({
      relations: ["photos", "owner", "amenities"],
    });
  }

  static async addPhotos(placeId: string, photosData: Array<{ url: string }>) {
    const place = await placeRepository.findOne({
      where: { id: placeId },
      relations: ["owner", "amenities"]
    });
    if (!place) throw new Error("Place not found");
    const photos = photosData.map(data => {
      const photo = placePhotoRepository.create({ ...data, place });
      return photo;
    });
    await placePhotoRepository.save(photos);
    return photos;
  }

  static async getById(id: string): Promise<Place | null> {
    return placeRepository.findOne({
      where: { id },
      relations: ["photos", "owner", "amenities"],
    });
  }

  static async deleteById(id: string) {
    return placeRepository.delete(id);
  }

  static async updateById(id: string, patch: Partial<Place>) {
    const { amenities: amenityIds, ...rest } = patch;
    await placeRepository.update(id, rest);
    const place = await placeRepository.findOne({
      where: { id },
      relations: ["photos", "owner", "amenities"]
    });
    if (amenityIds && Array.isArray(amenityIds) && place) {
      const amenities = await amenityRepository.findByIds(amenityIds as string[]);
      place.amenities = amenities;
      await placeRepository.save(place);
    }
    return placeRepository.findOne({
      where: { id },
      relations: ["photos", "owner", "amenities"]
    });
  }
}