declare module "sqlite3" {
  export interface RunResult {
    lastID: number;
    changes: number;
  }
  export interface Database {
    run(sql: string, callback?: (this: RunResult, err: Error | null) => void): void;
    all<T = Record<string, unknown>>(sql: string, callback: (err: Error | null, rows: T[]) => void): void;
    get<T = Record<string, unknown>>(sql: string, callback: (err: Error | null, row: T | undefined) => void): void;
    close(callback?: (err: Error | null) => void): void;
    serialize(callback: () => void): void;
  }
  export interface Sqlite3Static {
    verbose(): Sqlite3Static;
    Database: new (filename: string, callback?: (err: Error | null) => void) => Database;
  }
  const sqlite3: Sqlite3Static;
  export default sqlite3;
}
