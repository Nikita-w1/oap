import { all, get, run } from "../db/dbClient.js";
import { Rating } from "../types/models.js";

const selectRating = "CAST(id AS TEXT) AS id, CAST(resourceId AS TEXT) AS resourceId, CAST(userId AS TEXT) AS userId, value, createdAt";

export const ratingsRepository = {
  async getAll(): Promise<Rating[]> {
    return all<Rating>(`SELECT ${selectRating} FROM Ratings ORDER BY id DESC;`);
  },

  async findById(id: string): Promise<Rating | undefined> {
    return get<Rating>(`SELECT ${selectRating} FROM Ratings WHERE id = ?;`, [Number(id)]);
  },

  async create(rating: Omit<Rating, "id">): Promise<Rating> {
    const result = await run(`
      INSERT INTO Ratings (resourceId, userId, value, createdAt)
      VALUES (?, ?, ?, ?);
    `, [Number(rating.resourceId), Number(rating.userId), rating.value, rating.createdAt]);
    const created = await this.findById(String(result.lastID));
    if (!created) throw new Error("Failed to read created rating");
    return created;
  },

  async update(id: string, value: number): Promise<Rating | null> {
    const result = await run(`UPDATE Ratings SET value = ? WHERE id = ?;`, [value, Number(id)]);
    if (result.changes === 0) return null;
    return this.findById(id) as Promise<Rating>;
  },

  async delete(id: string): Promise<boolean> {
    const result = await run(`DELETE FROM Ratings WHERE id = ?;`, [Number(id)]);
    return result.changes > 0;
  },
};
