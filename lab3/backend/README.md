# Лабораторна робота №3 — SQLite + CRUD API

Тема проєкту: **каталог навчальних ресурсів**.

Проєкт перероблено з попередньої лабораторної так, щоб дані зберігалися не в масивах, а в SQLite-файлі `data/app.db`.

## Як запустити

```bash
cd backend
npm install
npm run dev:be
```

Фронтенд можна відкрити через Live Server з папки `frontend`.

Після запуску сервер автоматично:
1. відкриває SQLite-базу;
2. створює таблицю `schema_migrations`;
3. застосовує навчальні міграції;
4. створює тестові записи, якщо база порожня.

Health-check:

```bash
GET http://localhost:3000/health
```

## Схема БД

Таблиці:

1. `Users`
   - `id INTEGER PRIMARY KEY`
   - `name TEXT NOT NULL`
   - `email TEXT NOT NULL UNIQUE`
   - `role TEXT NOT NULL CHECK (role IN ('Student', 'Teacher', 'Admin'))`
   - `createdAt TEXT NOT NULL`

2. `Resources`
   - `id INTEGER PRIMARY KEY`
   - `title TEXT NOT NULL`
   - `url TEXT NOT NULL UNIQUE`
   - `type TEXT NOT NULL CHECK (type IN ('Video', 'Article', 'Course', 'Book', 'Tool'))`
   - `description TEXT NOT NULL`
   - `author TEXT NOT NULL`
   - `createdAt TEXT NOT NULL`

3. `Ratings`
   - `id INTEGER PRIMARY KEY`
   - `resourceId INTEGER NOT NULL`
   - `userId INTEGER NOT NULL`
   - `value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5)`
   - `createdAt TEXT NOT NULL`
   - `FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE`
   - `FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE`
   - `UNIQUE(resourceId, userId)`

4. `Comments`
   - `id INTEGER PRIMARY KEY`
   - `resourceId INTEGER NOT NULL`
   - `userId INTEGER NOT NULL`
   - `text TEXT NOT NULL`
   - `createdAt TEXT NOT NULL`
   - `FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE`
   - `FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE`

Звʼязки:

- один користувач може створити багато оцінок і коментарів;
- один ресурс може мати багато оцінок і коментарів;
- при видаленні ресурсу його оцінки й коментарі видаляються автоматично через `ON DELETE CASCADE`.

## Міграції

У проєкті є спрощена міграційність:

- таблиця `schema_migrations`;
- список міграцій у `src/db/initDb.ts`;
- навчальні SQL-файли у `src/db/migrations/`.

При старті застосунок перевіряє, які міграції вже застосовані, і виконує тільки нові.

## Основні endpoint-и

### Resources

```bash
GET    /api/resources
GET    /api/resources/:id
POST   /api/resources
PUT    /api/resources/:id
PATCH  /api/resources/:id
DELETE /api/resources/:id
```

Список підтримує фільтрацію, пошук, сортування і пагінацію:

```bash
GET /api/resources?search=node&type=Article&sortBy=title&sortDir=asc&page=1&pageSize=5
```

Тут використовуються `WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`.

### JOIN + агрегація

```bash
GET /api/resources/stats
```

Повертає ресурси разом із кількістю оцінок, середньою оцінкою та кількістю коментарів через `LEFT JOIN`, `COUNT`, `AVG`.

### Users

```bash
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Ratings

```bash
GET    /api/ratings
GET    /api/ratings/:id
POST   /api/ratings
PUT    /api/ratings/:id
PATCH  /api/ratings/:id
DELETE /api/ratings/:id
```

### Comments

```bash
GET    /api/comments
GET    /api/comments/:id
POST   /api/comments
PUT    /api/comments/:id
PATCH  /api/comments/:id
DELETE /api/comments/:id
```

## Приклади перевірки через PowerShell

Створення ресурсу, має повернути `201`:

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/resources" -ContentType "application/json" -Body '{
  "title": "Node.js Docs",
  "url": "https://nodejs.org/docs-test",
  "type": "Article",
  "description": "Official Node.js documentation",
  "author": "Node.js"
}'
```

Отримання списку, має повернути `200`:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/resources?search=node&sortBy=title&sortDir=asc&page=1&pageSize=5"
```

Отримання неіснуючого ресурсу, має повернути `404`:

```powershell
Invoke-WebRequest -Method GET -Uri "http://localhost:3000/api/resources/9999"
```

Некоректне тіло запиту, має повернути `400`:

```powershell
Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/resources" -ContentType "application/json" -Body '{"title":"no"}'
```

Дублікат `url`, має повернути `409 Conflict`:

```powershell
Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/resources" -ContentType "application/json" -Body '{
  "title": "JavaScript Basics Copy",
  "url": "https://developer.mozilla.org/",
  "type": "Article",
  "description": "Duplicate url check",
  "author": "MDN"
}'
```

Видалення, має повернути `204`:

```powershell
Invoke-WebRequest -Method DELETE -Uri "http://localhost:3000/api/resources/1"
```
