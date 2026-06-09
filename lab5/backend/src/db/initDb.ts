import { get, run } from "./dbClient.js";

const migrations = [
  {
    id: "001_init",
    sql: `
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL CHECK (role IN ('Student', 'Teacher', 'Admin')),
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Resources (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL CHECK (type IN ('Video', 'Article', 'Course', 'Book', 'Tool')),
        description TEXT NOT NULL,
        author TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Ratings (
        id INTEGER PRIMARY KEY,
        resourceId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
        createdAt TEXT NOT NULL,
        FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
        UNIQUE(resourceId, userId)
      );

      CREATE TABLE IF NOT EXISTS Comments (
        id INTEGER PRIMARY KEY,
        resourceId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        text TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
      );
    `,
  },
  {
    id: "002_add_indexes",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_resources_type ON Resources(type);
      CREATE INDEX IF NOT EXISTS idx_resources_createdAt ON Resources(createdAt);
      CREATE INDEX IF NOT EXISTS idx_ratings_resourceId ON Ratings(resourceId);
      CREATE INDEX IF NOT EXISTS idx_comments_resourceId ON Comments(resourceId);
    `,
  },
  {
    id: "003_lab5_owner_user",
    sql: `
      ALTER TABLE Resources ADD COLUMN ownerUserId INTEGER NOT NULL DEFAULT 1;
      CREATE INDEX IF NOT EXISTS idx_resources_ownerUserId ON Resources(ownerUserId);
    `,
  },
];

async function executeStatements(sql: string) {
  const statements = sql
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await run(`${statement};`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("duplicate column name")) {
        console.log("Migration statement skipped:", message);
        continue;
      }
      throw err;
    }
  }
}

export async function initDb() {
  await run("PRAGMA foreign_keys = ON;");
  await run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      appliedAt TEXT NOT NULL
    );
  `);

  for (const migration of migrations) {
    const applied = await get<{ id: string }>(
      "SELECT id FROM schema_migrations WHERE id = ?;",
      [migration.id],
    );
    if (!applied) {
      await executeStatements(migration.sql);
      await run(
        "INSERT INTO schema_migrations (id, appliedAt) VALUES (?, ?);",
        [migration.id, new Date().toISOString()],
      );
      console.log("Migration applied:", migration.id);
    }
  }

  console.log("DB schema initialized");
}
