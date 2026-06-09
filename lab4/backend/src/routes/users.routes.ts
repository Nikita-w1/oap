import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
} from "../controllers/users.controller.js";
import { asyncHandler } from "../infrastructure/asyncHandler.js";

export const usersRouter = Router();

usersRouter.get("/", asyncHandler(getUsersController));
usersRouter.get("/:id", asyncHandler(getUserController));
usersRouter.post("/", asyncHandler(createUserController));
usersRouter.put("/:id", asyncHandler(updateUserController));
usersRouter.patch("/:id", asyncHandler(updateUserController));
usersRouter.delete("/:id", asyncHandler(deleteUserController));
