# 15 — AI Engineering Instructions

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09  
> **Audience:** Google Antigravity (AI Software Engineer)  
> **Classification:** Critical — Read in full before writing any code

---

## Preface

You are the engineering team building FollowBack. This document is your operating manual. It exists to help you make good decisions independently, know when to pause and verify, and produce code that a senior engineer would be proud to maintain.

The documentation in this `/docs` folder is the single source of truth. When in doubt, refer to it. When you find a gap or inconsistency, flag it before proceeding.

---

## Table of Contents

1. [Project Philosophy](#1-project-philosophy)
2. [How to Start Each Milestone](#2-how-to-start-each-milestone)
3. [Architecture Rules](#3-architecture-rules)
4. [Coding Rules](#4-coding-rules)
5. [What to Build Exactly — and What Not to Build](#5-what-to-build-exactly--and-what-not-to-build)
6. [When to Stop and Ask](#6-when-to-stop-and-ask)
7. [How to Write Commits](#7-how-to-write-commits)
8. [How to Run Tests](#8-how-to-run-tests)
9. [How to Update Documentation](#9-how-to-update-documentation)
10. [Common Mistakes to Avoid](#10-common-mistakes-to-avoid)
11. [Quality Checklist](#11-quality-checklist)
12. [Milestone Completion Protocol](#12-milestone-completion-protocol)

---

## 1. Project Philosophy

### What this application is

FollowBack is a personal data analysis tool. Users upload a file they downloaded from Instagram. We parse it, store it, and show them useful breakdowns. That is the entire core product. Everything else is polish.

### The most important constraint

**We do not access Instagram on behalf of users.** No API calls to Instagram. No unofficial APIs. No credential storage. This is a firm line — it protects users, keeps us legal, and is non-negotiable.

### What "production quality" means here

- Code that another developer can read and understand in 10 minutes
- Errors that never expose internals to users
- Tests that would catch regressions
- Security that protects the user's private data
- Performance that doesn't make users wait

### What "portfolio quality" does NOT mean

- Overly complex architecture to impress reviewers
- Features that aren't in the PRD
- Premature optimisation
- Gold-plating edge cases that won't occur in the real world

---

## 2. How to Start Each Milestone

Before writing a single line of code for any milestone:

**Step 1: Read the relevant docs.**

For each milestone, identify which documents are relevant and read the relevant sections. A milestone that involves the import system must be preceded by reading `08_IMPORT_SYSTEM.md`. A milestone with a new API route must be preceded by reading `05_API.md`.

**Step 2: Read the previous milestone's code.**

Understand what already exists. Never duplicate code that already does what you need. If something is already built, use it.

**Step 3: Plan before implementing.**

Write a brief mental (or literal) plan of what files you'll create or modify. Confirm this matches the milestone's deliverables in `14_MILESTONES.md`.

**Step 4: Implement incrementally.**

Build the smallest working unit first. Get it working. Then expand. Do not build everything and then test at the end.

**Step 5: Test as you go.**

Write tests alongside code. Do not defer tests to "later." Tests written before the code is "cold" are written with the correct mental model.

---

## 3. Architecture Rules

These are hard rules. Do not violate them. If a requirement seems to force a violation, stop and ask.

### Rule A1 — Layer isolation

```
UI  →  API Routes  →  Services  →  Repositories  →  Infrastructure
```

- **UI components** do not import from `services/` or `repositories/`
- **API routes** do not import Prisma directly
- **Services** do not import from `app/` (no HTTP context in services)
- **Repositories** do not import from `services/`

If you find yourself importing across these layer boundaries, you have a design problem. Stop and restructure.

### Rule A2 — Import provider abstraction is sacred

Every piece of code that processes incoming data MUST go through the `ImportProvider` interface. Never write Instagram-specific parsing logic outside of `lib/import/providers/instagram-export/`.

The pipeline in `ImportService` knows only about `ImportProvider`. It doesn't know about ZIP files, JSON, Instagram, or any specific format. This is intentional and must remain this way.

### Rule A3 — userId in every data query

Every query that accesses user-owned data MUST include `where: { userId }` as a condition. No exceptions. An import, snapshot, or snapshot entry is meaningless without its owner.

```typescript
// EVERY time you query user data, the pattern is:
const snapshot = await db.snapshot.findFirst({
  where: { id: snapshotId, userId: authenticatedUserId }  // ← ALWAYS
})
if (!snapshot) throw new NotFoundError('Snapshot')
```

If you find yourself writing a query without `userId`, you are creating an IDOR vulnerability.

### Rule A4 — The Result type for service methods

Service methods that can fail return `Promise<Result<T>>`, not `Promise<T>`. They do not throw across service boundaries.

```typescript
// Correct
async function processUpload(userId: string, file: File): Promise<Result<ImportSummary>>

// Wrong — allows unexpected errors to propagate uncaught
async function processUpload(userId: string, file: File): Promise<ImportSummary>
```

API route handlers catch `Result` errors and convert them to HTTP responses using `withErrorHandler`.

### Rule A5 — TypeScript strict mode, no `any`

The TypeScript compiler is your first line of defence. Never silence it with `any`, `@ts-ignore`, or `// eslint-disable`. If you cannot type something, you do not understand it well enough to write it.

### Rule A6 — Server Components by default

In Next.js App Router, every component is a Server Component by default. Add `'use client'` only when you have a specific need (interactivity, browser APIs, hooks). Most components do not need it.

---

## 4. Coding Rules

These supplement `12_CODING_STANDARDS.md`. Read that document too.

### On naming

Name things for the next developer, who is you in six months. Ask: "If I had never seen this code, would this name tell me what this thing does?" If not, rename it.

Bad: `data`, `result`, `temp`, `arr`, `val`, `x`  
Good: `parsedFollowerData`, `uploadResult`, `deduplicatedEntries`, `snapshotWithStats`

### On function size

If a function doesn't fit on one screen, it's too long. Extract until each function has one clear job. This isn't a hard rule — a 60-line function that is clearly structured is fine. A 25-line function doing three unrelated things is not.

### On comments

Write a comment when the code cannot speak for itself — when you make a non-obvious choice, when you work around a bug in a dependency, when a constraint isn't evident from the code. Do not write comments that restate the code.

### On error messages

Error messages shown to users must be human-readable and actionable. "An unexpected error occurred" is acceptable for 500 errors. "File must be a ZIP archive" is required for validation errors. Never expose: stack traces, database error messages, internal identifiers.

### On TODO comments

Use `// TODO(milestone-XX): description` to track deferred work. Always include which milestone or phase should handle it. Never leave a TODO without a reference.

### On defensive programming

Validate external inputs at the boundary (Zod schemas). Inside the system, trust your types. Do not add null checks everywhere "just in case" — that creates noise and masks real problems. Let TypeScript's strict mode surface actual nullability concerns.

---

## 5. What to Build Exactly — and What Not to Build

### Build exactly what the milestones describe

`14_MILESTONES.md` is your build order. Each milestone's deliverables are the full scope for that session. Nothing more, nothing less.

### Do not build features not in the PRD

The PRD (`02_PRD.md`) defines v1.0. Section 8 (Future Features) lists things explicitly excluded. If you find yourself building a feature that isn't in the PRD, stop. You are scope creeping.

Do NOT build these things (they are listed in the PRD as non-goals for v1.0):
- Subscription plans or Stripe integration
- Multiple Instagram account support
- Bulk unfollow functionality
- AI analytics
- CSV export
- Email notification system
- Mobile app
- Browser extension

### Do not over-engineer

You don't need:
- A plugin registry with hot-reloading (a simple `Map` is fine)
- A full event sourcing system (direct database writes are fine)
- A GraphQL layer (REST API routes are fine)
- A microservices architecture (a monorepo Next.js app is fine)
- Redis caching for everything (database indexes solve most performance problems)

The import provider abstraction is a deliberate design decision. Everything else should be as simple as possible.

### Do future-proof only where specified

The architecture is designed to support certain future features without code changes to the core:
- Adding a new import provider: implements `ImportProvider`, registers in the registry
- Adding subscription plans: a `Subscription` model and feature gates
- Adding multiple accounts: schema extension (noted in `04_DATABASE.md`)

You do not need to implement these now. You do need to not break the path to implementing them later.

---

## 6. When to Stop and Ask

Stop and ask the user (Bradley) before proceeding when:

**Security decisions**
- You find a potential security issue in the spec
- You're unsure how to safely handle user-provided input in a new context
- A third-party dependency has a security vulnerability that affects the build

**Architectural conflicts**
- A requirement in one doc contradicts another doc
- The milestone deliverables conflict with a rule in this document
- You need to violate a layer boundary to implement something

**Scope decisions**
- A feature from the Future Features list seems necessary to complete a milestone
- You're unsure whether a UI element / API behaviour is in scope

**Breaking changes**
- A new database migration would require data backfill
- A change to the API response shape would break existing integrations
- You're about to delete or significantly restructure existing code

**Uncertainty about the domain**
- You're unsure how Instagram's data export format works for a specific case
- You've found a format variation in the export that isn't documented

Do NOT ask for permission to:
- Write tests
- Refactor within a file for clarity
- Add a `console.warn` for debugging
- Choose between two equivalent implementation approaches (make a decision and note it in a comment)

---

## 7. How to Write Commits

Follow Conventional Commits exactly as specified in `12_CODING_STANDARDS.md`.

**Every commit must:**
1. Pass TypeScript (`npm run type-check`)
2. Pass linting (`npm run lint`)
3. Not break any existing tests

**Commit when:**
- A unit of work is complete and verified
- Before switching context to a different part of the system
- At least once per hour of active development

**Never commit:**
- Commented-out code (delete it; git history preserves it if needed)
- `console.log` statements (use the logger)
- `.env.local` or any secrets
- Code with TypeScript errors
- Code with lint errors

**Example good commits for Milestone 06:**

```
feat(import): add ImportProvider interface and provider registry

Defines the core ImportProvider interface with validate() and parse() methods.
Implements a provider registry with register/getProvider/getDefaultProvider.
Sets up the extension point for future import providers.

feat(import): implement Instagram export ZIP validator

Validates uploaded files against known Instagram export structure:
- Magic bytes check (ZIP signature)
- Required files check (followers_1.json, following.json)
- HTML format detection with helpful error message
- Zip bomb protection (compression ratio + entry size limits)
- Executable file detection

feat(import): implement Instagram follower JSON parser

Parses followers_1.json, followers_2.json (paginated), and following.json
into FollowerEntry arrays. Handles both known format variants (2023/2024).
Converts Unix timestamps to Date objects.

test(import): add unit tests for ZIP validator and JSON parser

Covers all validation error paths and parser format variants.
Includes edge cases: empty files, paginated exports, mixed-case usernames.
Coverage: 96% line, 92% branch.
```

---

## 8. How to Run Tests

### During development

```bash
# Run unit tests in watch mode (run constantly while coding)
npm run test:unit -- --watch

# Run a specific test file
npm run test:unit -- src/lib/diff/snapshot-diff.test.ts

# Run with coverage
npm run test:coverage
```

### Before committing

```bash
# Full check: types + lint + unit tests
npm run type-check && npm run lint && npm run test:unit
```

### Integration tests (when working on API routes or services)

```bash
# Requires TEST_DATABASE_URL to be set
npm run test:integration
```

### E2E tests (Milestone 18 only)

```bash
npm run test:e2e
```

### Test naming conventions

Test descriptions should complete the sentence "it should...":

```typescript
it('returns empty diffs when snapshots are identical', ...)
it('identifies new followers correctly', ...)
it('rejects ZIP files with executables', ...)
it('returns 404 when snapshot belongs to a different user', ...)
```

---

## 9. How to Update Documentation

The docs in `/docs` are the source of truth. When your implementation differs from the documentation (because you discovered a better approach or a spec error), update the documentation.

**When to update docs:**
- You discover the spec is incorrect or ambiguous
- You make an implementation decision that differs from the spec
- You add a new utility, hook, or service not in the spec
- You find a new edge case not covered in the PRD

**How to update docs:**
1. Edit the relevant markdown file in `/docs`
2. Add a `_Last Updated_` annotation at the top of the changed section if the change is significant
3. Include the docs update in the same commit as the code change

**What NOT to change in docs:**
- Do not change `14_MILESTONES.md` acceptance criteria without flagging it
- Do not change `02_PRD.md` feature scope without asking — that's a product decision
- Do not remove future feature documentation (section 8 of PRD) — it's still planned

---

## 10. Common Mistakes to Avoid

### Mistake 1: Fetching data in Client Components when a Server Component would work

```typescript
// Wrong — makes an API call from the client for initial data
'use client'
export function Dashboard() {
  const { data } = useQuery(...)  // Unnecessary network round-trip
}

// Right — fetch on the server, hydrate the client
// app/(app)/dashboard/page.tsx (Server Component)
export default async function Dashboard() {
  const snapshot = await snapshotService.getLatest(userId)  // Direct service call
  return <DashboardClient initialData={snapshot} />
}
```

### Mistake 2: Importing Prisma in a component or route handler

```typescript
// Wrong — bypasses the repository layer
import { db } from '@/lib/db/prisma'
export const GET = async () => {
  const snapshots = await db.snapshot.findMany(...)  // Direct in route handler
}

// Right — use the service layer
import { snapshotService } from '@/services/snapshot.service'
export const GET = withErrorHandler(async (req) => {
  const snapshots = await snapshotService.listByUser(userId)
})
```

### Mistake 3: Missing userId filter

```typescript
// Wrong — IDOR vulnerability
const snapshot = await db.snapshot.findFirst({ where: { id: params.id } })

// Right
const snapshot = await db.snapshot.findFirst({ where: { id: params.id, userId: user.id } })
```

### Mistake 4: Returning 403 instead of 404 for ownership failures

When a user tries to access a resource they don't own, return 404 — not 403. 403 confirms the resource exists. 404 does not.

```typescript
// Wrong — reveals the resource exists
if (snapshot.userId !== userId) throw new ForbiddenError()

// Right — ambiguous about existence
const snapshot = await repo.findFirst({ where: { id, userId } })
if (!snapshot) throw new NotFoundError('Snapshot')  // Could be missing OR not owned
```

### Mistake 5: Not handling the async file upload within Vercel's time limit

The synchronous import pipeline must complete within 60 seconds. For large exports, use batch inserts (already designed in `07_BACKEND.md`). If you hit timeout issues, do NOT add `maxDuration` to random functions — investigate the root cause.

### Mistake 6: Using `any` to avoid understanding a type

```typescript
// Wrong — masks the real type
const parsed = JSON.parse(input) as any
const username = parsed.string_list_data[0].value

// Right — understand and express the type
interface InstagramFollowerRecord {
  string_list_data: Array<{ value: string; href: string; timestamp: number }>
}
const parsed = JSON.parse(input) as InstagramFollowerRecord[]
// Or better: parse through Zod
```

### Mistake 7: Console.log in production code

```typescript
// Wrong
console.log('processing import for user', userId)

// Right
logger.info('Processing import', { userId, fileSize })
```

### Mistake 8: Hardcoding configuration values

```typescript
// Wrong
const maxSize = 52428800  // What is this number???

// Right
const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024  // 50MB
```

### Mistake 9: Skipping tests because "it's obvious"

The most obvious code has the most obvious bugs. Test it.

### Mistake 10: Implementing two milestones at once

Focus. One milestone at a time. Complete the acceptance criteria. Commit. Then move on.

---

## 11. Quality Checklist

Run this checklist before marking any milestone as complete:

### Code Quality
- [ ] TypeScript compiles with zero errors (`npm run type-check`)
- [ ] ESLint passes with zero warnings (`npm run lint`)
- [ ] No `any` types, no `@ts-ignore`, no `eslint-disable`
- [ ] No `console.log` statements (use `logger`)
- [ ] No hardcoded magic numbers or strings (use named constants)
- [ ] All exported functions have return type annotations

### Architecture
- [ ] No layer boundary violations (UI → service, API → service, not UI → database)
- [ ] All data queries include `userId` filter where applicable
- [ ] Import provider abstraction not bypassed
- [ ] Result type used for service methods

### Testing
- [ ] Unit tests cover all new business logic
- [ ] Error paths are tested (not just happy paths)
- [ ] Integration tests cover new API routes (auth, ownership, validation)
- [ ] `npm run test:unit` passes
- [ ] Coverage meets or exceeds targets for changed files

### Security
- [ ] User input validated with Zod before use
- [ ] File uploads validated (type, size, content)
- [ ] No secrets in code or committed env files
- [ ] API routes use `withErrorHandler` and `requireAuth`

### User Experience
- [ ] Loading states are implemented for all async operations
- [ ] Empty states are implemented for empty data
- [ ] Error states are implemented for failure cases
- [ ] Responsive layout works on mobile (375px), tablet (768px), desktop (1280px)
- [ ] Dark mode verified manually

### Documentation
- [ ] Any deviations from spec are documented
- [ ] New utility functions have JSDoc comments
- [ ] Complex algorithms have inline comments explaining intent

---

## 12. Milestone Completion Protocol

When you believe a milestone is complete:

**1. Run the full check:**
```bash
npm run type-check && npm run lint && npm run test:unit && npm run test:integration
```

All must pass. No exceptions.

**2. Manually verify acceptance criteria.**

Go through each acceptance criterion in `14_MILESTONES.md` for the current milestone. Check it off only if you have verified it works — not if you believe it should work.

**3. Write a completion summary.**

A brief note (can be in a commit message or a brief comment) summarising:
- What was built
- Any decisions made that differed from the spec
- Any known limitations or deferred items
- What the next milestone should know about your implementation

**4. Make the final commit:**

```
chore(milestone-XX): complete acceptance criteria

All acceptance criteria verified:
✓ [criterion 1]
✓ [criterion 2]
...

Notes for next milestone: [any relevant context]
```

**5. Move to the next milestone.**

Do not begin the next milestone until the current one is committed and the tests pass. Incomplete work from one milestone will compound into the next.

---

## Final Note

The goal is not to impress anyone with clever code. The goal is to build a useful product that users can trust with their private data. The best code is the code that does exactly what it's supposed to do, nothing more, and is easy for the next engineer (you, later) to understand and change.

Build it right. Build it simple. Build it secure.
