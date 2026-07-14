# 07 — Backend Specification

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09

---

## Table of Contents

1. [Service Layer Design](#1-service-layer-design)
2. [Repository Layer Design](#2-repository-layer-design)
3. [Business Logic Rules](#3-business-logic-rules)
4. [Snapshot Comparison Algorithm](#4-snapshot-comparison-algorithm)
5. [Validation Layer](#5-validation-layer)
6. [API Route Handler Patterns](#6-api-route-handler-patterns)
7. [Security Middleware](#7-security-middleware)
8. [Background Processing](#8-background-processing)
9. [Email](#9-email)
10. [Storage Operations](#10-storage-operations)

---

## 1. Service Layer Design

Services are pure TypeScript modules (no HTTP awareness). They contain all business logic and are the only layer that calls repositories and external providers.

### Service Catalogue

| Service | File | Responsibilities |
|---------|------|-----------------|
| `ImportService` | `services/import.service.ts` | Orchestrate the full import pipeline |
| `SnapshotService` | `services/snapshot.service.ts` | Create, retrieve, delete snapshots |
| `DiffService` | `services/diff.service.ts` | Compute and cache snapshot diffs |
| `UserService` | `services/user.service.ts` | Profile management, account deletion |
| `StorageService` | `services/storage.service.ts` | File upload, delete, signed URL generation |

### ImportService

```typescript
// services/import.service.ts

export class ImportService {
  constructor(
    private importRepo: ImportRepository,
    private snapshotService: SnapshotService,
    private storageService: StorageService,
    private importProvider: ImportProvider,  // Injected — Instagram export in v1.0
  ) {}

  async processUpload(
    userId: string,
    file: File,
  ): Promise<Result<{ importId: string; snapshotId: string; stats: SnapshotStats }>> {
    // 1. Validate file (type, size)
    const fileValidation = validateUploadedFile(file)
    if (!fileValidation.success) return err(fileValidation.error)

    // 2. Upload to storage (generates storageKey)
    const uploadResult = await this.storageService.upload(userId, file)
    if (!uploadResult.success) return err(uploadResult.error)

    // 3. Create import record (PENDING)
    const importRecord = await this.importRepo.create({
      userId,
      storageKey: uploadResult.data.key,
      fileSizeBytes: BigInt(file.size),
      status: ImportStatus.PROCESSING,
    })

    // 4. Run the import provider
    const parseResult = await this.importProvider.parse({
      file: await file.arrayBuffer().then(b => Buffer.from(b)),
      mimeType: file.type,
    })

    if (!parseResult.success) {
      // Mark import as failed, delete storage file
      await this.importRepo.updateStatus(importRecord.id, ImportStatus.FAILED, parseResult.error.message)
      await this.storageService.delete(uploadResult.data.key)
      return err(parseResult.error)
    }

    // 5. Create snapshot from parsed data
    const snapshotResult = await this.snapshotService.createFromParsedData(
      userId,
      importRecord.id,
      parseResult.data,
    )

    if (!snapshotResult.success) {
      await this.importRepo.updateStatus(importRecord.id, ImportStatus.FAILED, 'Snapshot creation failed')
      return err(snapshotResult.error)
    }

    // 6. Mark import as completed
    await this.importRepo.updateStatus(importRecord.id, ImportStatus.COMPLETED)

    return ok({
      importId: importRecord.id,
      snapshotId: snapshotResult.data.id,
      stats: {
        followerCount: parseResult.data.followers.length,
        followingCount: parseResult.data.following.length,
      },
    })
  }
}
```

### SnapshotService

```typescript
// services/snapshot.service.ts

export class SnapshotService {
  constructor(private snapshotRepo: SnapshotRepository) {}

  async createFromParsedData(
    userId: string,
    importId: string,
    data: ParsedFollowerData,
  ): Promise<Result<Snapshot>> {
    // Deduplicate entries (some exports have duplicates)
    const followers = deduplicateEntries(data.followers)
    const following = deduplicateEntries(data.following)

    return this.snapshotRepo.createWithEntries({
      userId,
      importId,
      instagramUsername: data.instagramUsername,
      followerCount: followers.length,
      followingCount: following.length,
      exportedAt: data.exportedAt,
      entries: [
        ...followers.map(f => ({ ...f, entryType: EntryType.FOLLOWER })),
        ...following.map(f => ({ ...f, entryType: EntryType.FOLLOWING })),
      ],
    })
  }

  async getWithComputedStats(snapshotId: string, userId: string): Promise<Result<SnapshotWithStats>> {
    const snapshot = await this.snapshotRepo.findById(snapshotId, userId)
    if (!snapshot) return err(new NotFoundError('Snapshot'))

    // Compute derived stats
    const followerUsernames = new Set(
      snapshot.entries.filter(e => e.entryType === EntryType.FOLLOWER).map(e => e.instagramUsername)
    )
    const followingUsernames = new Set(
      snapshot.entries.filter(e => e.entryType === EntryType.FOLLOWING).map(e => e.instagramUsername)
    )

    return ok({
      ...snapshot,
      nonFollowerCount: [...followingUsernames].filter(u => !followerUsernames.has(u)).length,
      nonFollowingCount: [...followerUsernames].filter(u => !followingUsernames.has(u)).length,
      mutualCount: [...followingUsernames].filter(u => followerUsernames.has(u)).length,
    })
  }

  async deleteSnapshot(snapshotId: string, userId: string): Promise<Result<void>> {
    const snapshot = await this.snapshotRepo.findById(snapshotId, userId)
    if (!snapshot) return err(new NotFoundError('Snapshot'))

    // Cascade: snapshot_entries, diff_cache deleted by FK cascade
    await this.snapshotRepo.delete(snapshotId, userId)
    return ok(undefined)
  }
}
```

### DiffService

```typescript
// services/diff.service.ts

export class DiffService {
  constructor(
    private snapshotRepo: SnapshotRepository,
    private diffCacheRepo: DiffCacheRepository,
  ) {}

  async getDiff(fromId: string, toId: string, userId: string): Promise<Result<DiffResult>> {
    // 1. Check cache
    const cached = await this.diffCacheRepo.find(fromId, toId)
    if (cached) return ok({ ...cached.result, cached: true })

    // 2. Fetch both snapshots (ownership verified)
    const [from, to] = await Promise.all([
      this.snapshotRepo.findByIdWithEntries(fromId, userId),
      this.snapshotRepo.findByIdWithEntries(toId, userId),
    ])

    if (!from) return err(new NotFoundError('From snapshot'))
    if (!to)   return err(new NotFoundError('To snapshot'))

    // 3. Validate ordering
    if (from.createdAt >= to.createdAt) {
      return err(new ValidationError('"from" snapshot must be older than "to" snapshot'))
    }

    // 4. Compute diff
    const result = computeSnapshotDiff(from, to)

    // 5. Cache result
    await this.diffCacheRepo.create(fromId, toId, result)

    return ok({ ...result, cached: false })
  }
}
```

---

## 2. Repository Layer Design

Repositories are the only place Prisma is imported. They return domain types, not raw Prisma types.

### Repository Catalogue

| Repository | File | Primary Model |
|-----------|------|--------------|
| `ImportRepository` | `repositories/import.repository.ts` | `Import` |
| `SnapshotRepository` | `repositories/snapshot.repository.ts` | `Snapshot` + `SnapshotEntry` |
| `DiffCacheRepository` | `repositories/diff-cache.repository.ts` | `DiffCache` |
| `UserRepository` | `repositories/user.repository.ts` | `User` |

### Example: SnapshotRepository

```typescript
// repositories/snapshot.repository.ts

export class SnapshotRepository {
  constructor(private db: PrismaClient) {}

  async findById(id: string, userId: string): Promise<Snapshot | null> {
    return this.db.snapshot.findFirst({
      where: { id, userId },
    })
  }

  async findByIdWithEntries(id: string, userId: string): Promise<SnapshotWithEntries | null> {
    return this.db.snapshot.findFirst({
      where: { id, userId },
      include: { entries: true },
    })
  }

  async findAllByUserId(userId: string): Promise<Snapshot[]> {
    return this.db.snapshot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createWithEntries(data: CreateSnapshotInput): Promise<Snapshot> {
    // Use a transaction to ensure snapshot + entries are created atomically
    return this.db.$transaction(async (tx) => {
      const snapshot = await tx.snapshot.create({
        data: {
          userId: data.userId,
          importId: data.importId,
          instagramUsername: data.instagramUsername,
          followerCount: data.followerCount,
          followingCount: data.followingCount,
          exportedAt: data.exportedAt,
        },
      })

      // Batch insert entries in chunks of 1000 to avoid query size limits
      const CHUNK_SIZE = 1000
      for (let i = 0; i < data.entries.length; i += CHUNK_SIZE) {
        await tx.snapshotEntry.createMany({
          data: data.entries.slice(i, i + CHUNK_SIZE).map(entry => ({
            snapshotId: snapshot.id,
            instagramUsername: entry.instagramUsername,
            instagramUserId: entry.instagramUserId,
            profileUrl: entry.profileUrl,
            entryType: entry.entryType,
            followedAt: entry.followedAt,
          })),
        })
      }

      return snapshot
    })
  }

  async findEntriesPaginated(
    snapshotId: string,
    entryType: EntryType | 'NON_FOLLOWER' | 'NON_FOLLOWING' | 'MUTUAL',
    params: PaginationParams,
  ): Promise<PaginatedResult<SnapshotEntry>> {
    // For derived types (NON_FOLLOWER etc.), compute with subquery or in-memory
    // See section 4 for the algorithm
    // ...
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.db.snapshot.deleteMany({
      where: { id, userId },
    })
  }
}
```

---

## 3. Business Logic Rules

These rules are enforced in the service layer and must never be bypassed:

| Rule | Location | Enforcement |
|------|----------|-------------|
| A user can only access their own data | All services | `userId` in every query |
| Import file must be ≤ 50MB | `ImportService` | Before upload |
| Import file must be a ZIP | `ImportService` | MIME type + magic bytes |
| Diff `from` must be older than `to` | `DiffService` | Date comparison |
| Duplicate export detection | `ImportService` | `exportedAt` timestamp comparison |
| Snapshot entries are deduplicated | `SnapshotService` | Before `createWithEntries` |
| Batch insert limit: 1000 entries per query | `SnapshotRepository` | Chunking logic |
| Maximum 5 imports per user per hour | Rate limiter middleware | Before route handler |
| Account deletion requires "DELETE" confirmation | `UserService` | String comparison |

---

## 4. Snapshot Comparison Algorithm

### Set-Based Diff

The diff algorithm uses pure set operations on the `instagramUsername` field. This is the canonical identifier available in Instagram exports.

```typescript
// lib/diff/snapshot-diff.ts

export interface DiffResult {
  newFollowers:  { count: number; entries: FollowerEntry[] }
  lostFollowers: { count: number; entries: FollowerEntry[] }
  newFollowing:  { count: number; entries: FollowerEntry[] }
  unfollowed:    { count: number; entries: FollowerEntry[] }
  netFollowerChange: number
}

export function computeSnapshotDiff(
  from: SnapshotWithEntries,
  to: SnapshotWithEntries,
): DiffResult {
  // Build maps keyed by username for O(1) lookups
  const fromFollowers  = buildUsernameMap(from.entries, EntryType.FOLLOWER)
  const fromFollowing  = buildUsernameMap(from.entries, EntryType.FOLLOWING)
  const toFollowers    = buildUsernameMap(to.entries,   EntryType.FOLLOWER)
  const toFollowing    = buildUsernameMap(to.entries,   EntryType.FOLLOWING)

  // New followers: in toFollowers but not fromFollowers
  const newFollowers = mapDifference(toFollowers, fromFollowers)

  // Lost followers: in fromFollowers but not toFollowers
  const lostFollowers = mapDifference(fromFollowers, toFollowers)

  // New following: in toFollowing but not fromFollowing
  const newFollowing = mapDifference(toFollowing, fromFollowing)

  // Unfollowed: in fromFollowing but not toFollowing
  const unfollowed = mapDifference(fromFollowing, toFollowing)

  return {
    newFollowers:  { count: newFollowers.length,  entries: newFollowers },
    lostFollowers: { count: lostFollowers.length, entries: lostFollowers },
    newFollowing:  { count: newFollowing.length,  entries: newFollowing },
    unfollowed:    { count: unfollowed.length,    entries: unfollowed },
    netFollowerChange: newFollowers.length - lostFollowers.length,
  }
}

function buildUsernameMap(
  entries: SnapshotEntry[],
  type: EntryType,
): Map<string, SnapshotEntry> {
  return new Map(
    entries
      .filter(e => e.entryType === type)
      .map(e => [e.instagramUsername.toLowerCase(), e])
  )
}

function mapDifference(
  a: Map<string, SnapshotEntry>,
  b: Map<string, SnapshotEntry>,
): SnapshotEntry[] {
  return [...a.values()].filter(entry => !b.has(entry.instagramUsername.toLowerCase()))
}
```

### Non-Follower / Non-Following Computation

These are computed from a single snapshot, not a diff:

```typescript
// lib/diff/snapshot-analysis.ts

export function computeSnapshotAnalysis(entries: SnapshotEntry[]): SnapshotAnalysis {
  const followers  = new Set(
    entries.filter(e => e.entryType === EntryType.FOLLOWER).map(e => e.instagramUsername.toLowerCase())
  )
  const following  = new Set(
    entries.filter(e => e.entryType === EntryType.FOLLOWING).map(e => e.instagramUsername.toLowerCase())
  )

  const nonFollowers  = entries.filter(
    e => e.entryType === EntryType.FOLLOWING && !followers.has(e.instagramUsername.toLowerCase())
  )
  const nonFollowing  = entries.filter(
    e => e.entryType === EntryType.FOLLOWER && !following.has(e.instagramUsername.toLowerCase())
  )
  const mutuals = entries.filter(
    e => e.entryType === EntryType.FOLLOWER && following.has(e.instagramUsername.toLowerCase())
  )

  return {
    nonFollowers,   // You follow them; they don't follow back
    nonFollowing,   // They follow you; you don't follow back
    mutuals,        // Both follow each other
  }
}
```

### Algorithm Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| Build username map | O(n) | O(n) |
| Set difference | O(n) | O(n) |
| Full diff (two snapshots, n entries each) | O(n) | O(n) |
| Non-follower analysis (single snapshot, n entries) | O(n) | O(n) |

For n = 100,000 entries: all operations complete in < 100ms in Node.js.

---

## 5. Validation Layer

All external inputs are validated with Zod before reaching the service layer.

```typescript
// lib/validations/import.schema.ts

export const uploadFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine(f => f.size <= 50 * 1024 * 1024, 'File must be 50MB or smaller')
    .refine(
      f => ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'].includes(f.type),
      'File must be a ZIP archive'
    ),
})

// lib/validations/user.schema.ts

export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  onboardingCompleted: z.boolean().optional(),
})

export const deleteAccountSchema = z.object({
  confirmation: z.literal('DELETE'),
})

// lib/validations/snapshot.schema.ts

export const paginationSchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(50),
  sort:   z.string().optional(),
  order:  z.enum(['asc', 'desc']).default('asc'),
  search: z.string().max(50).optional(),
})

export const diffQuerySchema = z.object({
  from: z.string().uuid(),
  to:   z.string().uuid(),
})
```

### Validation in Route Handlers

```typescript
// Consistent pattern across all route handlers
export async function PATCH(req: NextRequest) {
  return withErrorHandler(async () => {
    const user = await requireAuth(req)                    // Throws 401 if no session

    const body = await req.json()
    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError('Invalid request body', parsed.error.flatten())
    }

    const result = await userService.updateProfile(user.id, parsed.data)
    return NextResponse.json(result)
  })()
}
```

---

## 6. API Route Handler Patterns

### Handler Wrapper

```typescript
// lib/utils/api-handler.ts

export function withErrorHandler(
  handler: (req: NextRequest, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    try {
      return await handler(req, ctx)
    } catch (error) {
      return handleError(error)
    }
  }
}

export async function requireAuth(req: NextRequest): Promise<User> {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) throw new UnauthorisedError()
  return session.user
}

export async function requireOwnResource<T extends { userId: string }>(
  resource: T | null,
  userId: string,
): Promise<T> {
  if (!resource) throw new NotFoundError('Resource')
  if (resource.userId !== userId) throw new ForbiddenError()
  return resource
}
```

### Route File Structure

```typescript
// app/api/v1/snapshots/[id]/non-followers/route.ts

export const GET = withErrorHandler(async (req, { params }) => {
  const user = await requireAuth(req)

  const { id: snapshotId } = await params
  const query = paginationSchema.parse(
    Object.fromEntries(new URL(req.url).searchParams)
  )

  const result = await snapshotService.getNonFollowers(snapshotId, user.id, query)
  return NextResponse.json(result)
})
```

---

## 7. Security Middleware

### Next.js Middleware (`src/middleware.ts`)

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths — no auth check
  const publicPaths = ['/', '/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email']
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Auth API paths — handled by Better Auth
  if (pathname.startsWith('/api/v1/auth')) {
    return NextResponse.next()
  }

  // Health check — public
  if (pathname === '/api/v1/health') {
    return NextResponse.next()
  }

  // All other paths require auth
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Authentication required' } }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Attach user ID to request headers for downstream use
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', session.user.id)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Security Headers

Applied via `next.config.ts`:

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",   // Next.js requires inline scripts
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://lh3.googleusercontent.com",  // Google avatars
      "connect-src 'self' https://*.supabase.co",
      "font-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]
```

---

## 8. Background Processing

In v1.0, all processing is synchronous within the import API route. The synchronous path must complete within Vercel's 60-second function timeout.

**Processing time estimates:**
- 1,000 follower entries: ~2 seconds
- 5,000 entries: ~5 seconds
- 20,000 entries: ~15 seconds
- 100,000 entries: ~60 seconds (at limit — show extended processing message)

**At 10-second mark:** Client sees extended wait message: "This is a large export and may take up to a minute..."

**v2.0 Background Queue Design (documented for future implementation):**

```typescript
// Future: background job contract
interface ImportJob {
  type: 'PROCESS_IMPORT'
  payload: {
    importId: string
    userId: string
    storageKey: string
  }
}
```

The `ImportService.processUpload` is already structured as a pure function that can be called from either a route handler (sync) or a queue worker (async) without changes.

---

## 9. Email

v1.0 uses Better Auth's built-in email sending for:
- Email verification
- Password reset

**Provider:** Resend (free tier: 3,000 emails/month, 100/day)

**Configuration (Better Auth):**
```typescript
// lib/auth/auth.ts
emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    await resend.emails.send({
      from: 'FollowBack <hello@followback.app>',
      to: user.email,
      subject: 'Verify your FollowBack email',
      html: verificationEmailTemplate({ name: user.name, url }),
    })
  },
},
```

Email templates are plain HTML files (no template engine dependency) with inline CSS for maximum email client compatibility.

---

## 10. Storage Operations

### StorageService

```typescript
// services/storage.service.ts

export class StorageService {
  constructor(private client: SupabaseClient) {}

  async upload(userId: string, file: File): Promise<Result<{ key: string }>> {
    const key = `imports/${userId}/${crypto.randomUUID()}/export.zip`

    const { error } = await this.client.storage
      .from('user-imports')
      .upload(key, file, {
        contentType: 'application/zip',
        upsert: false,
      })

    if (error) return err(new AppError('STORAGE_UPLOAD_FAILED', error.message))
    return ok({ key })
  }

  async delete(key: string): Promise<Result<void>> {
    const { error } = await this.client.storage
      .from('user-imports')
      .remove([key])

    if (error) return err(new AppError('STORAGE_DELETE_FAILED', error.message))
    return ok(undefined)
  }

  async deleteUserFolder(userId: string): Promise<Result<void>> {
    const { data: files } = await this.client.storage
      .from('user-imports')
      .list(`imports/${userId}`, { limit: 1000 })

    if (files && files.length > 0) {
      const keys = files.map(f => `imports/${userId}/${f.name}`)
      await this.client.storage.from('user-imports').remove(keys)
    }

    return ok(undefined)
  }

  async getSignedUrl(key: string, expiresInSeconds = 900): Promise<Result<string>> {
    const { data, error } = await this.client.storage
      .from('user-imports')
      .createSignedUrl(key, expiresInSeconds)

    if (error || !data) return err(new AppError('STORAGE_SIGNED_URL_FAILED', error?.message ?? 'Unknown'))
    return ok(data.signedUrl)
  }
}
```

### Storage Bucket Configuration (Supabase)

```sql
-- Run in Supabase SQL editor during setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-imports',
  'user-imports',
  false,                          -- Private bucket; no public access
  52428800,                       -- 50MB limit
  ARRAY['application/zip', 'application/x-zip-compressed', 'application/octet-stream']
);

-- RLS: users can only access their own files (defence in depth)
CREATE POLICY "Users access own imports"
  ON storage.objects FOR ALL
  USING (auth.uid()::text = (storage.foldername(name))[2]);
```

Note: The application API layer enforces access control. The Supabase RLS policy is an additional defence layer.
