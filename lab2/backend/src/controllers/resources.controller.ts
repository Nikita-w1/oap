import { Request, Response } from "express";
import {
  createResource,
  deleteResource,
  getResourceById,
  getResources,
  updateResource,
} from "../services/resources.service.js";

export function getResourcesController(req: Request, res: Response) {
  res.status(200).json(getResources(req.query as Record<string, string>));
}

export function getResourceController(req: Request, res: Response) {
  res.status(200).json(getResourceById(req.params.id));
}

export function createResourceController(req: Request, res: Response) {
  const resource = createResource(req.body);
  console.log("[RESOURCE CREATED]", resource);
  res.status(201).json(resource);
}

export function updateResourceController(req: Request, res: Response) {
  const resource = updateResource(req.params.id, req.body);
  console.log("[RESOURCE UPDATED]", resource);
  res.status(200).json(resource);
}

export function deleteResourceController(req: Request, res: Response) {
  deleteResource(req.params.id);
  console.log("[RESOURCE DELETED]", { id: req.params.id });
  res.status(204).send();
}
