import { Request, Response } from "express";
import { availabilityRepository } from "../repositories/AvailabilityRepository";
import { placeRepository } from "../repositories/PlaceRepository";

export const getAvailabilities = async (req: Request, res: Response) => {
  const { placeId } = req.params;
  const availabilities = await availabilityRepository.find({
    where: { place: { id: placeId } },
    order: { from: "ASC" },
  });
  res.json(availabilities);
};

export const createAvailability = async (req: Request, res: Response) => {
  const { placeId } = req.params;
  const { from, to } = req.body;
  const place = await placeRepository.findOne({ where: { id: placeId } });
  if (!place) return res.status(404).json({ error: "Place not found" });

  if (!from || !to)
    return res.status(400).json({ error: "'from' and 'to' dates are required" });

  const availability = availabilityRepository.create({ from, to, place });
  await availabilityRepository.save(availability);
  res.status(201).json(availability);
};

export const deleteAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  const availability = await availabilityRepository.findOneBy({ id });
  if (!availability) return res.status(404).json({ error: "Availability not found" });

  await availabilityRepository.delete({ id });
  res.json({ message: "Availability deleted" });
};