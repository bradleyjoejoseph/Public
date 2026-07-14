# 12 — Coding Standards

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09

---

## Table of Contents

1. [Guiding Principles](#1-guiding-principles)
2. [TypeScript Standards](#2-typescript-standards)
3. [Naming Conventions](#3-naming-conventions)
4. [React & Component Standards](#4-react--component-standards)
5. [File Organisation](#5-file-organisation)
6. [API Route Standards](#6-api-route-standards)
7. [Error Handling Standards](#7-error-handling-standards)
8. [Import Ordering](#8-import-ordering)
9. [Comments & Documentation](#9-comments--documentation)
10. [Git & Commit Conventions](#10-git--commit-conventions)
11. [Code Review Standards](#11-code-review-standards)
12. [ESLint & Prettier Configuration](#12-eslint--prettier-configuration)

---

## 1. Guiding Principles

### SOLID

**Single Responsibility:** Every module, class, and function has one reason to change. If you find yourself writing "and" when describing what a function does, split it.

**Open/Closed:** Services and repositories are open for extension (implement the interface) but closed for modification (callers don't change when you add a new provider).

**Liskov Substitution:** All import providers implement the `ImportProvider` interface and are interchangeable from the pipeline's perspective.

**Interface Segregation:** Keep interfaces small. A `ReadonlySnapshotRepository` for read operations and a `WritableSnapshotRepository` for writes is better than one giant interface that not all callers need.

**Dependency Inversion:** High-level modules (services) depend on abstractions (interfaces), not concrete implementations. Concrete implementations (Prisma repositories, Supabase storage) are injected.

### Clean Code

- **Meaningful names.** Code is read 10x more than it's written. Name things for the reader.
- **Small functions.** A function that does one thing fits on one screen. If it doesn't, refactor.
- **No magic numbers.** `const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024` is better than `52428800`.
- **Avoid negations.** `isValid` is clearer than `isNotInvalid`.
- **Explain the why, not the what.** Comments explain intent. Code explains the how.

### DRY (Don't Repeat Yourself)

Extract shared logic into utilities, hooks, or services. But don't extract prematurely — two usages of the same pattern is a coincidence; three is a pattern worth extracting.

### YAGNI (You Aren't Gonna Need It)

Don't build for hypothetical futures. Build for now. The import provider abstraction is needed today (it enables the MVP). A full plugin registry with hot-reloading is not.

---

## 2. TypeScript Standards

### Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Rules

**No `any`.** Ever. If you don't know the type, use `unknown` and narrow it. If a third-party library forces `any`, cast at the boundary and define a typed wrapper.

**No non-null assertion (`!`) without a comment.** If you must assert non-null, add a comment explaining why the value is guaranteed to exist at this point.

```typescript
// Wrong
const user = getUser()!

// Right
const user = getUser()
// getUser() returns null only if the session has expired. Middleware ensures
// this code is only reached with a valid session, so null is impossible here.
if (!user) throw new UnauthorisedError()
```

**Prefer `interface` over `type` for object shapes.** Use `type` for unions, intersections, and mapped types.

```typescript
// Prefer
interface UserProfile {
  id: string
  email: string
  displayName: string
}

// Reserve `type` for these cases
type EntryType = 'FOLLOWER' | 'FOLLOWING'
type PaginatedResult<T> = { data: T[]; pagination: Pagination }
```

**Explicit return types on public functions.** Private helpers may omit them if the type is obvious.

```typescript
// Service methods always have explicit return types
async function processUpload(userId: string, file: File): Promise<Result<ImportSummary>> {
  // ...
}

// Private helpers may infer
function buildUsernameMap(entries: SnapshotEntry[]) {
  return new Map(entries.map(e => [e.instagramUsername, e]))
}
```

**Avoid type assertions (`as`).** Prefer type guards.

```typescript
// Wrong
const data = parseJson(input) as { followers: unknown[] }

// Right
const parsed = parseFollowerSchema.parse(parseJson(input))
// Now `parsed` is typed by Zod
```

**`readonly` for function parameters that shouldn't be mutated.**

```typescript
function computeDiff(from: readonly SnapshotEntry[], to: readonly SnapshotEntry[]): DiffResult {
  // ...
}
```

---

## 3. Naming Conventions

### Variables and Functions

| Style | Use For | Examples |
|-------|---------|---------|
| `camelCase` | Variables, functions, methods | `userId`, `processUpload`, `isValid` |
| `PascalCase` | Classes, interfaces, types, enums | `ImportService`, `SnapshotEntry`, `EntryType` |
| `SCREAMING_SNAKE_CASE` | Constants (module-level, never change) | `MAX_UPLOAD_SIZE_BYTES`, `DEFAULT_PAGE_SIZE` |
| `kebab-case` | File names, directory names | `snapshot-diff.ts`, `import-service.ts` |

### Specific Naming Patterns

**Booleans:** prefix with `is`, `has`, `can`, `should`, `was`
```typescript
isLoading, hasError, canDelete, shouldRefetch, wasSuccessful
```

**Event handlers:** prefix with `handle` (not `on` — that's for props)
```typescript
function handleFormSubmit() { ... }
// Props accept:
interface Props { onSubmit: () => void }
// Usage:
<Form onSubmit={handleFormSubmit} />
```

**Async functions:** do NOT add `Async` suffix unless disambiguation is needed
```typescript
// Wrong
async function fetchSnapshotsAsync() { ... }

// Right
async function fetchSnapshots() { ... }
```

**Repositories:** methods follow CRUD conventions
```typescript
findById, findAll, findAllByUserId, create, update, delete, deleteAll
```

**Services:** methods describe business actions
```typescript
processUpload, getWithComputedStats, deleteAccount, computeDiff
```

### Files and Directories

```
# Feature files
snapshot.service.ts        ← service
snapshot.repository.ts     ← repository
snapshot.schema.ts         ← Zod schemas
snapshot.types.ts          ← TypeScript types (if separate from domain.ts)
snapshot.test.ts           ← Tests co-located with source

# React components
SnapshotCard.tsx           ← PascalCase for components
SnapshotCard.test.tsx      ← Test file
index.ts                   ← Re-export barrel (only for large component folders)
```

---

## 4. React & Component Standards

### Component Rules

**Functional components only.** No class components.

**One component per file.** Small sub-components may be defined in the same file if they are only used by the parent, but they must be exported separately if used elsewhere.

**Props interfaces above the component:**
```typescript
interface SnapshotCardProps {
  snapshot: Snapshot
  onDelete: (id: string) => void
  className?: string
}

export function SnapshotCard({ snapshot, onDelete, className }: SnapshotCardProps) {
  // ...
}
```

**Default export vs named export:** Named exports for components (improves refactoring and import clarity). Exception: `page.tsx` and `layout.tsx` files require default exports (Next.js convention).

**Prop drilling limit:** If you're passing a prop through 3+ levels without using it in intermediate components, consider context or lifting state to a closer ancestor. Don't reach for Zustand immediately.

**Component complexity limit:** If a component file exceeds 200 lines of JSX, extract sub-components.

### Hook Rules

- Custom hooks are prefixed with `use`
- Custom hooks live in `src/hooks/`
- A hook should do one thing
- Hooks must not contain business logic — they are wiring (connecting TanStack Query to UI state)

```typescript
// src/hooks/use-snapshots.ts
export function useSnapshots() {
  return useQuery({
    queryKey: queryKeys.snapshots.byUser,
    queryFn: () => fetchSnapshots(),
  })
}

// NOT in the hook — keep in the service/API layer
function validateSnapshotOwnership() { ... }
```

### Server vs Client Components

Add `'use client'` only when necessary. Ask: "Does this component need interactivity or browser APIs?" If no, keep it a Server Component.

```typescript
// Wrong — unnecessarily a client component
'use client'
export function StatCard({ label, value }: StatCardProps) {
  return <div>{label}: {value}</div>  // No interactivity needed
}

// Right — Server Component (default)
export function StatCard({ label, value }: StatCardProps) {
  return <div>{label}: {value}</div>
}
```

### Tailwind CSS Rules

- Use Tailwind utility classes; no custom CSS files except `globals.css`
- Use the `cn()` utility for conditional class merging (`clsx` + `tailwind-merge`)
- Do not use `@apply` in CSS — it defeats Tailwind's purpose
- Use design tokens (CSS variables) via shadcn/ui convention, not arbitrary values

```typescript
// cn utility
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn('base-class', isActive && 'active-class', className)} />
```

---

## 5. File Organisation

### The Barrel File Rule

Use `index.ts` barrel files sparingly. They create circular dependency risks and slow down bundlers.

**Allowed:** `src/components/ui/index.ts` (re-exports from shadcn/ui for convenience)

**Not allowed:** `src/services/index.ts` (imports should be direct: `import { SnapshotService } from '@/services/snapshot.service'`)

### Relative vs Absolute Imports

Always use absolute imports via the `@` alias (maps to `src/`):

```typescript
// Wrong
import { SnapshotService } from '../../../services/snapshot.service'

// Right
import { SnapshotService } from '@/services/snapshot.service'
```

---

## 6. API Route Standards

### File Structure

Every route file exports only HTTP method handler functions (named `GET`, `POST`, `PUT`, `PATCH`, `DELETE`). No other logic.

```typescript
// app/api/v1/imports/route.ts

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) throw new ValidationError('No file provided')

  const result = await importService.processUpload(user.id, file)
  if (!result.success) throw result.error

  return NextResponse.json({ import: result.data }, { status: 201 })
})

export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)
  const params = paginationSchema.parse(Object.fromEntries(new URL(req.url).searchParams))

  const imports = await importService.listByUser(user.id, params)
  return NextResponse.json(imports)
})
```

### Response Standards

- `200 OK` — successful GET, PATCH
- `201 Created` — successful POST that creates a resource
- `204 No Content` — successful DELETE
- Always return a response body (even for 204, some clients expect it — return `{}`)
- Never return `null` or `undefined` as a response body

---

## 7. Error Handling Standards

### In Services

Return `Result<T>` instead of throwing. Services should never let unexpected exceptions propagate uncaught.

```typescript
// Wrong — throws across service boundary
async function processUpload(userId: string, file: File) {
  const data = await parse(file)  // Can throw
  return await save(data)         // Can throw
}

// Right — explicit error handling
async function processUpload(userId: string, file: File): Promise<Result<ImportSummary>> {
  try {
    const data = await parse(file)
    const saved = await save(data)
    return ok(saved)
  } catch (error) {
    if (error instanceof ImportParseError) return err(error)
    logger.error('Unexpected error in processUpload', { error, userId })
    return err(new AppError('INTERNAL_ERROR', 'Failed to process import'))
  }
}
```

### In Route Handlers

Route handlers use `withErrorHandler` — they throw errors and let the wrapper catch and format them:

```typescript
// Wrong — manual error formatting in every handler
export const GET = async (req: NextRequest) => {
  try {
    // ...
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// Right — let the wrapper handle it
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)  // Throws 401 if no session
  const data = await snapshotService.getLatest(user.id)
  if (!data) throw new NotFoundError('Snapshot')  // Throws 404
  return NextResponse.json(data)
})
```

---

## 8. Import Ordering

ESLint enforces this automatically. The order is:

1. External packages (`react`, `next`, third-party)
2. Internal absolute imports (`@/lib/...`, `@/services/...`, `@/components/...`)
3. Relative imports (`./something`, `../something`)
4. Type imports (`import type ...`)

```typescript
// 1. External
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal absolute
import { SnapshotService } from '@/services/snapshot.service'
import { Card } from '@/components/ui/card'

// 3. Relative
import { SnapshotCard } from './SnapshotCard'

// 4. Types
import type { Snapshot } from '@/types/domain'
```

---

## 9. Comments & Documentation

### When to Comment

**Comment the why, not the what.** The code shows the what. Comments explain intent, constraints, and non-obvious decisions.

```typescript
// Wrong — explains the what (the code already shows this)
// Increment the counter by 1
count++

// Right — explains the why
// We deduplicate by lowercase username because Instagram usernames are
// case-insensitive but the export data inconsistently mixes case
const key = entry.instagramUsername.toLowerCase()
```

### JSDoc for Public APIs

Add JSDoc to all exported service methods and utility functions:

```typescript
/**
 * Computes the difference between two snapshots, identifying accounts
 * gained, lost, followed, and unfollowed between the two points in time.
 *
 * The comparison is case-insensitive on Instagram usernames.
 *
 * @param from - The older snapshot (baseline)
 * @param to - The newer snapshot (current state)
 * @returns A structured diff with counts and entry lists for each change type
 */
export function computeSnapshotDiff(
  from: SnapshotWithEntries,
  to: SnapshotWithEntries,
): DiffResult {
  // ...
}
```

### TODO / FIXME

Use structured TODO comments with context:

```typescript
// TODO(v2.0): Replace this with a background job via Inngest
// when import processing exceeds the 60s Vercel timeout for large accounts
const result = await importService.processUpload(userId, file)
```

---

## 10. Git & Commit Conventions

### Branch Naming

```
feature/description-of-feature
fix/description-of-bug
chore/description-of-task
refactor/description-of-refactor
docs/description-of-docs-change
```

Examples:
```
feature/instagram-export-parser
fix/zip-bomb-detection
chore/upgrade-prisma-5
docs/update-api-spec
```

### Commit Message Format

Conventional Commits (https://www.conventionalcommits.org):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance (dependencies, config)
- `refactor` — code change with no feature/fix
- `test` — add or fix tests
- `docs` — documentation only
- `perf` — performance improvement
- `ci` — CI/CD changes
- `security` — security improvement

**Scopes:** `auth`, `import`, `snapshot`, `diff`, `api`, `ui`, `db`, `storage`

**Examples:**
```
feat(import): add paginated followers_n.json support

Instagram exports for large accounts use followers_1.json, followers_2.json,
etc. This commit adds automatic pagination detection and merging.

fix(auth): prevent email enumeration on password reset

The password reset endpoint previously returned different messages for
known vs unknown email addresses. Now always returns the same message.

chore(deps): upgrade to Prisma 5.18

perf(snapshot): batch insert entries in chunks of 1000

Previously inserting 10,000 entries as individual rows was taking ~30s.
Batching reduces this to ~3s.
```

### Commit Rules

- Commits are atomic — one logical change per commit
- The code compiles and tests pass after every commit
- Never commit directly to `main` or `develop` — always via PR
- Squash merge PRs into `develop` (clean history)
- Merge commit from `develop` into `main` (preserves the squash point)

---

## 11. Code Review Standards

### What Reviewers Check

**Correctness:**
- Does it solve the problem described in the PR?
- Are edge cases handled (empty lists, null values, concurrent requests)?
- Are error paths tested?

**Security:**
- Is `userId` included in all database queries?
- Is user input validated before use?
- Are secrets managed correctly?

**Architecture:**
- Does the code follow the layer rules (no Prisma in service layer, etc.)?
- Is business logic in the service layer?
- Is the import provider abstraction preserved?

**Code Quality:**
- Are functions small and single-purpose?
- Are names meaningful?
- Is the code readable without comments?

### PR Requirements

Before requesting review:
- [ ] Self-review complete (read your own diff)
- [ ] Tests added for new functionality
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)
- [ ] PR description explains *what* changed and *why*
- [ ] Breaking changes documented in PR description

### Review Response Time

- PRs should be reviewed within 24 business hours
- Reviewer must either approve, request changes, or comment within that window

---

## 12. ESLint & Prettier Configuration

### ESLint (`.eslintrc.json`)

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    "@typescript-eslint/no-floating-promises": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  },
  "parserOptions": {
    "project": true
  }
}
```

### Prettier (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```

### Pre-commit Hook (`package.json`)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yaml,yml}": ["prettier --write"]
  }
}
```

Use `husky` to run `lint-staged` on pre-commit. This prevents committing code with lint errors.
