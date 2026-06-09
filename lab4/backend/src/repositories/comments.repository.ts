import { all, escapeSqlString, get, run } from "../db/dbClient.js";
import { Comment } from "../types/models.js";

const selectComment = "CAST(id AS TEXT) AS id, CAST(resourceId AS TEXT) AS resourceId, CAST(userId AS TEXT) AS userId, text, createdAt";

export const commentsRepository = {
  async getAll(): Promise<Comment[]> {
    return all<Comment>(`SELECT ${selectComment} FROM Comments ORDER BY id DESC;`);
  },

  async findById(id: string): Promise<Comment | undefined> {
    const commentId = Number(id);
    return get<Comment>(`SELECT ${selectComment} FROM Comments WHERE id = ${commentId};`);
  },

  async create(comment: Omit<Comment, "id">): Promise<Comment> {
    const result = await run(`
      INSERT INTO Comments (resourceId, userId, text, createdAt)
      VALUES (${Number(comment.resourceId)}, ${Number(comment.userId)}, '${escapeSqlString(comment.text)}', '${comment.createdAt}');
    `);
    const created = await this.findById(String(result.lastID));
    if (!created) throw new Error("Failed to read created comment");
    return created;
  },

  async update(id: string, text: string): Promise<Comment | null> {
    const commentId = Number(id);
    const result = await run(`UPDATE Comments SET text = '${escapeSqlString(text)}' WHERE id = ${commentId};`);
    if (result.changes === 0) return null;
    return this.findById(id) as Promise<Comment>;
  },

  async delete(id: string): Promise<boolean> {
    const commentId = Number(id);
    const result = await run(`DELETE FROM Comments WHERE id = ${commentId};`);
    return result.changes > 0;
  },
};
