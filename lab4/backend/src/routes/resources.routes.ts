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

export const resourcesRouter = Router();

resourcesRouter.get("/", asyncHandler(getResourcesController));
resourcesRouter.get("/stats", asyncHandler(getResourcesStatsController));
resourcesRouter.get("/:id", asyncHandler(getResourceController));
resourcesRouter.post("/", asyncHandler(createResourceController));
resourcesRouter.put("/:id", asyncHandler(updateResourceController));
resourcesRouter.patch("/:id", asyncHandler(updateResourceController));
resourcesRouter.delete("/:id", asyncHandler(deleteResourceController));
