import { AppDataSource } from "../ormconfig";
import { Availability } from "../entities/Availability";

export const availabilityRepository = AppDataSource.getRepository(Availability);