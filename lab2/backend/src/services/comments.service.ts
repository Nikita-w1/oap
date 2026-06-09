import { ApiError } from "../infrastructure/apiError.js";
import { requiredString } from "../infrastructure/validation.js";
import { commentsRepository } from "../repositories/comments.repository.js";
import { ValidationDetail } from "../types/common.js";
import { CreateCommentDto, UpdateCommentDto } from "../types/dto.js";
import { Comment } from "../types/models.js";

function generateId() {
  return Date.now().toString();
}

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

export function getComments() {
  const items = commentsRepository.getAll();
  return { items, total: items.length };
}

export function getCommentById(id: string) {
  const comment = commentsRepository.findById(id);
  if (!comment) throw new ApiError(404, "NOT_FOUND", "Comment not found");
  return comment;
}

export function createComment(dto: CreateCommentDto): Comment {
  validateCreate(dto);

  const comment: Comment = {
    id: generateId(),
    resourceId: dto.resourceId,
    userId: dto.userId,
    text: dto.text.trim(),
    createdAt: new Date().toISOString(),
  };

  return commentsRepository.create(comment);
}

export function updateComment(id: string, dto: UpdateCommentDto) {
  const comment = getCommentById(id);

  if (dto.text !== undefined) comment.text = dto.text.trim();

  return comment;
}

export function deleteComment(id: string) {
  const deleted = commentsRepository.delete(id);
  if (!deleted) throw new ApiError(404, "NOT_FOUND", "Comment not found");
}
