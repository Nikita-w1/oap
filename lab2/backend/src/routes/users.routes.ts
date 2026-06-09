import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
} from "../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.get("/", getUsersController);
usersRouter.get("/:id", getUserController);
usersRouter.post("/", createUserController);
usersRouter.put("/:id", updateUserController);
usersRouter.patch("/:id", updateUserController);
usersRouter.delete("/:id", deleteUserController);
