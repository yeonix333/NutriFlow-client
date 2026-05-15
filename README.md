# NutriFlow Client

React-фронтенд для [NutriFlow-server](../NutriFlow-server) — трекер харчування з аналітикою та AI.

## Що потрібно

| Компонент | Версія |
|-----------|--------|
| Node.js | **22+** (як на сервері) |
| npm | 10+ |
| MongoDB | Atlas або локально (для сервера) |
| NutriFlow-server | локально **:5000** або [Render](https://nutriflow-server.onrender.com) |

**Бекенд на Render:** https://nutriflow-server.onrender.com  
Swagger: https://nutriflow-server.onrender.com/api-docs

---

## Швидкий старт (бекенд на Render)

Якщо сервер уже задеплоєний на Render — локально запускати бекенд не потрібно.

```powershell
cd "c:\Users\Game-On_DP\Desktop\My visual novel\At school novel\NutriFlow-client"
npm install
copy .env.example .env
npm run dev
```

У `.env` має бути:

```env
VITE_API_URL=https://nutriflow-server.onrender.com/api
```

Відкрийте http://localhost:5173 — клієнт звертається до API на Render.

> **Холодний старт Render:** перший запит після простою може йти 30–60 с — зачекайте і оновіть сторінку.

---

## Покрокове підключення (локальний сервер)

### Крок 1. Налаштуйте сервер

```powershell
cd "c:\Users\Game-On_DP\Desktop\My visual novel\At school novel\NutriFlow-server"
```

1. Скопіюйте `.env.example` → `.env` і заповніть:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=ваш_секретний_ключ
JWT_EXPIRE=7d
NODE_ENV=development
GROQ_API_KEY=ваш_ключ_groq
```

2. Встановіть залежності та запустіть:

```powershell
npm install
npm run dev
```

Перевірка: відкрийте http://localhost:5000 — має бути JSON з повідомленням API.  
Документація Swagger: http://localhost:5000/api-docs

### Крок 2. Встановіть клієнт

```powershell
cd "c:\Users\Game-On_DP\Desktop\My visual novel\At school novel\NutriFlow-client"
npm install
```

### Крок 3. Налаштуйте `.env` клієнта

```powershell
copy .env.example .env
```

У файлі `.env` для **локального** бекенду:

```env
VITE_API_URL=http://localhost:5000/api
```

Для **Render** використовуйте:

```env
VITE_API_URL=https://nutriflow-server.onrender.com/api
```

> **Без `.env` у dev:** proxy у `vite.config.js` перенаправляє `/api` на `localhost:5000` (тільки якщо локальний сервер запущений).

### Крок 4. Запустіть фронтенд

```powershell
npm run dev
```

Відкрийте: **http://localhost:5173**

### Крок 5. Перший вхід

1. Натисніть **«Зареєструватися»**
2. Заповніть ім'я, email, пароль (мін. 6 символів, велика/мала літера та цифра)
3. За бажанням — вік, вагу, зріст (для розрахунку денних норм)
4. Після реєстрації ви потрапите на головну сторінку

### Крок 6. Типовий сценарій використання

1. **Продукти** — додайте продукти вручну або через **AI створити**
2. **Прийоми їжі** — створіть прийом, оберіть продукти та грами
3. **Головна** — перегляньте калорії та рекомендації за день
4. **Аналітика** — тижневі підсумки, графік, вода/вага
5. **AI** — аналіз раціону (потрібен `GROQ_API_KEY` на сервері)
6. **Профіль** — оновіть дані та перегляньте денні норми

---

## Структура проєкту

```
src/
├── api/client.js       # HTTP-клієнт до API
├── context/AuthContext.jsx
├── components/         # Layout, MacroBar, Alert
├── pages/              # Login, Register, Dashboard, Products, Meals, Analytics, AI, Profile
├── utils/labels.js     # Українські підписи enum-ів
├── App.jsx
├── main.jsx
└── index.css
```

## Скрипти

| Команда | Опис |
|---------|------|
| `npm run dev` | Розробка (порт 5173) |
| `npm run build` | Збірка для продакшену |
| `npm run preview` | Перегляд збірки |

## API, з яким працює клієнт

| Розділ | Ендпоінти |
|--------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/profile` |
| Products | CRUD `/products` |
| Meals | CRUD `/meals` |
| Analytics | `/analytics/daily`, `/weekly`, `/chart`, `PUT /daily` |
| AI | `/ai/recognize-product`, `/create-product`, `/analyze-daily`, `/analyze-weekly`, `/suggestions` |

JWT зберігається в `localStorage` під ключем `token`.

## Усунення проблем

| Проблема | Рішення |
|----------|---------|
| `Failed to fetch` / CORS | Перевірте `VITE_API_URL` у `.env`; для Render — зачекайте холодний старт |
| `401 Unauthorized` | Увійдіть знову — токен міг прострочитись |
| AI не працює | Додайте `GROQ_API_KEY` у `.env` сервера |
| `429 Too Many Requests` | Зачекайте (ліміт AI: 20/год, login: 5/15 хв) |
| Порожній список продуктів при створенні їжі | Спочатку додайте продукти на сторінці **Продукти** |

## Два термінали (зручно)

**Термінал 1 — сервер:**
```powershell
cd NutriFlow-server
npm run dev
```

**Термінал 2 — клієнт:**
```powershell
cd NutriFlow-client
npm run dev
```
