import { all, escapeSqlString, get, run } from "../db/dbClient.js";
import { User } from "../types/models.js";

const selectUser = "CAST(id AS TEXT) AS id, name, email, role, createdAt";

export const usersRepository = {
  async getAll(): Promise<User[]> {
    return all<User>(`SELECT ${selectUser} FROM Users ORDER BY id DESC;`);
  },

  async findById(id: string): Promise<User | undefined> {
    const userId = Number(id);
    return get<User>(`SELECT ${selectUser} FROM Users WHERE id = ${userId};`);
  },

  async create(user: Omit<User, "id">): Promise<User> {
    const result = await run(`
      INSERT INTO Users (name, email, role, createdAt)
      VALUES ('${escapeSqlString(user.name)}', '${escapeSqlString(user.email)}', '${user.role}', '${user.createdAt}');
    `);
    const created = await this.findById(String(result.lastID));
    if (!created) throw new Error("Failed to read created user");
    return created;
  },

  async update(id: string, user: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null> {
    const userId = Number(id);
    const current = await this.findById(id);
    if (!current) return null;

    const name = user.name ?? current.name;
    const email = user.email ?? current.email;
    const role = user.role ?? current.role;

    const result = await run(`
      UPDATE Users
      SET name = '${escapeSqlString(name)}', email = '${escapeSqlString(email)}', role = '${role}'
      WHERE id = ${userId};
    `);
    if (result.changes === 0) return null;
    return this.findById(id) as Promise<User>;
  },

  async delete(id: string): Promise<boolean> {
    const userId = Number(id);
    const result = await run(`DELETE FROM Users WHERE id = ${userId};`);
    return result.changes > 0;
  },
};
