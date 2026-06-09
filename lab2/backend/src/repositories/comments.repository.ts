import { comments } from "../store/comments.store.js";
import { Comment } from "../types/models.js";

export const commentsRepository = {
  getAll(): Comment[] {
    return comments;
  },
  findById(id: string): Comment | undefined {
    return comments.find((item) => item.id === id);
  },
  create(comment: Comment): Comment {
    comments.push(comment);
    return comment;
  },
  delete(id: string): boolean {
    const index = comments.findIndex((item) => item.id === id);
    if (index === -1) return false;
    comments.splice(index, 1);
    return true;
  },
};
