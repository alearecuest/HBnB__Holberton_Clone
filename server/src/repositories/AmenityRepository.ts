import { AppDataSource } from "../../ormconfig";
import { Amenity } from "../entities/Amenity";
import { Repository } from "typeorm";

export const amenityRepository: Repository<Amenity> = AppDataSource.getRepository(Amenity);