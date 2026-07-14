# 10 — Testing Strategy

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Test Pyramid](#2-test-pyramid)
3. [Unit Tests](#3-unit-tests)
4. [Integration Tests](#4-integration-tests)
5. [End-to-End Tests](#5-end-to-end-tests)
6. [Test Utilities & Mocking](#6-test-utilities--mocking)
7. [Coverage Goals](#7-coverage-goals)
8. [CI Test Pipeline](#8-ci-test-pipeline)
9. [Test Data Management](#9-test-data-management)
10. [Performance Testing](#10-performance-testing)

---

## 1. Testing Philosophy

**Test behaviour, not implementation.** Tests should verify that the application does what users and business rules require — not that specific functions were called in a specific order.

**The Testing Trophy** (adapted for this application):
```
       ▲
      / \
     / E \     ← End-to-End (few, high value)
    /─────\
   /  Int  \   ← Integration (moderate, API-level)
  /─────────\
 /   Unit    \ ← Unit (many, fast, pure logic)
/─────────────\
   Static     ← TypeScript + ESLint (always on)
```

**Priorities:**
1. Critical path tests over exhaustive coverage
2. Deterministic, fast tests over slow, flaky ones
3. Tests that catch real bugs over tests that hit a coverage number
4. Integration tests for the import pipeline (the most complex subsystem)

---

## 2. Test Pyramid

| Level | Tool | Count Target | Run Time | When |
|-------|------|-------------|----------|------|
| Static analysis | TypeScript + ESLint | — | < 30s | Every save |
| Unit | Vitest | ~150 tests | < 10s | Every commit |
| Integration | Vitest + test database | ~50 tests | < 60s | Every PR |
| E2E | Playwright | ~20 tests | < 3 min | Every merge to main |

---

## 3. Unit Tests

Unit tests cover pure functions with no side effects. They are fast, isolated, and require no external dependencies.

### What to Unit Test

- Snapshot diff algorithm (`computeSnapshotDiff`)
- Snapshot analysis functions (`computeSnapshotAnalysis`)
- ZIP validation helpers (`isZipFile`, `checkCompressionRatio`)
- Instagram JSON parsers (`parseFollowerJson`, `extractEntries`)
- Utility functions (`deduplicateEntries`, `buildUsernameMap`)
- Zod validation schemas
- Error factories

### Test File Conventions

```
src/
  lib/
    diff/
      snapshot-diff.ts
      snapshot-diff.test.ts      ← Co-located with source
    import/
      providers/
        instagram-export/
          parser.ts
          parser.test.ts
```

### Example: Diff Algorithm Tests

```typescript
// lib/diff/snapshot-diff.test.ts

import { describe, it, expect } from 'vitest'
import { computeSnapshotDiff } from './snapshot-diff'
import { makeSnapshot, makeEntry } from '@/tests/factories'

describe('computeSnapshotDiff', () => {
  it('returns empty diffs when snapshots are identical', () => {
    const entries = [
      makeEntry({ username: 'alice', type: 'FOLLOWER' }),
      makeEntry({ username: 'alice', type: 'FOLLOWING' }),
    ]
    const from = makeSnapshot({ entries })
    const to   = makeSnapshot({ entries })

    const result = computeSnapshotDiff(from, to)

    expect(result.newFollowers.count).toBe(0)
    expect(result.lostFollowers.count).toBe(0)
    expect(result.netFollowerChange).toBe(0)
  })

  it('identifies new followers correctly', () => {
    const from = makeSnapshot({ entries: [
      makeEntry({ username: 'alice', type: 'FOLLOWER' }),
    ]})
    const to = makeSnapshot({ entries: [
      makeEntry({ username: 'alice',  type: 'FOLLOWER' }),
      makeEntry({ username: 'bob',    type: 'FOLLOWER' }),  // New
    ]})

    const result = computeSnapshotDiff(from, to)

    expect(result.newFollowers.count).toBe(1)
    expect(result.newFollowers.entries[0].instagramUsername).toBe('bob')
    expect(result.lostFollowers.count).toBe(0)
    expect(result.netFollowerChange).toBe(1)
  })

  it('identifies lost followers correctly', () => {
    const from = makeSnapshot({ entries: [
      makeEntry({ username: 'alice', type: 'FOLLOWER' }),
      makeEntry({ username: 'bob',   type: 'FOLLOWER' }),
    ]})
    const to = makeSnapshot({ entries: [
      makeEntry({ username: 'alice', type: 'FOLLOWER' }),  // bob unfollowed
    ]})

    const result = computeSnapshotDiff(from, to)

    expect(result.lostFollowers.count).toBe(1)
    expect(result.lostFollowers.entries[0].instagramUsername).toBe('bob')
    expect(result.netFollowerChange).toBe(-1)
  })

  it('is case-insensitive when comparing usernames', () => {
    const from = makeSnapshot({ entries: [
      makeEntry({ username: 'Alice', type: 'FOLLOWER' }),
    ]})
    const to = makeSnapshot({ entries: [
      makeEntry({ username: 'alice', type: 'FOLLOWER' }),  // Same person, different case
    ]})

    const result = computeSnapshotDiff(from, to)

    expect(result.newFollowers.count).toBe(0)
    expect(result.lostFollowers.count).toBe(0)
  })

  it('handles empty snapshots without errors', () => {
    const from = makeSnapshot({ entries: [] })
    const to   = makeSnapshot({ entries: [] })

    expect(() => computeSnapshotDiff(from, to)).not.toThrow()
  })

  it('handles large snapshots efficiently', () => {
    const generateEntries = (count: number, type: 'FOLLOWER' | 'FOLLOWING') =>
      Array.from({ length: count }, (_, i) =>
        makeEntry({ username: `user_${i}`, type })
      )

    const from = makeSnapshot({ entries: generateEntries(5000, 'FOLLOWER') })
    const to   = makeSnapshot({ entries: [
      ...generateEntries(4500, 'FOLLOWER'),       // 500 lost
      ...generateEntries(1000, 'FOLLOWER').map((e, i) => ({ ...e, instagramUsername: `new_user_${i}` })), // 1000 new
    ]})

    const start = performance.now()
    const result = computeSnapshotDiff(from, to)
    const duration = performance.now() - start

    expect(result.lostFollowers.count).toBe(500)
    expect(result.newFollowers.count).toBe(1000)
    expect(duration).toBeLessThan(100)  // Must complete in < 100ms
  })
})
```

### Example: Parser Tests

```typescript
// lib/import/providers/instagram-export/parser.test.ts

describe('InstagramExportProvider', () => {
  describe('validate', () => {
    it('rejects non-ZIP files', async () => {
      const provider = new InstagramExportProvider()
      const result = await provider.validate({
        buffer: Buffer.from('not a zip file'),
        mimeType: 'text/plain',
      })

      expect(result.valid).toBe(false)
      expect(result.reason).toContain('ZIP')
    })

    it('rejects HTML exports with a helpful message', async () => {
      const htmlZip = createZipWith({ 'followers.html': '<html>...</html>' })
      const result = await provider.validate({
        buffer: htmlZip,
        mimeType: 'application/zip',
      })

      expect(result.valid).toBe(false)
      expect(result.reason).toContain('JSON format')
    })

    it('accepts a valid Instagram export ZIP', async () => {
      const validZip = createInstagramExportZip({
        followers: [{ value: 'alice', href: 'https://instagram.com/alice', timestamp: 1700000000 }],
        following: [{ value: 'bob',   href: 'https://instagram.com/bob',   timestamp: 1700000000 }],
      })

      const result = await provider.validate({
        buffer: validZip,
        mimeType: 'application/zip',
      })

      expect(result.valid).toBe(true)
    })
  })

  describe('parse', () => {
    it('correctly parses followers and following', async () => {
      const zip = createInstagramExportZip({
        followers: [{ value: 'alice', href: 'https://instagram.com/alice', timestamp: 1700000000 }],
        following: [{ value: 'bob', href: 'https://instagram.com/bob', timestamp: 1700000000 }],
      })

      const result = await provider.parse({ buffer: zip, mimeType: 'application/zip' })

      expect(result.followers).toHaveLength(1)
      expect(result.followers[0].instagramUsername).toBe('alice')
      expect(result.following).toHaveLength(1)
      expect(result.following[0].instagramUsername).toBe('bob')
    })

    it('handles paginated follower files (followers_1.json, followers_2.json)', async () => {
      const zip = createInstagramExportZip({
        followersPage1: generateFollowers(1000),
        followersPage2: generateFollowers(500),
        following: [],
      })

      const result = await provider.parse({ buffer: zip, mimeType: 'application/zip' })

      expect(result.followers).toHaveLength(1500)
    })

    it('converts Unix timestamps to Date objects', async () => {
      const zip = createInstagramExportZip({
        followers: [{ value: 'alice', href: 'https://instagram.com/alice', timestamp: 1704067200 }],
        following: [],
      })

      const result = await provider.parse({ buffer: zip, mimeType: 'application/zip' })

      expect(result.followers[0].followedAt).toBeInstanceOf(Date)
      expect(result.followers[0].followedAt?.toISOString()).toContain('2024-01-01')
    })
  })
})
```

---

## 4. Integration Tests

Integration tests run against a real test database (separate from development). They test the full stack from service layer through to the database.

### Setup

```typescript
// tests/integration/setup.ts

import { beforeAll, afterAll, beforeEach } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const testDb = new PrismaClient({
  datasources: { db: { url: process.env.TEST_DATABASE_URL } },
})

beforeAll(async () => {
  // Run migrations on test database
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  })
})

beforeEach(async () => {
  // Clean all tables before each test (fast: truncate in reverse FK order)
  await testDb.$executeRaw`TRUNCATE TABLE diff_cache, snapshot_entries, snapshots, imports, sessions, accounts, users RESTART IDENTITY CASCADE`
})

afterAll(async () => {
  await testDb.$disconnect()
})

export { testDb }
```

### What to Integration Test

- `ImportService.processUpload` — end-to-end import flow with a real ZIP and real database writes
- `SnapshotRepository.createWithEntries` — batch insert correctness
- `DiffService.getDiff` — cache hit and cache miss paths
- `UserService.deleteAccount` — cascade deletion of all user data
- API route handlers — request validation, auth checks, response shape

### Example: ImportService Integration Test

```typescript
// tests/integration/import-service.test.ts

describe('ImportService.processUpload', () => {
  it('creates a snapshot with correct entry counts', async () => {
    const user = await createTestUser(testDb)
    const zip = createInstagramExportZip({
      followers: generateFollowers(150),
      following: generateFollowers(90),
    })
    const file = new File([zip], 'export.zip', { type: 'application/zip' })

    const result = await importService.processUpload(user.id, file)

    expect(result.success).toBe(true)
    if (!result.success) return

    const snapshot = await testDb.snapshot.findUnique({
      where: { id: result.data.snapshotId },
      include: { entries: true },
    })

    expect(snapshot).toBeTruthy()
    expect(snapshot!.followerCount).toBe(150)
    expect(snapshot!.followingCount).toBe(90)
    expect(snapshot!.entries).toHaveLength(240)
  })

  it('marks import as FAILED and cleans up storage on parse error', async () => {
    const user = await createTestUser(testDb)
    const badZip = createZipWith({ 'random_file.txt': 'not instagram data' })
    const file = new File([badZip], 'export.zip', { type: 'application/zip' })

    const result = await importService.processUpload(user.id, file)

    expect(result.success).toBe(false)

    const importRecord = await testDb.import.findFirst({
      where: { userId: user.id },
    })
    expect(importRecord?.status).toBe('FAILED')

    // Verify storage cleanup
    const storedFiles = await storageService.listUserFiles(user.id)
    expect(storedFiles).toHaveLength(0)
  })

  it('deduplicates entries from the same export', async () => {
    const user = await createTestUser(testDb)
    const zip = createInstagramExportZip({
      followers: [
        { value: 'alice', href: '...', timestamp: 1700000000 },
        { value: 'alice', href: '...', timestamp: 1700000000 },  // Duplicate
      ],
      following: [],
    })

    const result = await importService.processUpload(user.id, new File([zip], 'export.zip'))

    expect(result.success).toBe(true)
    const snapshot = await testDb.snapshot.findUnique({
      where: { id: result.data!.snapshotId },
      include: { entries: true },
    })
    expect(snapshot!.followerCount).toBe(1)  // Deduplicated
    expect(snapshot!.entries.filter(e => e.entryType === 'FOLLOWER')).toHaveLength(1)
  })
})
```

### Example: API Route Integration Test

```typescript
// tests/integration/api/snapshots.test.ts

describe('GET /api/v1/snapshots/:id/non-followers', () => {
  it('returns only non-followers for the authenticated user', async () => {
    const user = await createTestUser(testDb)
    const session = await createTestSession(testDb, user.id)
    const snapshot = await createTestSnapshot(testDb, user.id, {
      followers: ['alice', 'bob'],
      following: ['alice', 'charlie'],  // charlie is a non-follower (user follows, doesn't follow back)
    })

    const response = await fetch(`/api/v1/snapshots/${snapshot.id}/non-followers`, {
      headers: { Cookie: `better-auth.session_token=${session.token}` },
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data).toHaveLength(1)
    expect(data.data[0].instagramUsername).toBe('charlie')
  })

  it('returns 404 when accessing another user\'s snapshot', async () => {
    const owner = await createTestUser(testDb)
    const attacker = await createTestUser(testDb)
    const attackerSession = await createTestSession(testDb, attacker.id)
    const snapshot = await createTestSnapshot(testDb, owner.id, { followers: ['alice'], following: [] })

    const response = await fetch(`/api/v1/snapshots/${snapshot.id}/non-followers`, {
      headers: { Cookie: `better-auth.session_token=${attackerSession.token}` },
    })

    expect(response.status).toBe(404)  // Not 403 — don't confirm existence
  })

  it('returns 401 without authentication', async () => {
    const response = await fetch('/api/v1/snapshots/some-id/non-followers')
    expect(response.status).toBe(401)
  })
})
```

---

## 5. End-to-End Tests

E2E tests use Playwright against a running development server with a seeded test database.

### Scope

E2E tests cover critical user journeys only. Do not duplicate integration test coverage.

### Critical E2E Scenarios

```typescript
// tests/e2e/import-flow.spec.ts

test('first-time user can import and see results', async ({ page }) => {
  // Sign up
  await page.goto('/sign-up')
  await page.fill('[name="name"]', 'Test User')
  await page.fill('[name="email"]', 'e2e+test@followback.app')
  await page.fill('[name="password"]', 'TestPass1!')
  await page.click('[type="submit"]')

  // Skip email verification in test environment (magic link bypass)
  await verifyEmailForTest('e2e+test@followback.app')

  // Onboarding
  await expect(page).toHaveURL('/onboarding')
  await page.click('[data-testid="skip-onboarding"]')

  // Import
  await page.goto('/import')
  const zipBuffer = createInstagramExportZip({ followers: 100, following: 80 })
  await page.setInputFiles('[data-testid="file-input"]', {
    name: 'export.zip',
    mimeType: 'application/zip',
    buffer: zipBuffer,
  })

  // Wait for processing
  await expect(page.locator('[data-testid="import-success"]')).toBeVisible({ timeout: 30000 })

  // Dashboard shows correct stats
  await page.goto('/dashboard')
  await expect(page.locator('[data-testid="stat-followers"]')).toContainText('100')
  await expect(page.locator('[data-testid="stat-following"]')).toContainText('80')
})

test('returning user can compare two imports', async ({ page }) => {
  const { session } = await loginTestUser(page, 'returning@test.com')

  // Import first snapshot (seeded in beforeEach)
  // Import second snapshot
  await importSnapshot(page, createInstagramExportZip({ followers: 110, following: 80 }))

  // Navigate to changes
  await page.click('[data-testid="view-changes"]')
  await expect(page).toHaveURL(/\/changes/)

  // Verify diff shows correct new followers
  await expect(page.locator('[data-testid="new-followers-count"]')).toContainText('10')
})

test('user can delete account and all data is gone', async ({ page }) => {
  const { userId } = await loginTestUser(page, 'delete-me@test.com')

  await page.goto('/settings/data')
  await page.click('[data-testid="delete-account"]')
  await page.fill('[data-testid="delete-confirmation"]', 'DELETE')
  await page.click('[data-testid="confirm-delete"]')

  await expect(page).toHaveURL('/')
  await expect(page.locator('[data-testid="deletion-confirmation"]')).toBeVisible()

  // Verify database is empty
  const userExists = await testDb.user.findUnique({ where: { id: userId } })
  expect(userExists).toBeNull()
})
```

### Accessibility E2E Tests

```typescript
// tests/e2e/accessibility.spec.ts

import AxeBuilder from '@axe-core/playwright'

test('dashboard has no critical accessibility violations', async ({ page }) => {
  await loginTestUser(page)
  await page.goto('/dashboard')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(results.violations).toEqual([])
})

test('import page is keyboard navigable', async ({ page }) => {
  await loginTestUser(page)
  await page.goto('/import')

  // Tab through all interactive elements
  await page.keyboard.press('Tab')
  // Verify focus is on file dropzone
  await expect(page.locator('[data-testid="file-dropzone"]')).toBeFocused()
})
```

---

## 6. Test Utilities & Mocking

### Factory Functions

```typescript
// tests/factories/index.ts

export function makeEntry(overrides: Partial<SnapshotEntry> = {}): SnapshotEntry {
  return {
    id: crypto.randomUUID(),
    snapshotId: crypto.randomUUID(),
    instagramUsername: `user_${Math.random().toString(36).slice(2, 8)}`,
    instagramUserId: undefined,
    profileUrl: undefined,
    entryType: EntryType.FOLLOWER,
    followedAt: new Date('2024-01-01'),
    ...overrides,
  }
}

export function makeSnapshot(overrides: Partial<SnapshotWithEntries> = {}): SnapshotWithEntries {
  return {
    id: crypto.randomUUID(),
    userId: crypto.randomUUID(),
    importId: crypto.randomUUID(),
    instagramUsername: 'test_user',
    followerCount: 0,
    followingCount: 0,
    exportedAt: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    entries: [],
    ...overrides,
  }
}

export async function createTestUser(db: PrismaClient, overrides = {}) {
  return db.user.create({
    data: {
      email: `test+${crypto.randomUUID()}@test.com`,
      displayName: 'Test User',
      emailVerified: true,
      onboardingCompleted: true,
      ...overrides,
    },
  })
}
```

### Mock Storage Service

```typescript
// tests/mocks/storage.service.ts

export class MockStorageService implements StorageService {
  private files = new Map<string, Buffer>()

  async upload(userId: string, file: File) {
    const key = `imports/${userId}/${crypto.randomUUID()}/export.zip`
    this.files.set(key, Buffer.from(await file.arrayBuffer()))
    return ok({ key })
  }

  async delete(key: string) {
    this.files.delete(key)
    return ok(undefined)
  }

  async listUserFiles(userId: string) {
    return [...this.files.keys()].filter(k => k.startsWith(`imports/${userId}/`))
  }
}
```

### Vitest Configuration

```typescript
// vitest.config.ts

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
      },
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        'prisma/**',
        'src/components/ui/**',  // shadcn/ui — not our code
      ],
    },
    include: ['src/**/*.test.ts', 'tests/unit/**/*.ts', 'tests/integration/**/*.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
```

---

## 7. Coverage Goals

| Layer | Line Coverage | Branch Coverage | Notes |
|-------|:---:|:---:|-------|
| Diff algorithm | 100% | 100% | Critical business logic |
| Import parser | 95% | 90% | Many format edge cases |
| Service layer | 85% | 80% | Core business rules |
| Repository layer | 70% | 65% | Mostly pass-through |
| API route handlers | 80% | 75% | Auth + validation paths |
| Utility functions | 90% | 85% | Pure functions |
| UI components | Not measured | — | Covered by E2E |

**Global minimum:** 80% line coverage, 75% branch coverage. CI fails if below these thresholds.

Coverage is a floor, not a goal. 100% coverage does not mean the code is correct.

---

## 8. CI Test Pipeline

```yaml
# .github/workflows/ci.yml

name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: followback_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      TEST_DATABASE_URL: postgresql://postgres:test@localhost:5432/followback_test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 9. Test Data Management

### Test Database

- A separate PostgreSQL database is used for integration tests: `followback_test`
- Migrations are run before the test suite
- All tables are truncated before each test (not after — preserves data for debugging failures)
- The test database is never shared between CI runs (each run gets a fresh DB via the postgres service container)

### Test Fixtures

Large test fixtures (e.g., a real 50MB Instagram export ZIP) are stored in `tests/fixtures/` and committed to the repository (up to 10MB; larger ones are generated programmatically).

### Seeded Data for E2E

E2E tests use a seeded database with well-known test accounts:

```typescript
// tests/e2e/seed.ts
// Creates accounts with predictable data for E2E assertions:
// - user: fresh@test.com (no imports)
// - user: returning@test.com (2 imports, predictable diff)
// - user: delete-me@test.com (for deletion flow testing)
```

---

## 10. Performance Testing

Performance tests run in CI on the main branch only (too slow for PRs).

### Key Performance Assertions

```typescript
// tests/performance/import.perf.ts

test('import processes 10,000 followers in < 10 seconds', async () => {
  const zip = createInstagramExportZip({
    followers: generateFollowers(10000),
    following: generateFollowers(5000),
  })

  const start = Date.now()
  const result = await importService.processUpload(testUserId, new File([zip], 'export.zip'))
  const duration = Date.now() - start

  expect(result.success).toBe(true)
  expect(duration).toBeLessThan(10000)
})

test('diff computation for 50,000 entries completes in < 500ms', async () => {
  // Set up two large snapshots
  const [from, to] = await createLargeSnapshotPair(testDb, testUserId, 50000)

  const start = Date.now()
  await diffService.getDiff(from.id, to.id, testUserId)
  const duration = Date.now() - start

  expect(duration).toBeLessThan(500)
})
```
