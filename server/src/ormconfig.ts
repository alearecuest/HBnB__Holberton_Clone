import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Place } from "./entities/Place";
import { Review } from "./entities/Review";
import { Amenity } from "./entities/Amenity";
import { PlacePhoto } from "./entities/PlacePhoto";
import { Availability } from "./entities/Availability";
import { Reservation } from "./entities/Reservation"; 

const database =
  process.env.NODE_ENV === "test" ? ":memory:" : "hbnb.sqlite";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database,
  synchronize: true,
  logging: false,
  entities: [PlacePhoto, User, Place, Review, Amenity, Availability, Reservation],
});