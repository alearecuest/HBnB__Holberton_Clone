import { Router } from "express";
import {
  getAvailabilities,
  createAvailability,
  deleteAvailability,
} from "./AvailabilityController";
import { authenticateJWT } from "../middlewares/auth";

const router = Router({ mergeParams: true });

router.get("/places/:placeId/availabilities", getAvailabilities);

router.post("/places/:placeId/availabilities", authenticateJWT, createAvailability);

router.delete("/availabilities/:id", authenticateJWT, deleteAvailability);

export default router;