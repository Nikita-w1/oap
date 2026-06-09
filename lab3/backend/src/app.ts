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

app.use(express.json());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(logMiddleware);

app.use(healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/comments", commentsRouter);

app.use((_req, _res, next) => {
  next(new ApiError(404, "NOT_FOUND", "Route not found"));
});

app.use(errorMiddleware);
