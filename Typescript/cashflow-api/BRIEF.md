# CashFlow API — Project Brief

> **A standalone RESTful personal finance API built with TypeScript, Node.js, and Express.**
>
> This document is the original specification I was given. The entire API was implemented from this brief — no tutorials, no boilerplate generators. Every controller, middleware, route, test, and database schema was written by hand against this spec.

---

## 1. Project Overview

Build a **Personal Finance Tracker API** called **CashFlow**. It allows users to register, log income and expenses, categorise transactions, and retrieve spending analytics.

Skills demonstrated:
- TypeScript (types, interfaces, enums, generics, strict mode)
- Express.js with TypeScript (middleware, routing, error handling)
- JWT authentication
- Relational database design (SQLite)
- Input validation (Zod)
- Automated testing (Vitest)
- Clean project architecture

---

## 2. Technical Requirements

| Requirement | Detail |
|---|---|
| **Language** | TypeScript (strict mode enabled) |
| **Runtime** | Node.js (v20+) |
| **Framework** | Express.js |
| **Database** | SQLite via `better-sqlite3` |
| **Auth** | JWT (access tokens, 1hr expiry) |
| **Validation** | Zod |
| **Testing** | Vitest |
| **Package Manager** | npm |

### Project Structure

```
cashflow-api/
├── src/
│   ├── index.ts              # Entry point — starts server
│   ├── app.ts                # Express app setup (middleware, routes)
│   ├── config/
│   │   └── database.ts       # SQLite connection + table initialisation
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── transaction.routes.ts
│   │   └── analytics.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── transaction.controller.ts
│   │   └── analytics.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT verification
│   │   ├── validate.middleware.ts # Zod schema validation
│   │   └── error.middleware.ts    # Global error handler
│   ├── models/
│   │   └── schemas.ts          # Zod schemas for all entities
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & types
│   └── utils/
│       ├── hash.ts             # Password hashing (bcrypt)
│       └── jwt.ts              # Token generation & verification
├── tests/
│   ├── auth.test.ts
│   ├── categories.test.ts
│   ├── transactions.test.ts
│   └── analytics.test.ts
├── .env.example
├── tsconfig.json
├── package.json
├── vitest.config.ts
└── README.md
```

---

## 3. Data Models

### User

| Field | Type | Constraints |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `email` | TEXT | Unique, not null |
| `password_hash` | TEXT | Not null |
| `name` | TEXT | Not null |
| `created_at` | TEXT | ISO 8601 timestamp, default now |

### Category

| Field | Type | Constraints |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `user_id` | INTEGER | FK → User(id), not null |
| `name` | TEXT | Not null |
| `type` | TEXT | `"income"` or `"expense"`, not null |
| `colour` | TEXT | Hex colour code (e.g. `#FF5733`), optional |

**Business rule**: A user cannot have two categories with the same `name` and `type`.

### Transaction

| Field | Type | Constraints |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `user_id` | INTEGER | FK → User(id), not null |
| `category_id` | INTEGER | FK → Category(id), not null |
| `amount` | REAL | Positive number, not null |
| `type` | TEXT | `"income"` or `"expense"`, not null |
| `description` | TEXT | Optional |
| `date` | TEXT | ISO 8601 date (YYYY-MM-DD), not null |
| `created_at` | TEXT | ISO 8601 timestamp, default now |

**Business rule**: `transaction.type` must match its `category.type`. You cannot log an income transaction under an expense category.

---

## 4. API Specification

All endpoints return JSON. All protected endpoints require `Authorization: Bearer <token>` header.

### 4.1 Authentication

#### `POST /api/auth/register`
- **Body**: `{ email, password, name }`
- **Validation**: email must be valid format, password ≥ 8 chars, name ≥ 1 char
- **Response 201**: `{ id, email, name, token }`
- **Error 409**: Email already registered

#### `POST /api/auth/login`
- **Body**: `{ email, password }`
- **Response 200**: `{ id, email, name, token }`
- **Error 401**: Invalid credentials

---

### 4.2 Categories (Protected)

#### `GET /api/categories`
- Returns all categories belonging to the authenticated user
- **Response 200**: `{ categories: Category[] }`

#### `POST /api/categories`
- **Body**: `{ name, type, colour? }`
- **Validation**: `type` must be `"income"` or `"expense"`
- **Response 201**: `{ category: Category }`
- **Error 409**: Duplicate category name+type for this user

