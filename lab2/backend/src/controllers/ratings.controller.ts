import { Request, Response } from "express";
import {
  createRating,
  deleteRating,
  getRatingById,
  getRatings,
  updateRating,
} from "../services/ratings.service.js";

export function getRatingsController(_req: Request, res: Response) {
  res.status(200).json(getRatings());
}

export function getRatingController(req: Request, res: Response) {
  res.status(200).json(getRatingById(req.params.id));
}

export function createRatingController(req: Request, res: Response) {
  res.status(201).json(createRating(req.body));
}

export function updateRatingController(req: Request, res: Response) {
  res.status(200).json(updateRating(req.params.id, req.body));
}

export function deleteRatingController(req: Request, res: Response) {
  deleteRating(req.params.id);
  res.status(204).send();
}
