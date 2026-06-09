# Лабораторна робота №5 — Уразливості і захист

Проєкт: каталог навчальних ресурсів на Express, SQLite, TypeScript і простому frontend.

## Запуск

Backend:

```bash
cd backend
npm install
npm run seed
npm run dev:be
```

Frontend:

```bash
cd frontend
npm install
npm run build
npm run dev:fe
```

Відкрити: `http://localhost:5500`.

## Основні маршрути

```text
GET    /health
GET    /api/v1/resources
GET    /api/v1/resources/:id
POST   /api/v1/resources
PUT    /api/v1/resources/:id
PATCH  /api/v1/resources/:id
DELETE /api/v1/resources/:id
```

Для захищених маршрутів потрібен заголовок:

```text
X-Demo-UserId: 1
```