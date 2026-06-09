import { Request, Response } from "express";
import { createRating, deleteRating, getRatingById, getRatings, updateRating } from "../services/ratings.service.js";

export async function getRatingsController(_req: Request, res: Response) {
  res.status(200).json({ data: await getRatings() });
}

export async function getRatingController(req: Request, res: Response) {
  res.status(200).json({ data: await getRatingById(req.params.id) });
}

export async function createRatingController(req: Request, res: Response) {
  res.status(201).json({ data: await createRating(req.body) });
}

export async function updateRatingController(req: Request, res: Response) {
  res.status(200).json({ data: await updateRating(req.params.id, req.body) });
}

export async function deleteRatingController(req: Request, res: Response) {
  await deleteRating(req.params.id);
  res.status(204).send();
}
