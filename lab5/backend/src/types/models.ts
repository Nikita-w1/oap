export type UserRole = "Student" | "Teacher" | "Admin";
export type ResourceType = "Video" | "Article" | "Course" | "Book" | "Tool";
export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  description: string;
  author: string;
  ownerUserId: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  resourceId: string;
  userId: string;
  value: RatingValue;
  createdAt: string;
}

export interface Comment {
  id: string;
  resourceId: string;
  userId: string;
  text: string;
  createdAt: string;
}
