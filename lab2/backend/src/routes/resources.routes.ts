import { Router } from "express";
import {
  createResourceController,
  deleteResourceController,
  getResourceController,
  getResourcesController,
  updateResourceController,
} from "../controllers/resources.controller.js";

export const resourcesRouter = Router();

resourcesRouter.get("/", getResourcesController);
resourcesRouter.get("/:id", getResourceController);
resourcesRouter.post("/", createResourceController);
resourcesRouter.put("/:id", updateResourceController);
resourcesRouter.patch("/:id", updateResourceController);
resourcesRouter.delete("/:id", deleteResourceController);
