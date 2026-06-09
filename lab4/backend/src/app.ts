import express from "express";
import { ApiError } from "./infrastructure/apiError.js";
import { errorMiddleware } from "./infrastructure/errorMiddleware.js";
import { logMiddleware } from "./infrastructure/logMiddleware.js";
import { commentsRouter } from "./routes/comments.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { ratingsRouter } from "./routes/ratings.routes.js";
import { resourcesRouter } from "./routes/resources.routes.js";
import { usersRouter } from "./routes/users.routes.js";

export const app = express();

const allowedOrigins = new Set([
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(express.json());

// CORS для ЛР4: не дозволяємо всім через *, а працюємо через whitelist origin.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.has(origin)) {
    if (origin) res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(!origin || allowedOrigins.has(origin) ? 204 : 403);
    return;
  }

  next();
});

app.use(logMiddleware);

app.use(healthRouter);

// Основні маршрути для ЛР4 мають стабільний префікс /api/v1.
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/resources", resourcesRouter);
app.use("/api/v1/ratings", ratingsRouter);
app.use("/api/v1/comments", commentsRouter);

// Аліаси залишені для сумісності зі старою ЛР3.
app.use("/api/users", usersRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/comments", commentsRouter);

app.use((_req, _res, next) => {
  next(new ApiError(404, "NOT_FOUND", "Route not found"));
});

app.use(errorMiddleware);
