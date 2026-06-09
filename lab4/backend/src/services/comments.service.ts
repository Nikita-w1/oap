import { ApiError } from "../infrastructure/apiError.js";
import { requiredString } from "../infrastructure/validation.js";
import { commentsRepository } from "../repositories/comments.repository.js";
import { ValidationDetail } from "../types/common.js";
import { CreateCommentDto, UpdateCommentDto } from "../types/dto.js";
import { Comment } from "../types/models.js";

function validateCreate(dto: CreateCommentDto) {
  const errors: ValidationDetail[] = [];
  const resourceError = requiredString(dto.resourceId, "resourceId", 1);
  const userError = requiredString(dto.userId, "userId", 1);
  const textError = requiredString(dto.text, "text", 2);

  if (resourceError) errors.push(resourceError);
  if (userError) errors.push(userError);
  if (textError) errors.push(textError);
  if (errors.length) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
}

function validateId(id: string) {
  if (!Number.isInteger(Number(id))) throw new ApiError(400, "VALIDATION_ERROR", "id must be a number");
}

export async function getComments() {
  const items = await commentsRepository.getAll();
  return { items, total: items.length };
}

export async function getCommentById(id: string) {
  validateId(id);
  const comment = await commentsRepository.findById(id);
  if (!comment) throw new ApiError(404, "NOT_FOUND", "Comment not found");
  return comment;
}

export async function createComment(dto: CreateCommentDto): Promise<Comment> {
  validateCreate(dto);
  return commentsRepository.create({
    resourceId: dto.resourceId,
    userId: dto.userId,
    text: dto.text.trim(),
    createdAt: new Date().toISOString(),
  });
}

export async function updateComment(id: string, dto: UpdateCommentDto) {
  validateId(id);
  if (dto.text === undefined || dto.text.trim().length < 2) {
    throw new ApiError(400, "VALIDATION_ERROR", "text is required");
  }
  const updated = await commentsRepository.update(id, dto.text.trim());
  if (!updated) throw new ApiError(404, "NOT_FOUND", "Comment not found");
  return updated;
}

export async function deleteComment(id: string) {
  validateId(id);
  const deleted = await commentsRepository.delete(id);
  if (!deleted) throw new ApiError(404, "NOT_FOUND", "Comment not found");
}
