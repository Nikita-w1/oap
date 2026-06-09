import { Request, Response } from "express";

export function healthController(_req: Request, res: Response) {
  res.status(200).json({ ok: true, service: "lab3-sqlite-resources-api" });
}
