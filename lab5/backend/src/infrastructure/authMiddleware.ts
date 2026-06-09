import { NextFunction, Request, Response } from "express";
import { usersRepository } from "../repositories/users.repository.js";
import { User } from "../types/models.js";

export interface AuthenticatedRequest extends Request {
  currentUser: User;
}

export function getCurrentUser(req: Request): User {
  const user = (req as AuthenticatedRequest).currentUser;
  if (!user) {
    throw new Error("demoAuth middleware was not applied before protected controller");
  }
  return user;
}

export async function demoAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const rawUserId = req.header("X-Demo-UserId");

    if (!rawUserId) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing X-Demo-UserId header", details: [] } });
      return;
    }

    const userId = Number(rawUserId);
    if (!Number.isInteger(userId) || userId < 1) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid demo user", details: [] } });
      return;
    }

    const user = await usersRepository.findById(String(userId));
    if (!user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Unknown demo user", details: [] } });
      return;
    }

    (req as AuthenticatedRequest).currentUser = user;
    next();
  } catch (err) {
    next(err);
  }
}
