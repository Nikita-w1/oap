import { db } from "./db.js";

export interface RunInfo {
  lastID: number;
  changes: number;
}

export type SqlParam = string | number | null | undefined;

export function logSql(sql: string, params: SqlParam[] = []) {
  if (process.env.NODE_ENV !== "production") {
    const normalized = sql.trim().replace(/\s+/g, " ");
    console.log("[SQL]", normalized, params.length ? `[params: ${JSON.stringify(params)}]` : "");
  }
}

export function toPositiveInt(value: unknown, fallback = 1): number {
  const n = Number(value ?? fallback);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export function all<T>(sql: string, params: SqlParam[] = []): Promise<T[]> {
  logSql(sql, params);
  return new Promise((resolve, reject) => {
    db.all<T>(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

export function get<T>(sql: string, params: SqlParam[] = []): Promise<T | undefined> {
  logSql(sql, params);
  return new Promise((resolve, reject) => {
    db.get<T>(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

export function run(sql: string, params: SqlParam[] = []): Promise<RunInfo> {
  logSql(sql, params);
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: RunInfo, err: Error | null) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}
