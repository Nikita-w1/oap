import { Request, Response } from "express";
import { createComment, deleteComment, getCommentById, getComments, updateComment } from "../services/comments.service.js";

export async function getCommentsController(_req: Request, res: Response) {
  res.status(200).json({ data: await getComments() });
}

export async function getCommentController(req: Request, res: Response) {
  res.status(200).json({ data: await getCommentById(req.params.id) });
}

export async function createCommentController(req: Request, res: Response) {
  res.status(201).json({ data: await createComment(req.body) });
}

export async function updateCommentController(req: Request, res: Response) {
  res.status(200).json({ data: await updateComment(req.params.id, req.body) });
}

export async function deleteCommentController(req: Request, res: Response) {
  await deleteComment(req.params.id);
  res.status(204).send();
}
