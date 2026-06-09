export type ResourceType = "Video" | "Article" | "Course" | "Book" | "Tool";
export type SortDir = "asc" | "desc";
export type SortBy = "title" | "type" | "author" | "createdAt";

export interface ResourceDto {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  description: string;
  author: string;
  createdAt?: string;
}

export interface CreateResourceDto {
  title: string;
  url: string;
  type: ResourceType;
  description: string;
  author: string;
}

export type UpdateResourceDto = Partial<CreateResourceDto>;

export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total?: number;
  };
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
  errors?: Record<string, string[]> | null;
}

export interface ResourceQuery {
  search?: string;
  type?: string;
  sortBy?: SortBy;
  sortDir?: SortDir;
  page?: number;
  pageSize?: number;
}
