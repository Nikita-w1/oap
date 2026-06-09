import { ApiError } from "../infrastructure/apiError.js";
import { requiredOneOf, requiredString } from "../infrastructure/validation.js";
import { ratingsRepository } from "../repositories/ratings.repository.js";
import { ValidationDetail } from "../types/common.js";
import { CreateRatingDto, UpdateRatingDto } from "../types/dto.js";
import { Rating, RatingValue } from "../types/models.js";

const values: RatingValue[] = [1, 2, 3, 4, 5];

function generateId() {
  return Date.now().toString();
}

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

export function getRatings() {
  const items = ratingsRepository.getAll();
  return { items, total: items.length };
}

export function getRatingById(id: string) {
  const rating = ratingsRepository.findById(id);
  if (!rating) throw new ApiError(404, "NOT_FOUND", "Rating not found");
  return rating;
}

export function createRating(dto: CreateRatingDto): Rating {
  validateCreate(dto);

  const rating: Rating = {
    id: generateId(),
    resourceId: dto.resourceId,
    userId: dto.userId,
    value: dto.value,
    createdAt: new Date().toISOString(),
  };

  return ratingsRepository.create(rating);
}

export function updateRating(id: string, dto: UpdateRatingDto) {
  const rating = getRatingById(id);

  if (dto.value !== undefined) {
    const error = requiredOneOf(dto.value, "value", values);
    if (error) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [error]);
    rating.value = dto.value;
  }

  return rating;
}

export function deleteRating(id: string) {
  const deleted = ratingsRepository.delete(id);
  if (!deleted) throw new ApiError(404, "NOT_FOUND", "Rating not found");
}
