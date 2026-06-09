import { RatingValue, ResourceType, UserRole } from "./models.js";

export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
}
export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface CreateResourceDto {
  title: string;
  url: string;
  type: ResourceType;
  description: string;
  author: string;
}
export interface UpdateResourceDto {
  title?: string;
  url?: string;
  type?: ResourceType;
  description?: string;
  author?: string;
}

export interface CreateRatingDto {
  resourceId: string;
  userId: string;
  value: RatingValue;
}
export interface UpdateRatingDto {
  value?: RatingValue;
}

export interface CreateCommentDto {
  resourceId: string;
  userId: string;
  text: string;
}
export interface UpdateCommentDto {
  text?: string;
}
