import { AppDataSource } from "../ormconfig";
import { Reservation } from "../entities/Reservation";

export const reservationRepository = AppDataSource.getRepository(Reservation);