import { AppDataSource } from "../../ormconfig";
import { User } from "../entities/User";
import { Repository } from "typeorm";

export const userRepository: Repository<User> = AppDataSource.getRepository(User);