import { Request, Response } from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  updateComment,
} from "../services/comments.service.js";

export function getCommentsController(_req: Request, res: Response) {
  res.status(200).json(getComments());
}

export function getCommentController(req: Request, res: Response) {
  res.status(200).json(getCommentById(req.params.id));
}

export function createCommentController(req: Request, res: Response) {
  res.status(201).json(createComment(req.body));
}

export function updateCommentController(req: Request, res: Response) {
  res.status(200).json(updateComment(req.params.id, req.body));
}

export function deleteCommentController(req: Request, res: Response) {
  deleteComment(req.params.id);
  res.status(204).send();
}
