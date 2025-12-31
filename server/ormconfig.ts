import { DataSource } from "typeorm";
import { User } from "./src/entities/User";
import { Place } from "./src/entities/Place";
import { Review } from "./src/entities/Review";
import { Amenity } from "./src/entities/Amenity";
import { PlacePhoto } from "./src/entities/PlacePhoto";

const database =
  process.env.NODE_ENV === "test" ? ":memory:" : "hbnb.sqlite";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database,
  synchronize: true,
  logging: false,
  entities: [PlacePhoto, User, Place, Review, Amenity],
});