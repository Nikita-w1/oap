import { all, escapeSqlString, get, run, toPositiveInt } from "../db/dbClient.js";
import { Resource } from "../types/models.js";

const selectResource = "CAST(id AS TEXT) AS id, title, url, type, description, author, createdAt";
const allowedSort = ["title", "type", "author", "createdAt"] as const;

export interface ResourceQuery {
  search?: string;
  type?: string;
  sortBy?: string;
  sortDir?: string;
  page?: string;
  pageSize?: string;
}

function buildWhere(query: ResourceQuery) {
  const parts: string[] = [];
  if (query.search) {
    parts.push(`title LIKE '%${escapeSqlString(query.search)}%'`);
  }
  if (query.type) {
    parts.push(`type = '${escapeSqlString(query.type)}'`);
  }
  return parts.length ? `WHERE ${parts.join(" AND ")}` : "";
}

export const resourcesRepository = {
  async getAll(query: ResourceQuery = {}): Promise<{ items: Resource[]; total: number }> {
    const page = toPositiveInt(query.page, 1);
    const pageSize = Math.min(toPositiveInt(query.pageSize, 10), 50);
    const offset = (page - 1) * pageSize;
    const where = buildWhere(query);
    const sortBy = allowedSort.includes(query.sortBy as (typeof allowedSort)[number])
      ? query.sortBy
      : "createdAt";
    const sortDir = query.sortDir === "asc" ? "ASC" : "DESC";

    const items = await all<Resource>(`
      SELECT ${selectResource}
      FROM Resources
      ${where}
      ORDER BY ${sortBy} ${sortDir}
      LIMIT ${pageSize} OFFSET ${offset};
    `);
    const count = await get<{ total: number }>(`SELECT COUNT(*) AS total FROM Resources ${where};`);
    return { items, total: count?.total ?? 0 };
  },

  async findById(id: string): Promise<Resource | undefined> {
    const resourceId = Number(id);
    return get<Resource>(`SELECT ${selectResource} FROM Resources WHERE id = ${resourceId};`);
  },

  async getWithStats(): Promise<unknown[]> {
    return all(`
      SELECT
        CAST(r.id AS TEXT) AS id,
        r.title,
        r.type,
        r.author,
        COUNT(DISTINCT rt.id) AS ratingsCount,
        ROUND(AVG(rt.value), 2) AS averageRating,
        COUNT(DISTINCT c.id) AS commentsCount
      FROM Resources r
      LEFT JOIN Ratings rt ON rt.resourceId = r.id
      LEFT JOIN Comments c ON c.resourceId = r.id
      GROUP BY r.id
      ORDER BY averageRating DESC, r.id DESC;
    `);
  },

  async create(resource: Omit<Resource, "id">): Promise<Resource> {
    const result = await run(`
      INSERT INTO Resources (title, url, type, description, author, createdAt)
      VALUES (
        '${escapeSqlString(resource.title)}',
        '${escapeSqlString(resource.url)}',
        '${resource.type}',
        '${escapeSqlString(resource.description)}',
        '${escapeSqlString(resource.author)}',
        '${resource.createdAt}'
      );
    `);
    const created = await this.findById(String(result.lastID));
    if (!created) throw new Error("Failed to read created resource");
    return created;
  },

  async update(id: string, resource: Partial<Omit<Resource, "id" | "createdAt">>): Promise<Resource | null> {
    const resourceId = Number(id);
    const current = await this.findById(id);
    if (!current) return null;

    const title = resource.title ?? current.title;
    const url = resource.url ?? current.url;
    const type = resource.type ?? current.type;
    const description = resource.description ?? current.description;
    const author = resource.author ?? current.author;

    const result = await run(`
      UPDATE Resources
      SET title = '${escapeSqlString(title)}',
          url = '${escapeSqlString(url)}',
          type = '${type}',
          description = '${escapeSqlString(description)}',
          author = '${escapeSqlString(author)}'
      WHERE id = ${resourceId};
    `);
    if (result.changes === 0) return null;
    return this.findById(id) as Promise<Resource>;
  },

  async delete(id: string): Promise<boolean> {
    const resourceId = Number(id);
    const result = await run(`DELETE FROM Resources WHERE id = ${resourceId};`);
    return result.changes > 0;
  },
};
