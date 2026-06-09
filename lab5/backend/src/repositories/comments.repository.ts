import { all, get, run } from "../db/dbClient.js";
import { Comment } from "../types/models.js";

const selectComment = "CAST(id AS TEXT) AS id, CAST(resourceId AS TEXT) AS resourceId, CAST(userId AS TEXT) AS userId, text, createdAt";

export const commentsRepository = {
  async getAll(): Promise<Comment[]> {
    return all<Comment>(`SELECT ${selectComment} FROM Comments ORDER BY id DESC;`);
  },

  async findById(id: string): Promise<Comment | undefined> {
    return get<Comment>(`SELECT ${selectComment} FROM Comments WHERE id = ?;`, [Number(id)]);
  },

  async create(comment: Omit<Comment, "id">): Promise<Comment> {
    const result = await run(`
      INSERT INTO Comments (resourceId, userId, text, createdAt)
      VALUES (?, ?, ?, ?);
    `, [Number(comment.resourceId), Number(comment.userId), comment.text, comment.createdAt]);
    const created = await this.findById(String(result.lastID));
    if (!created) throw new Error("Failed to read created comment");
    return created;
  },

  async update(id: string, text: string): Promise<Comment | null> {
    const result = await run(`UPDATE Comments SET text = ? WHERE id = ?;`, [text, Number(id)]);
    if (result.changes === 0) return null;
    return this.findById(id) as Promise<Comment>;
  },

  async delete(id: string): Promise<boolean> {
    const result = await run(`DELETE FROM Comments WHERE id = ?;`, [Number(id)]);
    return result.changes > 0;
  },
};