#### `PUT /api/categories/:id`
- **Body**: `{ name?, type?, colour? }` (partial update)
- **Response 200**: `{ category: Category }`
- **Error 404**: Category not found or doesn't belong to user
- **Error 409**: Update would create a duplicate

#### `DELETE /api/categories/:id`
- **Response 204**: No content
- **Error 404**: Category not found or doesn't belong to user
- **Error 409**: Category has transactions — cannot delete

---

### 4.3 Transactions (Protected)

#### `GET /api/transactions`
- Query params (all optional):
  - `type`: `"income"` | `"expense"`
  - `category_id`: integer
  - `from`: ISO date (inclusive)
  - `to`: ISO date (inclusive)
  - `sort`: `"date_asc"` | `"date_desc"` (default: `"date_desc"`)
  - `page`: integer (default: 1)
  - `limit`: integer (default: 20, max: 100)
- **Response 200**: `{ transactions: Transaction[], total: number, page: number, totalPages: number }`

#### `GET /api/transactions/:id`
- **Response 200**: `{ transaction: Transaction }` (include category name in response)
- **Error 404**: Not found or doesn't belong to user

#### `POST /api/transactions`
- **Body**: `{ category_id, amount, type, description?, date }`
- **Validation**: amount > 0, date is valid ISO date, type matches category type
- **Response 201**: `{ transaction: Transaction }`
- **Error 400**: Type mismatch with category
- **Error 404**: Category not found

#### `PUT /api/transactions/:id`
- **Body**: partial update of any transaction field
- Same validation rules as POST
- **Response 200**: `{ transaction: Transaction }`
- **Error 404**: Not found or doesn't belong to user

#### `DELETE /api/transactions/:id`
- **Response 204**: No content
- **Error 404**: Not found or doesn't belong to user

---

### 4.4 Analytics (Protected)

#### `GET /api/analytics/summary`
- Query params:
  - `from`: ISO date (required)
  - `to`: ISO date (required)
- **Response 200**:
```json
{
  "period": { "from": "2026-07-01", "to": "2026-07-31" },
  "totalIncome": 3500.00,
  "totalExpenses": 2100.50,
  "net": 1399.50,
  "transactionCount": 42
}
```

#### `GET /api/analytics/by-category`
- Query params:
  - `from`: ISO date (required)
  - `to`: ISO date (required)
  - `type`: `"income"` | `"expense"` (optional — filter to one type)
- **Response 200**:
```json
{
  "period": { "from": "2026-07-01", "to": "2026-07-31" },
  "breakdown": [
    { "categoryId": 1, "categoryName": "Salary", "type": "income", "total": 3500.00, "count": 1 },
    { "categoryId": 3, "categoryName": "Food", "type": "expense", "total": 450.00, "count": 15 },
    { "categoryId": 4, "categoryName": "Transport", "type": "expense", "total": 120.50, "count": 8 }
  ]
}
```

---

## 5. Business Rules

These must ALL be enforced. Not optional.

1. **User isolation**: A user can NEVER read, modify, or delete another user's data. Every protected query must filter by `user_id`.
2. **Type consistency**: A transaction's `type` must always match its category's `type`.
3. **Referential integrity**: Cannot delete a category that has transactions.
4. **Unique categories per user**: No two categories with the same `name` and `type` for a single user.
5. **Positive amounts only**: Transaction amounts must be > 0.
6. **Password security**: Passwords must be hashed with bcrypt (min 10 salt rounds). Never stored or returned in plain text.
7. **Token expiry**: JWT tokens expire after 1 hour.
8. **Pagination defaults**: Default page size is 20, max is 100.
9. **Error responses**: All errors must return `{ error: string }` with appropriate HTTP status codes.

---

## 6. TypeScript Requirements

Proper TypeScript usage is mandatory:

- `tsconfig.json` with `"strict": true`
- All function parameters and return types explicitly typed (no implicit `any`)
- Interfaces for all API request/response shapes
- Enum or union type for transaction/category types (`"income" | "expense"`)
- Typed Express request handlers (use generics: `Request<Params, ResBody, ReqBody, Query>`)
- Zod schemas that infer TypeScript types (`z.infer<typeof schema>`)
- Custom error class(es) with proper typing
- Typed database query results
- No `@ts-ignore` or `as any` anywhere

---

## 7. Test Cases

40 test cases across 4 test suites. All must pass. Vitest with `supertest` for HTTP testing.

### 7.1 Auth Tests (`auth.test.ts`)

