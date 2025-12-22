import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./controllers/UserController";
import placeRouter from "./controllers/PlaceController";
import amenityRouter from "./controllers/AmenityController";
import reviewRouter from "./controllers/ReviewController";
import authRouter from "./controllers/AuthController";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.get("/", (_req, res) => res.send("HBnB API is running."));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/places", placeRouter);
app.use("/api/v1/amenities", amenityRouter);
app.use("/api/v1/reviews", reviewRouter);

export default app;