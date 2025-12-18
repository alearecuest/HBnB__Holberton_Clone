import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "hbnb.sqlite",
    synchronize: true,
    logging: false,
    entities: [__dirname + "/src/entities/*.ts"],
    migrations: [],
    subscribers: [],
});