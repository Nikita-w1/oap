import { Request, Response } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../services/users.service.js";

export async function getUsersController(_req: Request, res: Response) {
  res.status(200).json({ data: await getUsers() });
}

export async function getUserController(req: Request, res: Response) {
  res.status(200).json({ data: await getUserById(req.params.id) });
}

export async function createUserController(req: Request, res: Response) {
  res.status(201).json({ data: await createUser(req.body) });
}

export async function updateUserController(req: Request, res: Response) {
  res.status(200).json({ data: await updateUser(req.params.id, req.body) });
}

export async function deleteUserController(req: Request, res: Response) {
  await deleteUser(req.params.id);
  res.status(204).send();
}
