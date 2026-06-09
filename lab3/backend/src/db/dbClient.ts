import { db } from "./db.js";

export interface RunInfo {
  lastID: number;
  changes: number;
}

export function logSql(sql: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[SQL]", sql.trim().replace(/\s+/g, " "));
  }
}

export function escapeSqlString(value: unknown): string {
  return String(value ?? "").replace(/'/g, "''");
}

export function toPositiveInt(value: unknown, fallback = 1): number {
  const n = Number(value ?? fallback);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export function all<T>(sql: string): Promise<T[]> {
  logSql(sql);
  return new Promise((resolve, reject) => {
    db.all<T>(sql, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

export function get<T>(sql: string): Promise<T | undefined> {
  logSql(sql);
  return new Promise((resolve, reject) => {
    db.get<T>(sql, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

export function run(sql: string): Promise<RunInfo> {
  logSql(sql);
  return new Promise((resolve, reject) => {
    db.run(sql, function (this: RunInfo, err: Error | null) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}
