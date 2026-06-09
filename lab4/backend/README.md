# Лабораторна робота №4 — інтеграція фронтенду з бекендом

Тема проєкту: **каталог навчальних ресурсів**.

У роботі фронтенд і бекенд запускаються окремо та взаємодіють тільки через HTTP API. Основна сутність — `resources`.

## Що реалізовано за рівнями

### Задовільно

- Бекенд має ендпоінти читання:
  - `GET /api/v1/resources` — список ресурсів;
  - `GET /api/v1/resources/:id` — деталі одного ресурсу.
- Фронтенд завантажує реальні дані через `fetch`, а не через вручну записаний JSON.
- Дані показуються у таблиці: назва, посилання, тип, автор, дії.
- Є стани інтерфейсу: `loading`, `success`, `empty`, `error`.
- Якщо бекенд повертає 400/404/500 або він недоступний, користувач бачить повідомлення.
- URL бекенду винесено в `frontend/src/config.ts`.
- CORS налаштовано для конкретних origin фронтенду, а не через `*`.

### Добре

- Реалізовано зміну даних через UI:
  - `POST /api/v1/resources` — створення;
  - `PUT /api/v1/resources/:id` — редагування;
  - `DELETE /api/v1/resources/:id` — видалення.
- Є клієнтська валідація форми: required, мінімальна довжина, перевірка URL, вибір типу.
- На бекенді є валідація DTO і централізована обробка помилок.
- Є окремий API-шар `frontend/src/apiClient.ts`, через який ідуть усі запити.
- `apiClient` в одному місці обробляє `response.ok`, `204 No Content`, JSON і помилки.
- Помилки валідації з бекенду показуються користувачу.
- CORS whitelist дозволяє методи `GET, POST, PUT, PATCH, DELETE, OPTIONS` і заголовки `Content-Type, Authorization`.

### Трохи на відмінно

- API має версію `/api/v1/...` і використовується однаково на фронтенді та бекенді.
- Фронтенд написаний на TypeScript.
- DTO типізовані у `frontend/src/dtos.ts` і використовуються в `apiClient`.
- У `apiClient` реалізовано таймаут запиту через `AbortController` на 10 секунд.
- Обробляються погані сценарії:
  - бекенд вимкнений;
  - бекенд повертає 400 з помилками валідації;
  - бекенд повертає 404/500.
- Додатково є фільтрація, пошук і сортування через API.

## Як запустити

### 1. Бекенд

```bash
cd backend
npm install
npm run dev:be
```

Бекенд запускається на:

```text
http://localhost:3000
```

Перевірка:

```text
http://localhost:3000/health
```

### 2. Фронтенд

В окремому терміналі:

```bash
cd frontend
npm install
npm run build
npm run dev:fe
```

Потім відкрити:

```text
http://localhost:5500
```

Також можна відкрити папку `frontend` через VS Code Live Server.

## Основні ендпоінти

```text
GET    /api/v1/resources
GET    /api/v1/resources/:id
POST   /api/v1/resources
PUT    /api/v1/resources/:id
PATCH  /api/v1/resources/:id
DELETE /api/v1/resources/:id
```

Список підтримує параметри:

```text
GET /api/v1/resources?search=node&type=Article&sortBy=title&sortDir=asc&page=1&pageSize=10
```

## Приклади перевірки через PowerShell

### GET список — має бути 200

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/v1/resources"
```

### GET деталі — має бути 200

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/v1/resources/1"
```

### POST створення — має бути 201

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/v1/resources" -ContentType "application/json" -Body '{
  "title": "Node.js Docs LR4",
  "url": "https://nodejs.org/lr4-test",
  "type": "Article",
  "description": "Official Node.js documentation",
  "author": "Node.js"
}'
```

### PUT редагування — має бути 200

```powershell
Invoke-RestMethod -Method PUT -Uri "http://localhost:3000/api/v1/resources/1" -ContentType "application/json" -Body '{
  "title": "Updated Resource",
  "url": "https://example.com/updated-resource",
  "type": "Tool",
  "description": "Updated description",
  "author": "Example"
}'
```

### DELETE — має бути 204

```powershell
Invoke-WebRequest -Method DELETE -Uri "http://localhost:3000/api/v1/resources/1"
```

### Помилка валідації — має бути 400

```powershell
Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/v1/resources" -ContentType "application/json" -Body '{"title":"no"}'
```

### Неіснуючий id — має бути 404

```powershell
Invoke-WebRequest -Method GET -Uri "http://localhost:3000/api/v1/resources/9999"
```

## DTO-контракти

### ResourceDto — відповідь бекенду

```ts
interface ResourceDto {
  id: string;
  title: string;
  url: string;
  type: "Video" | "Article" | "Course" | "Book" | "Tool";
  description: string;
  author: string;
  createdAt?: string;
}
```
