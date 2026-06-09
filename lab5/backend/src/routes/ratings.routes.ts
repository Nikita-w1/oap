import { Router } from "express";
import {
  createRatingController,
  deleteRatingController,
  getRatingController,
  getRatingsController,
  updateRatingController,
} from "../controllers/ratings.controller.js";
import { asyncHandler } from "../infrastructure/asyncHandler.js";

export const ratingsRouter = Router();

ratingsRouter.get("/", asyncHandler(getRatingsController));
ratingsRouter.get("/:id", asyncHandler(getRatingController));
ratingsRouter.post("/", asyncHandler(createRatingController));
ratingsRouter.put("/:id", asyncHandler(updateRatingController));
ratingsRouter.patch("/:id", asyncHandler(updateRatingController));
ratingsRouter.delete("/:id", asyncHandler(deleteRatingController));
