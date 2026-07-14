# 05 — API Specification

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09  
> Base URL: `https://followback.app/api/v1`

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Authentication](#2-authentication)
3. [Request & Response Conventions](#3-request--response-conventions)
4. [Error Format](#4-error-format)
5. [Rate Limiting](#5-rate-limiting)
6. [Versioning](#6-versioning)
7. [Endpoints](#7-endpoints)
   - [Health](#health)
   - [Auth](#auth)
   - [Users](#users)
   - [Imports](#imports)
   - [Snapshots](#snapshots)
   - [Diff](#diff)

---

## 1. Design Principles

- **REST** with JSON payloads
- **Versioned** under `/api/v1/`; future breaking changes go to `/api/v2/`
- **Consistent error shape** — every error response has the same structure
- **Authorisation checked at the route level** — never rely on the client to filter data
- **Pagination** on all list endpoints — never return unbounded arrays
- **HTTPS only** — all requests must use TLS; HTTP redirects to HTTPS

---

## 2. Authentication

Better Auth manages session cookies. All protected endpoints require a valid session cookie (`better-auth.session_token`) set at login.

The middleware validates the session token on every request to `/api/v1/*` except:
- `GET /api/v1/health`
- `POST /api/v1/auth/*` (Better Auth routes)

**Session Flow:**

1. Client signs in via `POST /api/v1/auth/sign-in/email`
2. Better Auth sets an HttpOnly, Secure, SameSite=Lax session cookie
3. All subsequent requests include the cookie automatically
4. On expiry, the client receives `401 Unauthorised`

There are no API keys or Bearer tokens in v1.0. JWT-based API access is a v2.0 feature (for mobile app / third-party integrations).

---

## 3. Request & Response Conventions

### Content Types

- Request bodies: `application/json` (or `multipart/form-data` for file uploads)
- Response bodies: `application/json`
- All strings are UTF-8

### Timestamps

All timestamps are ISO 8601 strings in UTC: `"2026-07-09T14:30:00.000Z"`

### Pagination

All list endpoints accept:

| Query Param | Type | Default | Max | Description |
|-------------|------|---------|-----|-------------|
| `page` | integer | `1` | — | 1-based page number |
| `limit` | integer | `50` | `100` | Items per page |
| `sort` | string | varies | — | Sort field |
| `order` | `asc\|desc` | varies | — | Sort direction |
| `search` | string | — | — | Username filter |

Paginated responses include:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 247,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 4. Error Format

Every error response conforms to:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description of the error",
    "details": { }
  }
}
```

### Error Codes

| HTTP Status | Code | Meaning |
|-------------|------|---------|
| 400 | `BAD_REQUEST` | Malformed request |
| 400 | `IMPORT_INVALID_FILE` | File is not a valid Instagram export |
| 400 | `IMPORT_INVALID_FORMAT` | Export is HTML, not JSON |
| 400 | `IMPORT_CORRUPTED` | ZIP cannot be read |
| 400 | `IMPORT_DUPLICATE` | Same export already imported |
| 401 | `UNAUTHORISED` | No valid session |
| 403 | `FORBIDDEN` | Session valid but no permission |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Resource already exists |
| 413 | `FILE_TOO_LARGE` | Upload exceeds 50MB |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Not a ZIP file |
| 422 | `VALIDATION_ERROR` | Input failed schema validation |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server error |
| 503 | `SERVICE_UNAVAILABLE` | Database or storage unavailable |

---

## 5. Rate Limiting

Rate limits are applied per user (authenticated) or per IP (unauthenticated).

| Endpoint Group | Limit | Window | Strategy |
|----------------|-------|--------|----------|
| Auth (sign-in) | 10 requests | 15 minutes | Per IP |
| Auth (sign-up) | 5 requests | 1 hour | Per IP |
| Auth (password reset) | 3 requests | 1 hour | Per email |
| Import (file upload) | 5 requests | 1 hour | Per user |
| All other API endpoints | 100 requests | 1 minute | Per user |

Rate limit response headers are always included:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1720534800
```

When exceeded:
```json
HTTP 429 Too Many Requests
Retry-After: 47

{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again in 47 seconds.",
    "details": { "retryAfter": 47 }
  }
}
```

---

## 6. Versioning

- Current version: `v1`
- URL-based versioning: `/api/v1/`
- Breaking changes introduce `/api/v2/` — v1 is maintained for 12 months
- Non-breaking additions (new fields, new endpoints) are added to the current version
- Deprecation notices are added to response headers: `Deprecation: true`, `Sunset: <date>`

---

## 7. Endpoints

---

### Health

#### `GET /api/v1/health`

Returns application health status. Used by Vercel deployment health checks and uptime monitoring.

**Auth:** None

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-09T14:30:00.000Z",
  "version": "1.0.0",
  "database": "ok",
  "storage": "ok"
}
```

**Response 503 (degraded):**
```json
{
  "status": "degraded",
  "timestamp": "2026-07-09T14:30:00.000Z",
  "version": "1.0.0",
  "database": "error",
  "storage": "ok"
}
```

---

### Auth

Auth endpoints are handled by Better Auth and mounted at `/api/v1/auth/[...all]`. Better Auth generates these handlers; they are documented here for reference.

#### `POST /api/v1/auth/sign-up/email`

**Auth:** None  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "MyPassword1!",
  "name": "Alice Smith"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Alice Smith",
    "emailVerified": false,
    "createdAt": "2026-07-09T14:30:00.000Z"
  }
}
```

**Response 409:** Email already registered

---

#### `POST /api/v1/auth/sign-in/email`

**Auth:** None  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "MyPassword1!",
  "rememberMe": true
}
```

**Response 200:** Sets session cookie, returns user object  
**Response 401:** Invalid credentials

---

#### `POST /api/v1/auth/sign-out`

**Auth:** Session cookie  
**Response 200:** Session invalidated, cookie cleared

---

#### `POST /api/v1/auth/forgot-password`

**Auth:** None  
**Body:** `{ "email": "user@example.com" }`  
**Response 200:** Always returns success (prevents email enumeration)

---

#### `POST /api/v1/auth/reset-password`

**Auth:** None (token in body)  
**Body:** `{ "token": "...", "newPassword": "NewPass1!" }`  
**Response 200:** Password updated, all sessions invalidated  
**Response 400:** Token invalid or expired

---

#### `GET /api/v1/auth/verify-email`

**Auth:** None (token in query)  
**Query:** `?token=...`  
**Response 200:** Email verified  
**Response 400:** Token invalid or expired

---

#### `GET /api/v1/auth/session`

**Auth:** Session cookie  
**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Alice Smith",
    "emailVerified": true,
    "avatarUrl": "https://...",
    "onboardingCompleted": false,
    "createdAt": "2026-07-09T14:30:00.000Z"
  },
  "session": {
    "id": "uuid",
    "expiresAt": "2026-08-08T14:30:00.000Z"
  }
}
```

---

### Users

#### `GET /api/v1/users/me`

Returns the current user's profile.

**Auth:** Required

**Response 200:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "Alice Smith",
  "avatarUrl": "https://...",
  "onboardingCompleted": true,
  "createdAt": "2026-07-09T14:30:00.000Z",
  "updatedAt": "2026-07-09T14:30:00.000Z"
}
```

---

#### `PATCH /api/v1/users/me`

Update the current user's profile.

**Auth:** Required  
**Body:** (all fields optional)
```json
{
  "displayName": "Alice J. Smith",
  "onboardingCompleted": true
}
```

**Validation:**
- `displayName`: string, 1–100 characters

**Response 200:** Updated user object  
**Response 422:** Validation error

---

#### `DELETE /api/v1/users/me`

Delete the current user's account and all associated data.

**Auth:** Required  
**Body:**
```json
{
  "confirmation": "DELETE"
}
```

**Response 200:**
```json
{ "message": "Your account has been permanently deleted." }
```

**Response 400:** Confirmation string does not match

This endpoint:
1. Deletes all `snapshot_entries` for the user
2. Deletes all `snapshots` for the user
3. Deletes all `imports` for the user (cascades to storage file deletion via background cleanup)
4. Deletes all `sessions` for the user
5. Deletes all `accounts` for the user
6. Deletes the `user` record
7. Purges all files in `imports/{userId}/` from Supabase Storage
8. Responds with 200 before storage purge completes (storage purge is queued)

---

#### `POST /api/v1/users/me/data-export`

Request a GDPR data export (JSON of all user data).

**Auth:** Required  
**Response 200:**
```json
{
  "downloadUrl": "https://...",   // Signed URL, valid 15 minutes
  "expiresAt": "2026-07-09T14:45:00.000Z"
}
```

---

### Imports

#### `POST /api/v1/imports`

Upload an Instagram Data Export ZIP file and initiate processing.

**Auth:** Required  
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Instagram export ZIP |

**Validations:**
- File must be `application/zip` or `application/x-zip-compressed`
- File size ≤ 50MB
- File must contain Instagram export JSON files

**Response 201:**
```json
{
  "import": {
    "id": "uuid",
    "status": "PROCESSING",
    "fileSizeBytes": 1234567,
    "importedAt": "2026-07-09T14:30:00.000Z"
  }
}
```

**Response 400:** Invalid file  
**Response 413:** File too large  
**Response 415:** Not a ZIP file  
**Response 429:** Rate limit exceeded (5 imports/hour)

**Note:** Processing is synchronous in v1.0. The `201` response is returned after processing completes. The `status` in the response will be either `COMPLETED` or `FAILED`.

---

#### `GET /api/v1/imports`

List all imports for the current user.

**Auth:** Required  
**Query Params:** `page`, `limit`, `order` (default: `desc`)

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "status": "COMPLETED",
      "fileSizeBytes": 1234567,
      "importedAt": "2026-07-09T14:30:00.000Z",
      "snapshot": {
        "id": "uuid",
        "instagramUsername": "alice_creates",
        "followerCount": 1247,
        "followingCount": 892,
        "exportedAt": "2026-07-08T10:00:00.000Z"
      }
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 3, "totalPages": 1, "hasNext": false, "hasPrev": false }
}
```

---

#### `GET /api/v1/imports/:id`

Get a specific import by ID.

**Auth:** Required  
**Response 200:** Single import object (same shape as list item)  
**Response 404:** Import not found or does not belong to user

---

#### `DELETE /api/v1/imports/:id`

Delete an import, its snapshot, and the associated storage file.

**Auth:** Required  
**Response 200:**
```json
{ "message": "Import deleted successfully." }
```
**Response 404:** Import not found or does not belong to user

---

### Snapshots

#### `GET /api/v1/snapshots`

List all snapshots for the current user.

**Auth:** Required  
**Query Params:** `page`, `limit`, `order`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "instagramUsername": "alice_creates",
      "followerCount": 1247,
      "followingCount": 892,
      "exportedAt": "2026-07-08T10:00:00.000Z",
      "createdAt": "2026-07-09T14:30:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/v1/snapshots/latest`

Returns the user's most recent snapshot with summary stats.

**Auth:** Required  
**Response 200:**
```json
{
  "id": "uuid",
  "instagramUsername": "alice_creates",
  "followerCount": 1247,
  "followingCount": 892,
  "nonFollowerCount": 203,
  "nonFollowingCount": 148,
  "mutualCount": 1044,
  "exportedAt": "2026-07-08T10:00:00.000Z",
  "createdAt": "2026-07-09T14:30:00.000Z"
}
```

**Response 404:** No snapshots exist for this user

---

#### `GET /api/v1/snapshots/:id`

Get a specific snapshot.

**Auth:** Required  
**Response 200:** Snapshot object with computed counts  
**Response 404:** Not found

---

#### `GET /api/v1/snapshots/:id/non-followers`

Get the list of accounts the user follows that don't follow back, from this snapshot.

**Auth:** Required  
**Query Params:** `page`, `limit`, `sort` (`username`|`followedAt`), `order`, `search`

**Response 200:**
```json
{
  "data": [
    {
      "instagramUsername": "example_account",
      "profileUrl": "https://www.instagram.com/example_account/",
      "followedAt": "2025-01-15T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/v1/snapshots/:id/non-following`

Get the list of accounts that follow the user but aren't followed back.

**Auth:** Required  
**Query Params:** `page`, `limit`, `sort`, `order`, `search`  
**Response 200:** Same shape as non-followers

---

#### `GET /api/v1/snapshots/:id/mutuals`

Get the list of mutual followers.

**Auth:** Required  
**Query Params:** `page`, `limit`, `sort`, `order`, `search`  
**Response 200:** Same shape as non-followers

---

#### `GET /api/v1/snapshots/:id/followers`

Get the complete followers list for a snapshot.

**Auth:** Required  
**Query Params:** `page`, `limit`, `sort`, `order`, `search`  
**Response 200:** Same shape as non-followers

---

#### `GET /api/v1/snapshots/:id/following`

Get the complete following list for a snapshot.

**Auth:** Required  
**Query Params:** `page`, `limit`, `sort`, `order`, `search`  
**Response 200:** Same shape as non-followers

---

### Diff

#### `GET /api/v1/diff`

Compute or retrieve cached diff between two snapshots.

**Auth:** Required  
**Query Params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | UUID | Yes | Older snapshot ID |
| `to` | UUID | Yes | Newer snapshot ID |

**Validations:**
- Both snapshots must belong to the current user
- `from` must be older than `to`

**Response 200:**
```json
{
  "fromSnapshot": {
    "id": "uuid",
    "instagramUsername": "alice_creates",
    "followerCount": 1100,
    "createdAt": "2026-06-01T10:00:00.000Z"
  },
  "toSnapshot": {
    "id": "uuid",
    "instagramUsername": "alice_creates",
    "followerCount": 1247,
    "createdAt": "2026-07-09T14:30:00.000Z"
  },
  "diff": {
    "newFollowers": {
      "count": 189,
      "entries": [
        { "instagramUsername": "new_fan_1", "profileUrl": "https://..." }
      ]
    },
    "lostFollowers": {
      "count": 42,
      "entries": [
        { "instagramUsername": "ex_follower_1", "profileUrl": "https://..." }
      ]
    },
    "newFollowing": {
      "count": 15,
      "entries": [...]
    },
    "unfollowed": {
      "count": 8,
      "entries": [...]
    },
    "netFollowerChange": 147,
    "computedAt": "2026-07-09T14:30:05.000Z",
    "cached": true
  }
}
```

**Note:** The `entries` arrays in the diff response are paginated separately in a real implementation. For MVP, the full array is returned (diff results are bounded by the size of the smaller snapshot, which is typically small enough to return in full).

**Response 400:** `from` is newer than `to`  
**Response 403:** One or both snapshots don't belong to this user  
**Response 404:** One or both snapshots not found

---

#### `DELETE /api/v1/diff/cache`

Invalidate all diff caches for the current user (admin utility / debugging).

**Auth:** Required  
**Response 200:** `{ "deleted": 12 }`
