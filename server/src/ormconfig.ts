import "dotenv/config";
import path from "path";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Place } from "./entities/Place";
import { Review } from "./entities/Review";
import { Amenity } from "./entities/Amenity";
import { PlacePhoto } from "./entities/PlacePhoto";
import { Availability } from "./entities/Availability";
import { Reservation } from "./entities/Reservation";

const dbPath = path.resolve(__dirname, "..", "hbnb.sqlite");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbPath,
  synchronize: true,
  logging: false,
  entities: [PlacePhoto, User, Place, Review, Amenity, Availability, Reservation],
});