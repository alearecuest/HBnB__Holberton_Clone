import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./controllers/UserController";
import placeRouter from "./controllers/PlaceController";
import amenityRouter from "./controllers/AmenityController";
import reviewRouter from "./controllers/ReviewController";
import authRouter from "./controllers/AuthController";
import path from "path";
import reservationRouter from "./controllers/ReservationRouter";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://hbnb-holberton-clone-h1pz.onrender.com"
    ],
    credentials: true
}));

app.options('*', cors());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/places", placeRouter);
app.use("/api/v1/amenities", amenityRouter);
app.use("/api/v1/places/:placeId/reviews", reviewRouter);
app.use("/api/v1", reservationRouter);

const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

export default app;