"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./src/entities/User");
const Place_1 = require("./src/entities/Place");
const Review_1 = require("./src/entities/Review");
const Amenity_1 = require("./src/entities/Amenity");
const PlacePhoto_1 = require("./src/entities/PlacePhoto");
const database = process.env.NODE_ENV === "test" ? ":memory:" : "hbnb.sqlite";
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "hbnb.sqlite",
    synchronize: true,
    logging: false,
    entities: [PlacePhoto_1.PlacePhoto, User_1.User, Place_1.Place, Review_1.Review, Amenity_1.Amenity],
});
