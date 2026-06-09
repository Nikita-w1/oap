import { resources } from "../store/resources.store.js";
import { Resource } from "../types/models.js";

export const resourcesRepository = {
  getAll(): Resource[] {
    return resources;
  },
  findById(id: string): Resource | undefined {
    return resources.find((item) => item.id === id);
  },
  create(resource: Resource): Resource {
    resources.push(resource);
    return resource;
  },
  delete(id: string): boolean {
    const index = resources.findIndex((item) => item.id === id);
    if (index === -1) return false;
    resources.splice(index, 1);
    return true;
  },
};
