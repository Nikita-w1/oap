import { Request, Response } from "express";
import {
  createResource,
  deleteResource,
  getResourceById,
  getResources,
  getResourcesWithStats,
  updateResource,
} from "../services/resources.service.js";

export async function getResourcesController(req: Request, res: Response) {
  const result = await getResources(req.query as Record<string, string>);
  res.status(200).json({ data: result.items, meta: { total: result.total } });
}

export async function getResourcesStatsController(_req: Request, res: Response) {
  res.status(200).json({ data: await getResourcesWithStats() });
}

export async function getResourceController(req: Request, res: Response) {
  res.status(200).json({ data: await getResourceById(req.params.id) });
}

export async function createResourceController(req: Request, res: Response) {
  const resource = await createResource(req.body);
  console.log("[RESOURCE CREATED]", resource);
  res.status(201).json({ data: resource });
}

export async function updateResourceController(req: Request, res: Response) {
  const resource = await updateResource(req.params.id, req.body);
  console.log("[RESOURCE UPDATED]", resource);
  res.status(200).json({ data: resource });
}

export async function deleteResourceController(req: Request, res: Response) {
  await deleteResource(req.params.id);
  console.log("[RESOURCE DELETED]", { id: req.params.id });
  res.status(204).send();
}
