import { Router } from "express";
import {
  getReservationsForPlace,
  getReservationsForUser,
  createReservation,
  deleteReservation,
} from "./ReservationController";
import { authenticateJWT } from "../middlewares/auth";

const router = Router({ mergeParams: true });

router.get("/places/:placeId/reservations", getReservationsForPlace);

router.get("/users/me/reservations", authenticateJWT, getReservationsForUser);

router.post("/places/:placeId/reservations", authenticateJWT, createReservation);

router.delete("/reservations/:id", authenticateJWT, deleteReservation);

export default router;