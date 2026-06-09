import { ApiError } from "../infrastructure/apiError.js";
import { requiredOneOf, requiredString } from "../infrastructure/validation.js";
import { ResourceQuery, resourcesRepository } from "../repositories/resources.repository.js";
import { ValidationDetail } from "../types/common.js";
import { CreateResourceDto, UpdateResourceDto } from "../types/dto.js";
import { Resource, ResourceType } from "../types/models.js";

const resourceTypes: ResourceType[] = ["Video", "Article", "Course", "Book", "Tool"];
const sortableFields: (keyof Resource)[] = ["title", "type", "author", "createdAt"];

function validateResourceFields(dto: Partial<CreateResourceDto>, requireAll: boolean) {
  const errors: ValidationDetail[] = [];

  if (requireAll || dto.title !== undefined) {
    const titleError = requiredString(dto.title, "title", 3);
    if (titleError) errors.push(titleError);
  }

  if (requireAll || dto.url !== undefined) {
    const urlError = requiredString(dto.url, "url", 8);
    if (urlError) errors.push(urlError);
    if (typeof dto.url === "string" && !dto.url.startsWith("http")) {
      errors.push({ field: "url", message: "url must start with http or https" });
    }
  }

  if (requireAll || dto.type !== undefined) {
    const typeError = requiredOneOf(dto.type, "type", resourceTypes);
    if (typeError) errors.push(typeError);
  }

  if (requireAll || dto.description !== undefined) {
    const descriptionError = requiredString(dto.description, "description", 5);
    if (descriptionError) errors.push(descriptionError);
  }

  if (requireAll || dto.author !== undefined) {
    const authorError = requiredString(dto.author, "author", 2);
    if (authorError) errors.push(authorError);
  }

  if (errors.length) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
}

function validateQuery(query: ResourceQuery) {
  const errors: ValidationDetail[] = [];
  if (query.type !== undefined && !resourceTypes.includes(query.type as ResourceType)) {
    errors.push({ field: "type", message: "type has invalid value" });
  }
  if (query.sortBy !== undefined && !sortableFields.includes(query.sortBy as keyof Resource)) {
    errors.push({ field: "sortBy", message: `sortBy must be one of: ${sortableFields.join(", ")}` });
  }
  if (query.sortDir !== undefined && query.sortDir !== "asc" && query.sortDir !== "desc") {
    errors.push({ field: "sortDir", message: "sortDir must be asc or desc" });
  }
  const page = Number(query.page ?? 1);
  const pageSize = Number(query.pageSize ?? 10);
  if (!Number.isInteger(page) || page < 1) errors.push({ field: "page", message: "page must be a positive integer" });
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 50) {
    errors.push({ field: "pageSize", message: "pageSize must be an integer from 1 to 50" });
  }
  if (errors.length) throw new ApiError(400, "VALIDATION_ERROR", "Invalid query parameters", errors);
}

function validateId(id: string) {
  if (!Number.isInteger(Number(id))) throw new ApiError(400, "VALIDATION_ERROR", "id must be a number");
}

export async function getResources(query: ResourceQuery) {
  validateQuery(query);
  return resourcesRepository.getAll(query);
}

export async function getResourcesWithStats() {
  return { items: await resourcesRepository.getWithStats() };
}

export async function getResourceById(id: string) {
  validateId(id);
  const resource = await resourcesRepository.findById(id);
  if (!resource) throw new ApiError(404, "NOT_FOUND", "Resource not found");
  return resource;
}

export async function createResource(dto: CreateResourceDto): Promise<Resource> {
  validateResourceFields(dto, true);
  return resourcesRepository.create({
    title: dto.title.trim(),
    url: dto.url.trim(),
    type: dto.type,
    description: dto.description.trim(),
    author: dto.author.trim(),
    createdAt: new Date().toISOString(),
  });
}

export async function updateResource(id: string, dto: UpdateResourceDto) {
  validateId(id);
  validateResourceFields(dto, false);
  const updated = await resourcesRepository.update(id, {
    title: dto.title?.trim(),
    url: dto.url?.trim(),
    type: dto.type,
    description: dto.description?.trim(),
    author: dto.author?.trim(),
  });
  if (!updated) throw new ApiError(404, "NOT_FOUND", "Resource not found");
  return updated;
}

export async function deleteResource(id: string) {
  validateId(id);
  const deleted = await resourcesRepository.delete(id);
  if (!deleted) throw new ApiError(404, "NOT_FOUND", "Resource not found");
}
