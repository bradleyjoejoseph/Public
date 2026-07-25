# CashFlow API

A personal finance REST API built with TypeScript, Express, and SQLite.

> 📋 **[View the original project brief](./BRIEF.md)** — the full specification this API was built against, including data models, endpoint specs, business rules, and 40 test cases.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your JWT secret
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production build |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Get access token

### Categories (Protected)
- `GET /api/categories` — List your categories
- `POST /api/categories` — Create category
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category

### Transactions (Protected)
- `GET /api/transactions` — List transactions (filterable, paginated)
- `GET /api/transactions/:id` — Get single transaction
- `POST /api/transactions` — Create transaction
- `PUT /api/transactions/:id` — Update transaction
- `DELETE /api/transactions/:id` — Delete transaction

### Analytics (Protected)
- `GET /api/analytics/summary` — Income/expense totals for date range
- `GET /api/analytics/by-category` — Breakdown by category

## Tech Stack

TypeScript · Node.js · Express · SQLite · JWT · Zod · Vitest
