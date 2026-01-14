import { Response } from "express";
import { reservationRepository } from "../repositories/ReservationRepository";
import { placeRepository } from "../repositories/PlaceRepository";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/User";
import { Place } from "../entities/Place";
import { AuthenticatedRequest } from "../middlewares/auth";

export const getReservationsForPlace = async (req: Response, res: Response) => {
  const { placeId } = req.params;
  const reservations = await reservationRepository.find({
    where: { place: { id: placeId } },
    order: { from: "ASC" },
    relations: { user: true }
  });
  return res.json(reservations);
};

export const getReservationsForUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const reservations = await reservationRepository.find({
    where: { user: { id: userId } },
    order: { from: "ASC" },
    relations: { place: true }
  });
  return res.json(reservations);
};

export const createReservation = async (req: AuthenticatedRequest, res: Response) => {
  const { placeId } = req.params;
  const { from, to } = req.body;
  const userId = req.user?.userId;

  if (!from || !to) {
    return res.status(400).json({ error: "'from' and 'to' dates are required" });
  }

  const place = await placeRepository.findOne({ where: { id: placeId } });
  if (!place) return res.status(404).json({ error: "Place not found" });

  const overlap = await AppDataSource
    .getRepository("Reservation")
    .createQueryBuilder("reservation")
    .where("reservation.place = :placeId", { placeId })
    .andWhere(
      "'from' <= :to AND 'to' >= :from",
      { from, to }
    )
    .getCount();

  if (overlap > 0) {
    return res.status(400).json({ error: "There is already a reservation overlapping in this period." });
  }

  const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const reservation = reservationRepository.create({
    from,
    to,
    user,
    place
  });

  await reservationRepository.save(reservation);

  return res.status(201).json(reservation);
};

export const deleteReservation = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const reservation = await reservationRepository.findOne({
    where: { id },
    relations: { user: true }
  });
  if (!reservation) return res.status(404).json({ error: "Reservation not found" });

  if (reservation.user.id !== userId && !req.user?.isAdmin) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await reservationRepository.delete({ id });
  return res.json({ message: "Reservation deleted" });
};