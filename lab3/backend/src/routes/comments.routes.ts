import { Router } from "express";
import {
  createCommentController,
  deleteCommentController,
  getCommentController,
  getCommentsController,
  updateCommentController,
} from "../controllers/comments.controller.js";
import { asyncHandler } from "../infrastructure/asyncHandler.js";

export const commentsRouter = Router();

commentsRouter.get("/", asyncHandler(getCommentsController));
commentsRouter.get("/:id", asyncHandler(getCommentController));
commentsRouter.post("/", asyncHandler(createCommentController));
commentsRouter.put("/:id", asyncHandler(updateCommentController));
commentsRouter.patch("/:id", asyncHandler(updateCommentController));
commentsRouter.delete("/:id", asyncHandler(deleteCommentController));