| # | Test Case | Expected |
|---|---|---|
| A1 | Register with valid data | 201, returns `id`, `email`, `name`, `token` |
| A2 | Register with duplicate email | 409, returns error message |
| A3 | Register with password < 8 chars | 400, validation error |
| A4 | Register with invalid email format | 400, validation error |
| A5 | Register with missing `name` field | 400, validation error |
| A6 | Login with correct credentials | 200, returns token |
| A7 | Login with wrong password | 401, invalid credentials |
| A8 | Login with non-existent email | 401, invalid credentials |
| A9 | Access protected route without token | 401, unauthorized |
| A10 | Access protected route with expired/malformed token | 401, unauthorized |

### 7.2 Category Tests (`categories.test.ts`)

| # | Test Case | Expected |
|---|---|---|
| C1 | Create a valid expense category | 201, returns category with all fields |
| C2 | Create a valid income category | 201, returns category |
| C3 | Create category with invalid type (not income/expense) | 400, validation error |
| C4 | Create duplicate category (same name + type) | 409, duplicate error |
| C5 | Same name different type is allowed | 201, creates successfully |
| C6 | List categories returns only user's own | 200, returns array of own categories |
| C7 | User A cannot see User B's categories | 200, empty or only own categories |
| C8 | Update category name | 200, returns updated category |
| C9 | Update would create duplicate | 409, error |
| C10 | Delete category with no transactions | 204 |
| C11 | Delete category that has transactions | 409, cannot delete |
| C12 | Delete category belonging to another user | 404 |

### 7.3 Transaction Tests (`transactions.test.ts`)

| # | Test Case | Expected |
|---|---|---|
| T1 | Create valid expense transaction | 201, returns transaction |
| T2 | Create valid income transaction | 201, returns transaction |
| T3 | Create transaction with amount ≤ 0 | 400, validation error |
| T4 | Create transaction with type mismatch (income txn under expense category) | 400, type mismatch error |
| T5 | Create transaction with non-existent category | 404, category not found |
| T6 | Create transaction with another user's category | 404, category not found |
| T7 | List transactions with no filters | 200, returns paginated results |
| T8 | Filter transactions by type | 200, only returns matching type |
| T9 | Filter transactions by date range | 200, only returns transactions within range |
| T10 | Filter transactions by category_id | 200, only returns matching category |
| T11 | Pagination: page 1 limit 2 of 5 transactions | 200, returns 2 items, `total: 5`, `totalPages: 3` |
| T12 | Pagination: page 3 limit 2 of 5 transactions | 200, returns 1 item |
| T13 | Sort by date ascending | 200, oldest first |
| T14 | Sort by date descending (default) | 200, newest first |
| T15 | Get single transaction by ID | 200, includes category name |
| T16 | Get transaction belonging to another user | 404 |
| T17 | Update transaction amount | 200, returns updated transaction |
| T18 | Update transaction type to mismatch category | 400, type mismatch |
| T19 | Delete own transaction | 204 |
| T20 | Delete another user's transaction | 404 |

### 7.4 Analytics Tests (`analytics.test.ts`)

| # | Test Case | Expected |
|---|---|---|
| AN1 | Summary with income and expenses in range | 200, correct `totalIncome`, `totalExpenses`, `net` |
| AN2 | Summary with no transactions in range | 200, all zeros, `transactionCount: 0` |
| AN3 | Summary only counts authenticated user's data | 200, excludes other users |
| AN4 | Summary missing `from` or `to` param | 400, validation error |
| AN5 | By-category breakdown with mixed types | 200, returns all categories with totals |
| AN6 | By-category filtered to `type=expense` | 200, only expense categories in breakdown |
| AN7 | By-category with no data in range | 200, empty breakdown array |
| AN8 | By-category only includes authenticated user's data | 200, excludes other users |

---

## 8. Marking Criteria

| Criteria | Weight | What "full marks" looks like |
|---|---|---|
| **All test cases pass** | 30% | All 40 test cases green |
| **TypeScript strictness** | 20% | Strict mode, no `any`, proper interfaces, typed handlers |
| **API correctness** | 20% | All endpoints match spec, correct status codes, correct response shapes |
| **Code architecture** | 15% | Clean separation of concerns, no business logic in routes, proper middleware chain |
| **Error handling** | 10% | Custom error classes, global handler, consistent error response format |
| **README quality** | 5% | Setup instructions, API docs, example requests |
