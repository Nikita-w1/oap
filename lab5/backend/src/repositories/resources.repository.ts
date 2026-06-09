import { all, get, run, SqlParam, toPositiveInt } from "../db/dbClient.js";
import { Resource, User } from "../types/models.js";

const selectResource = "CAST(id AS TEXT) AS id, title, url, type, description, author, CAST(ownerUserId AS TEXT) AS ownerUserId, createdAt";
const allowedSort = ["title", "type", "author", "createdAt"] as const;

export interface ResourceQuery {
  search?: string;
  type?: string;
  sortBy?: string;
  sortDir?: string;
  page?: string;
  pageSize?: string;
}

function buildWhere(query: ResourceQuery, user: User) {
  const parts: string[] = [];
  const params: SqlParam[] = [];

  if (user.role !== "Admin") {
    parts.push("ownerUserId = ?");
    params.push(user.id);
  }

  if (query.search) {
    parts.push("title LIKE ?");
    params.push(`%${query.search}%`);
  }
  if (query.type) {
    parts.push("type = ?");
    params.push(query.type);
  }
  return { where: parts.length ? `WHERE ${parts.join(" AND ")}` : "", params };
}

export const resourcesRepository = {
  async getAll(query: ResourceQuery = {}, user: User): Promise<{ items: Resource[]; total: number }> {
    const page = toPositiveInt(query.page, 1);
    const pageSize = Math.min(toPositiveInt(query.pageSize, 10), 50);
    const offset = (page - 1) * pageSize;
    const { where, params } = buildWhere(query, user);
    const sortBy = allowedSort.includes(query.sortBy as (typeof allowedSort)[number])
      ? query.sortBy
      : "createdAt";
    const sortDir = query.sortDir === "asc" ? "ASC" : "DESC";

    const items = await all<Resource>(`
      SELECT ${selectResource}
      FROM Resources
      ${where}
      ORDER BY ${sortBy} ${sortDir}
      LIMIT ? OFFSET ?;
    `, [...params, pageSize, offset]);
    const count = await get<{ total: number }>(`SELECT COUNT(*) AS total FROM Resources ${where};`, params);
    return { items, total: count?.total ?? 0 };
  },

  async findById(id: string, user?: User): Promise<Resource | undefined> {
    const params: SqlParam[] = [Number(id)];
    let ownerFilter = "";
    if (user && user.role !== "Admin") {
      ownerFilter = " AND ownerUserId = ?";
      params.push(user.id);
    }
    return get<Resource>(`SELECT ${selectResource} FROM Resources WHERE id = ?${ownerFilter};`, params);
  },

  async getWithStats(user: User): Promise<unknown[]> {
    const params: SqlParam[] = [];
    let ownerFilter = "";
    if (user.role !== "Admin") {
      ownerFilter = "WHERE r.ownerUserId = ?";
      params.push(user.id);
    }
    return all(`
      SELECT
        CAST(r.id AS TEXT) AS id,
        r.title,
        r.type,
        r.author,
        CAST(r.ownerUserId AS TEXT) AS ownerUserId,
        COUNT(DISTINCT rt.id) AS ratingsCount,
        ROUND(AVG(rt.value), 2) AS averageRating,
        COUNT(DISTINCT c.id) AS commentsCount
      FROM Resources r
      LEFT JOIN Ratings rt ON rt.resourceId = r.id
      LEFT JOIN Comments c ON c.resourceId = r.id
      ${ownerFilter}
      GROUP BY r.id
      ORDER BY averageRating DESC, r.id DESC;
    `, params);
  },

  async create(resource: Omit<Resource, "id">): Promise<Resource> {
    const result = await run(`
      INSERT INTO Resources (title, url, type, description, author, ownerUserId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `, [
      resource.title,
      resource.url,
      resource.type,
      resource.description,
      resource.author,
      resource.ownerUserId,
      resource.createdAt,
    ]);
    const created = await this.findById(String(result.lastID));
    if (!created) throw new Error("Failed to read created resource");
    return created;
  },

  async update(id: string, resource: Partial<Omit<Resource, "id" | "createdAt" | "ownerUserId">>, user: User): Promise<Resource | null> {
    const current = await this.findById(id, user);
    if (!current) return null;

    const title = resource.title ?? current.title;
    const url = resource.url ?? current.url;
    const type = resource.type ?? current.type;
    const description = resource.description ?? current.description;
    const author = resource.author ?? current.author;

    const params: SqlParam[] = [title, url, type, description, author, Number(id)];
    let ownerFilter = "";
    if (user.role !== "Admin") {
      ownerFilter = " AND ownerUserId = ?";
      params.push(user.id);
    }

    const result = await run(`
      UPDATE Resources
      SET title = ?, url = ?, type = ?, description = ?, author = ?
      WHERE id = ?${ownerFilter};
    `, params);
    if (result.changes === 0) return null;
    return this.findById(id, user) as Promise<Resource>;
  },

  async delete(id: string, user: User): Promise<boolean> {
    const params: SqlParam[] = [Number(id)];
    let ownerFilter = "";
    if (user.role !== "Admin") {
      ownerFilter = " AND ownerUserId = ?";
      params.push(user.id);
    }
    const result = await run(`DELETE FROM Resources WHERE id = ?${ownerFilter};`, params);
    return result.changes > 0;
  },
};
