import { ApiError } from "../infrastructure/apiError.js";
import { requiredOneOf, requiredString } from "../infrastructure/validation.js";
import { ratingsRepository } from "../repositories/ratings.repository.js";
import { ValidationDetail } from "../types/common.js";
import { CreateRatingDto, UpdateRatingDto } from "../types/dto.js";
import { Rating, RatingValue } from "../types/models.js";

const values: RatingValue[] = [1, 2, 3, 4, 5];

function validateCreate(dto: CreateRatingDto) {
  const errors: ValidationDetail[] = [];
  const resourceError = requiredString(dto.resourceId, "resourceId", 1);
  const userError = requiredString(dto.userId, "userId", 1);
  const valueError = requiredOneOf(dto.value, "value", values);

  if (resourceError) errors.push(resourceError);
  if (userError) errors.push(userError);
  if (valueError) errors.push(valueError);
  if (errors.length) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
}

function validateId(id: string) {
  if (!Number.isInteger(Number(id))) throw new ApiError(400, "VALIDATION_ERROR", "id must be a number");
}

export async function getRatings() {
  const items = await ratingsRepository.getAll();
  return { items, total: items.length };
}

export async function getRatingById(id: string) {
  validateId(id);
  const rating = await ratingsRepository.findById(id);
  if (!rating) throw new ApiError(404, "NOT_FOUND", "Rating not found");
  return rating;
}

export async function createRating(dto: CreateRatingDto): Promise<Rating> {
  validateCreate(dto);
  return ratingsRepository.create({
    resourceId: dto.resourceId,
    userId: dto.userId,
    value: dto.value,
    createdAt: new Date().toISOString(),
  });
}

export async function updateRating(id: string, dto: UpdateRatingDto) {
  validateId(id);
  if (dto.value === undefined) throw new ApiError(400, "VALIDATION_ERROR", "value is required");
  const error = requiredOneOf(dto.value, "value", values);
  if (error) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [error]);
  const updated = await ratingsRepository.update(id, dto.value);
  if (!updated) throw new ApiError(404, "NOT_FOUND", "Rating not found");
  return updated;
}

export async function deleteRating(id: string) {
  validateId(id);
  const deleted = await ratingsRepository.delete(id);
  if (!deleted) throw new ApiError(404, "NOT_FOUND", "Rating not found");
}
