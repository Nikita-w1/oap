import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../services/users.service.js";

export function getUsersController(_req: Request, res: Response) {
  res.status(200).json(getUsers());
}

export function getUserController(req: Request, res: Response) {
  res.status(200).json(getUserById(req.params.id));
}

export function createUserController(req: Request, res: Response) {
  res.status(201).json(createUser(req.body));
}

export function updateUserController(req: Request, res: Response) {
  res.status(200).json(updateUser(req.params.id, req.body));
}

export function deleteUserController(req: Request, res: Response) {
  deleteUser(req.params.id);
  res.status(204).send();
}
