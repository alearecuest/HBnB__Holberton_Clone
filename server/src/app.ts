import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./controllers/UserController";
import placeRouter from "./controllers/PlaceController";
import amenityRouter from "./controllers/AmenityController";
import reviewRouter from "./controllers/ReviewController";
import authRouter from "./controllers/AuthController";
import path from "path";

dotenv.config();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.options('*', cors());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json());

app.get("/", (_req, res) => res.send("HBnB API is running."));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/places", placeRouter);
app.use("/api/v1/amenities", amenityRouter);

app.use("/api/v1/places/:placeId/reviews", reviewRouter);

export default app;