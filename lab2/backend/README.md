# Лабораторна робота №2 — Варіант 5

Тема сервісу: Каталог навчальних ресурсів з рейтингом.

## Сутності

- Users
- Resources
- Ratings
- Comments

## Запуск

```bash
npm i
npm run dev
```

Перевірка якості коду:

```bash
npm run build
npm run lint
npm run format
```

Сервер запускається на:

```text
http://localhost:3000
```

Перевірка:

```bash
curl http://localhost:3000/health
```

## Основні маршрути

### Users

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Resources

```text
GET    /api/resources
GET    /api/resources/:id
POST   /api/resources
PUT    /api/resources/:id
PATCH  /api/resources/:id
DELETE /api/resources/:id
```

### Ratings

```text
GET    /api/ratings
GET    /api/ratings/:id
POST   /api/ratings
PUT    /api/ratings/:id
PATCH  /api/ratings/:id
DELETE /api/ratings/:id
```

### Comments

```text
GET    /api/comments
GET    /api/comments/:id
POST   /api/comments
PUT    /api/comments/:id
PATCH  /api/comments/:id
DELETE /api/comments/:id
```

## Приклади curl

### Отримати список ресурсів

```bash
curl -i http://localhost:3000/api/resources
```

### Отримати список ресурсів із пошуком, сортуванням і пагінацією

```bash
curl -i "http://localhost:3000/api/resources?search=js&page=1&pageSize=5&sortBy=title&sortDir=asc"
```

### Створити ресурс

```bash
curl -i -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Node.js Course\",\"url\":\"https://nodejs.org\",\"type\":\"Course\",\"description\":\"Курс з Node.js\",\"author\":\"Node.js\"}"
```

### Помилка валідації

```bash
curl -i -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"A\"}"
```

### Видалити ресурс

```bash
curl -i -X DELETE http://localhost:3000/api/resources/1
```

## Формат помилки

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": []
  }
}
```

### Невалідний sortBy повертає 400

```bash
curl -i "http://localhost:3000/api/resources?sortBy=title;DROP%20TABLE&sortDir=desc"
```
