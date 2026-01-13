import { AppDataSource } from "../ormconfig";
import { Place } from "../entities/Place";
import { Repository } from "typeorm";

export const placeRepository: Repository<Place> = AppDataSource.getRepository(Place);