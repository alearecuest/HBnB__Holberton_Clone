import { AppDataSource } from "../../ormconfig";
import { PlacePhoto } from "../entities/PlacePhoto";
import { Repository } from "typeorm";

export const placePhotoRepository: Repository<PlacePhoto> = AppDataSource.getRepository(PlacePhoto);