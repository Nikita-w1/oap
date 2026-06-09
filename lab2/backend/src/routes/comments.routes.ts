import { Router } from "express";
import {
  createCommentController,
  deleteCommentController,
  getCommentController,
  getCommentsController,
  updateCommentController,
} from "../controllers/comments.controller.js";

export const commentsRouter = Router();

commentsRouter.get("/", getCommentsController);
commentsRouter.get("/:id", getCommentController);
commentsRouter.post("/", createCommentController);
commentsRouter.put("/:id", updateCommentController);
commentsRouter.patch("/:id", updateCommentController);
commentsRouter.delete("/:id", deleteCommentController);
