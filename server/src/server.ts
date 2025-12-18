import "reflect-metadata";
import { AppDataSource } from "../ormconfig";
import app from "./app";

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });