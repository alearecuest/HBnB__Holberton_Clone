import { DataSource } from "typeorm";
import { User } from "./src/entities/User";
import { Place } from "./src/entities/Place";
import { Review } from "./src/entities/Review";
import { Amenity } from "./src/entities/Amenity";

const database =
  process.env.NODE_ENV === "test" ? ":memory:" : "hbnb.sqlite";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database,
  synchronize: true,
  logging: false,
  entities: [User, Place, Review, Amenity],
});