-- 001_init.sql
-- Створення основної схеми БД для лабораторної роботи №3.
-- Ці SQL-команди також дублюються в initDb.ts, щоб застосунок міг виконувати міграції без додаткового парсера файлів.

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
