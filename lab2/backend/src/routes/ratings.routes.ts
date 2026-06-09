import { Router } from "express";
import {
  createRatingController,
  deleteRatingController,
  getRatingController,
  getRatingsController,
  updateRatingController,
} from "../controllers/ratings.controller.js";

export const ratingsRouter = Router();

ratingsRouter.get("/", getRatingsController);
ratingsRouter.get("/:id", getRatingController);
ratingsRouter.post("/", createRatingController);
ratingsRouter.put("/:id", updateRatingController);
ratingsRouter.patch("/:id", updateRatingController);
ratingsRouter.delete("/:id", deleteRatingController);
