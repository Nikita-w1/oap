import { Router } from "express";
import {
  createResourceController,
  deleteResourceController,
  getResourceController,
  getResourcesController,
  getResourcesStatsController,
  updateResourceController,
} from "../controllers/resources.controller.js";
import { asyncHandler } from "../infrastructure/asyncHandler.js";
import { demoAuth } from "../infrastructure/authMiddleware.js";

export const resourcesRouter = Router();

resourcesRouter.use(asyncHandler(demoAuth));
resourcesRouter.get("/", asyncHandler(getResourcesController));
resourcesRouter.get("/stats", asyncHandler(getResourcesStatsController));
resourcesRouter.get("/:id", asyncHandler(getResourceController));
resourcesRouter.post("/", asyncHandler(createResourceController));
resourcesRouter.put("/:id", asyncHandler(updateResourceController));
resourcesRouter.patch("/:id", asyncHandler(updateResourceController));
resourcesRouter.delete("/:id", asyncHandler(deleteResourceController));
