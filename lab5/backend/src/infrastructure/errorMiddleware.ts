import { NextFunction, Request, Response } from "express";
import { ApiError } from "./apiError.js";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  const message = err instanceof Error ? err.message : String(err);

  if (message.includes("UNIQUE constraint failed")) {
    res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "Unique constraint violation",
        details: [],
      },
    });
    return;
  }

  if (message.includes("NOT NULL constraint failed") || message.includes("CHECK constraint failed") || message.includes("FOREIGN KEY constraint failed")) {
    res.status(400).json({
      error: {
        code: "BAD_REQUEST",
        message: "Invalid data for database constraints",
        details: [],
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error",
      details: [],
    },
  });
}
