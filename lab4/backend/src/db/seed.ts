import { initDb } from "./initDb.js";
import { get, run } from "./dbClient.js";

export async function seedDb() {
  await initDb();
  const existing = await get<{ count: number }>("SELECT COUNT(*) as count FROM Resources;");
  if ((existing?.count ?? 0) > 0) {
    console.log("Seed skipped: database already has resources");
    return;
  }

  const now = new Date().toISOString();

  await run(`INSERT OR IGNORE INTO Users (id, name, email, role, createdAt) VALUES
    (1, 'Olena', 'olena@example.com', 'Student', '${now}'),
    (2, 'Ivan', 'ivan@example.com', 'Teacher', '${now}'),
    (3, 'Nikita', 'nikita@example.com', 'Student', '${now}');`);

  await run(`INSERT OR IGNORE INTO Resources (id, title, url, type, description, author, createdAt) VALUES
    (1, 'JavaScript Basics', 'https://developer.mozilla.org/', 'Article', 'Навчальний ресурс з JavaScript', 'MDN', '${now}'),
    (2, 'Node.js Docs', 'https://nodejs.org/', 'Article', 'Офіційна документація Node.js', 'Node.js Team', '${now}'),
    (3, 'SQLite Tutorial', 'https://www.sqlitetutorial.net/', 'Course', 'Короткий курс по SQLite', 'SQLite Tutorial', '${now}'),
    (4, 'Express Guide', 'https://expressjs.com/', 'Article', 'Документація Express', 'Express', '${now}'),
    (5, 'TypeScript Handbook', 'https://www.typescriptlang.org/docs/', 'Book', 'Довідник TypeScript', 'Microsoft', '${now}');`);

  await run(`INSERT OR IGNORE INTO Ratings (resourceId, userId, value, createdAt) VALUES
    (1, 1, 5, '${now}'),
    (1, 2, 4, '${now}'),
    (2, 1, 5, '${now}'),
    (3, 3, 4, '${now}');`);

  await run(`INSERT INTO Comments (resourceId, userId, text, createdAt) VALUES
    (1, 1, 'Корисний ресурс', '${now}'),
    (2, 2, 'Підійде для бекенду', '${now}'),
    (3, 3, 'Допомагає зрозуміти SQLite', '${now}');`);

  console.log("Seed completed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDb().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
}
