# 09 — Security

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09  
> Security Classification: Internal

---

## Table of Contents

1. [Security Philosophy](#1-security-philosophy)
2. [Threat Model](#2-threat-model)
3. [Authentication Security](#3-authentication-security)
4. [Authorisation](#4-authorisation)
5. [Input Validation & Injection Prevention](#5-input-validation--injection-prevention)
6. [File Upload Security](#6-file-upload-security)
7. [Transport Security](#7-transport-security)
8. [Secrets Management](#8-secrets-management)
9. [Rate Limiting & DDoS Protection](#9-rate-limiting--ddos-protection)
10. [Encryption](#10-encryption)
11. [OWASP Top 10 Mapping](#11-owasp-top-10-mapping)
12. [GDPR Compliance](#12-gdpr-compliance)
13. [Security Testing](#13-security-testing)
14. [Incident Response](#14-incident-response)

---

## 1. Security Philosophy

FollowBack handles personal social data. Users trust us with information about their Instagram relationships — data that is sensitive, private, and not publicly available.

**Core security principles:**

1. **Privacy by default** — collect the minimum data required; delete immediately when no longer needed
2. **Defence in depth** — multiple independent layers of controls; no single point of failure
3. **Least privilege** — every component has only the permissions it needs
4. **Fail securely** — errors default to denying access, not granting it
5. **Transparency** — users can see what data is stored and delete it at any time

---

## 2. Threat Model

### Assets

| Asset | Sensitivity | Description |
|-------|------------|-------------|
| User follower/following data | High | Private social graph data |
| User email address | Medium | PII |
| Session tokens | Critical | Full account access if compromised |
| OAuth tokens | Critical | Provider account access |
| Database | Critical | All user data |
| Storage bucket | High | Raw Instagram export ZIPs |

### Threat Actors

| Actor | Motivation | Capability |
|-------|-----------|-----------|
| Automated bots | Credential stuffing, account enumeration | Medium |
| Malicious users | Access other users' data | Low-Medium |
| External attackers | Data breach, ransom | Medium |
| Malicious upload | ZIP bomb, malware delivery | Low |
| Insider threat | Unauthorised data access | Low (solo project initially) |

### Key Threats

| ID | Threat | Likelihood | Impact | Mitigation |
|----|--------|-----------|--------|------------|
| T1 | Session token theft (XSS) | Medium | Critical | HttpOnly cookies, CSP |
| T2 | CSRF attack | Low | High | SameSite cookie, CSRF tokens |
| T3 | SQL injection | Low | Critical | Prisma parameterised queries |
| T4 | Broken access control (IDOR) | Medium | High | userId filter on all queries |
| T5 | Malicious ZIP upload | Low | Medium | File validation pipeline |
| T6 | ZIP bomb / decompression attack | Low | Medium | Compression ratio check |
| T7 | Credential stuffing | Medium | Medium | Rate limiting, account lockout |
| T8 | API enumeration | Medium | Low | Consistent error responses |
| T9 | Data breach via storage | Low | Critical | Private bucket, signed URLs |
| T10 | Secrets exposed in code | Low | Critical | Env vars, secret scanning |

---

## 3. Authentication Security

### Session Management (Better Auth)

- Session tokens are random 32-byte (256-bit) values, URL-safe base64 encoded
- Stored as HttpOnly, Secure, SameSite=Lax cookies
- `HttpOnly`: Prevents JavaScript access (XSS token theft mitigation)
- `Secure`: Only sent over HTTPS
- `SameSite=Lax`: Prevents most CSRF attacks; allows GET navigations from external sites
- Session lifetime: 30 days (remember me) or browser session (no remember me)
- Sessions are invalidated immediately on sign-out, password change, and account deletion

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- Passwords hashed with **Argon2id** (Better Auth default)
  - Memory cost: 19 MB
  - Iterations: 2
  - Parallelism: 1
- Never logged, never transmitted in plaintext after initial POST

### Brute Force Protection

- 10 failed login attempts per account per 15 minutes → account soft-locked, CAPTCHA required
- IP-based rate limiting on auth endpoints (see Section 9)
- Account lockout is time-based (not permanent) to prevent denial-of-service against legitimate users

### Email Enumeration Prevention

- Sign-up: if email exists, show "An account with this email already exists" (not ambiguous, but doesn't reveal existence to attackers who don't have the email)
- Password reset: always show "If this email exists, you'll receive a reset link" — never confirm or deny email existence
- Sign-in failures: always "Invalid email or password" — never specify which is wrong

### OAuth Security

- Google OAuth only; no other providers in v1.0
- OAuth state parameter used to prevent CSRF during OAuth flow
- OAuth tokens (access/refresh) are stored encrypted in the database (see Section 10)
- If a Google account is de-authorised, the user falls back to email/password login

---

## 4. Authorisation

### Resource Ownership Model

Every piece of data in FollowBack belongs to exactly one user. Authorisation is enforced at the service layer, not the UI layer.

**Pattern: Always include `userId` in data queries.**

```typescript
// CORRECT — user can only access their own snapshots
const snapshot = await db.snapshot.findFirst({
  where: { id: snapshotId, userId: authenticatedUserId },
})

// WRONG — never query by ID alone
const snapshot = await db.snapshot.findFirst({
  where: { id: snapshotId },  // IDOR vulnerability
})
```

**Rule:** If a query returns `null` because `userId` doesn't match, return `404 Not Found` — not `403 Forbidden`. This prevents enumeration of valid resource IDs.

### Authorisation Checks Matrix

| Endpoint | Auth Required | Ownership Check |
|----------|:---:|:---:|
| `GET /api/v1/health` | ✗ | ✗ |
| `POST /api/v1/auth/*` | ✗ | ✗ |
| `GET /api/v1/users/me` | ✓ | Self only |
| `PATCH /api/v1/users/me` | ✓ | Self only |
| `DELETE /api/v1/users/me` | ✓ | Self only |
| `POST /api/v1/imports` | ✓ | Auto (userId from session) |
| `GET /api/v1/imports` | ✓ | Filtered by userId |
| `DELETE /api/v1/imports/:id` | ✓ | userId match required |
| `GET /api/v1/snapshots/:id/*` | ✓ | userId match required |
| `GET /api/v1/diff` | ✓ | Both snapshots userId match |

### Supabase Row-Level Security (Defence in Depth)

Supabase RLS is enabled on all tables as a secondary layer. Even if the application layer has a bug, RLS prevents cross-user data access at the database level.

```sql
-- Enable RLS
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshot_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE imports ENABLE ROW LEVEL SECURITY;

-- Policy: users can only access their own data
CREATE POLICY "own_snapshots" ON snapshots
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "own_entries" ON snapshot_entries
  FOR ALL USING (
    snapshot_id IN (SELECT id FROM snapshots WHERE user_id = auth.uid()::text)
  );
```

---

## 5. Input Validation & Injection Prevention

### SQL Injection

Prisma uses parameterised queries exclusively. Raw SQL is never constructed from user input. The only raw SQL permitted is in migrations, which are reviewed in PRs.

```typescript
// Safe — parameterised
await db.snapshot.findFirst({ where: { id: snapshotId, userId } })

// NEVER DO THIS
await db.$queryRaw`SELECT * FROM snapshots WHERE id = '${snapshotId}'`
// (Use Prisma.$queryRaw with Prisma.sql template tags if raw SQL is ever needed)
```

### XSS Prevention

- React's JSX escapes all dynamic content by default
- `dangerouslySetInnerHTML` is never used
- User-supplied content (display names, Instagram usernames) is always rendered as text nodes, not HTML
- CSP header blocks inline script execution from injected content

### Path Traversal

File paths are never constructed from user input. Storage keys use server-generated UUIDs:
```typescript
const key = `imports/${userId}/${crypto.randomUUID()}/export.zip`
// userId is from the verified session — not from request body
```

### Prototype Pollution

All JSON.parse calls operate on controlled input or go through Zod validation before use. Object spread from external data uses explicit field extraction, never `...parsedJson` directly.

---

## 6. File Upload Security

### Multi-Layer Validation

| Layer | Check | Blocks |
|-------|-------|--------|
| Client | Extension check, size check | Obvious mistakes |
| API Route | MIME type validation | Wrong file type |
| File Inspector | Magic bytes check | Extension spoofing |
| ZIP Inspector | Entry count, individual size | ZIP bombs |
| ZIP Inspector | Compression ratio | Decompression attacks |
| ZIP Inspector | No executable extensions | Malware delivery |
| ZIP Inspector | Required files present | Non-Instagram ZIPs |
| JSON Parser | Structured data only | Injection via JSON |

### Zip Bomb Protection

```typescript
const MAX_UNCOMPRESSED_RATIO = 100   // 100:1 compression ratio limit
const MAX_ENTRY_SIZE_BYTES = 10_000_000   // 10MB per file
const MAX_ENTRY_COUNT = 10_000       // Max files in ZIP

function validateZipSafety(zip: AdmZip, originalSizeBytes: number): void {
  const entries = zip.getEntries()

  if (entries.length > MAX_ENTRY_COUNT) {
    throw new ImportParseError('ZIP contains too many files')
  }

  let totalUncompressed = 0
  for (const entry of entries) {
    if (entry.header.size > MAX_ENTRY_SIZE_BYTES) {
      throw new ImportParseError(`ZIP contains a file that exceeds the size limit`)
    }
    totalUncompressed += entry.header.size
    if (totalUncompressed / originalSizeBytes > MAX_UNCOMPRESSED_RATIO) {
      throw new ImportParseError('ZIP compression ratio is suspiciously high')
    }
  }
}
```

### Storage Isolation

- Each user's files are in an isolated path: `imports/{userId}/`
- The storage bucket is private; no public access
- Files are served only via signed URLs generated server-side with 15-minute expiry
- Users cannot directly access Supabase Storage

---

## 7. Transport Security

### HTTPS Enforcement

- Vercel enforces HTTPS for all custom domains
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` header sent on all responses
- HTTP requests are redirected to HTTPS by Vercel infrastructure

### TLS Configuration

- Minimum TLS 1.2; TLS 1.3 preferred (Vercel default)
- Strong cipher suites only (managed by Vercel)

### Cookie Security

```typescript
// Better Auth cookie configuration
{
  secure: true,         // HTTPS only
  httpOnly: true,       // No JS access
  sameSite: 'lax',     // CSRF protection
  path: '/',
  domain: '.followback.app',
}
```

---

## 8. Secrets Management

### What Counts as a Secret

- `DATABASE_URL` (Supabase connection string)
- `DIRECT_DATABASE_URL` (Supabase direct connection)
- `BETTER_AUTH_SECRET` (session signing key)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXTAUTH_URL` (not strictly secret but environment-specific)

### Secret Storage Rules

1. Never commit secrets to source control
2. `.env.local` is in `.gitignore` — never commit it
3. `.env.example` contains only placeholder values: `BETTER_AUTH_SECRET=your-secret-here`
4. Production secrets live in Vercel Environment Variables (encrypted at rest)
5. GitHub Actions uses GitHub Secrets for CI/CD pipeline

### Secret Rotation

- `BETTER_AUTH_SECRET` rotation: update Vercel env var; all sessions are invalidated (acceptable)
- Database password rotation: Supabase dashboard → update Vercel env var → no downtime if connection pool handles reconnection
- OAuth client secret rotation: update Google Cloud Console → update Vercel env var

### GitHub Secret Scanning

Enable GitHub's push protection to block accidental secret commits:
- Settings → Code Security → Secret scanning → Push protection: Enabled

---

## 9. Rate Limiting & DDoS Protection

### Implementation

v1.0 uses an in-memory rate limiter (via `@upstash/ratelimit` with a Redis-compatible API, or a simple in-memory map for early stages). Upstash Redis (free tier: 10,000 requests/day) is recommended for production.

```typescript
// lib/rate-limit.ts

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimiters = {
  signIn:         new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10,  '15 m') }),
  signUp:         new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5,   '1 h')  }),
  passwordReset:  new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3,   '1 h')  }),
  import:         new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5,   '1 h')  }),
  api:            new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '1 m')  }),
}
```

### DDoS Mitigation

- Vercel's built-in DDoS protection handles volumetric attacks
- Rate limiting prevents API abuse from authenticated users
- File upload size limit (50MB) prevents bandwidth exhaustion
- Vercel's firewall rules can block specific IPs if needed

---

## 10. Encryption

### Data at Rest

- **Database:** Supabase encrypts PostgreSQL data at rest (AES-256)
- **Storage:** Supabase Storage encrypts files at rest (AES-256)
- **OAuth tokens:** Encrypted before storing in the database using Better Auth's built-in encryption

### Sensitive Fields

OAuth access and refresh tokens are encrypted at the application layer before database storage:

```typescript
// Better Auth handles this automatically via its encryption plugin
// Uses AES-256-GCM with BETTER_AUTH_SECRET as the key material
```

### Data in Transit

- All data in transit is encrypted via TLS 1.2+
- Database connections from Vercel to Supabase use SSL (enforced by Supabase `?ssl=true`)

### Field-Level Encryption (Future)

For v2.0, if the threat model warrants it, consider field-level encryption for `instagramUsername` in `snapshot_entries`. This would prevent raw username enumeration even with database access, at the cost of search performance.

---

## 11. OWASP Top 10 Mapping

| OWASP 2021 Category | Our Control |
|--------------------|-------------|
| A01 - Broken Access Control | `userId` filter on all queries; RLS; 404 on ownership mismatch |
| A02 - Cryptographic Failures | TLS everywhere; Argon2id passwords; AES-256 at rest |
| A03 - Injection | Prisma parameterised queries; Zod validation |
| A04 - Insecure Design | Threat model; defence in depth; least privilege |
| A05 - Security Misconfiguration | Security headers; private storage; env var management |
| A06 - Vulnerable Components | `npm audit` in CI; Dependabot alerts enabled |
| A07 - Auth Failures | HttpOnly cookies; rate limiting; brute force protection |
| A08 - Software Integrity | Lock files; `npm ci` in CI; signed commits (future) |
| A09 - Logging & Monitoring | Structured logs; Sentry error tracking; alert on anomalies |
| A10 - SSRF | No user-controlled URLs fetched server-side |

---

## 12. GDPR Compliance

FollowBack processes personal data of EU residents and must comply with GDPR.

### Legal Basis for Processing

- **Contract performance** (Art. 6(1)(b)): Processing follower data is necessary to deliver the service the user signed up for
- **Legitimate interests**: No additional processing beyond the contractual purpose

### Data Subject Rights

| Right | Implementation |
|-------|---------------|
| Right to Access (Art. 15) | `POST /api/v1/users/me/data-export` — JSON download of all data |
| Right to Erasure (Art. 17) | `DELETE /api/v1/users/me` — hard delete of all data within 24 hours |
| Right to Rectification (Art. 16) | `PATCH /api/v1/users/me` — update display name and email |
| Right to Data Portability (Art. 20) | JSON export in machine-readable format |
| Right to Restriction (Art. 18) | Account deletion is offered as the primary mechanism |
| Right to Object (Art. 21) | Users can delete all snapshots without deleting the account |

### Data Minimisation

FollowBack collects only:
- Email address (required for account)
- Display name (can be a pseudonym)
- Instagram usernames from the export (required for the service)
- Session data (required for auth)

FollowBack does NOT collect:
- Instagram passwords
- Instagram session cookies
- Phone numbers
- Location data
- Behavioural analytics beyond basic page visits

### Data Retention

- User data: retained until account deletion request
- Sessions: expire after 30 days
- Import ZIPs: retained for 90 days after import; deleted immediately on snapshot deletion or account deletion
- Verification tokens: expire after 1 hour

### Privacy Policy Requirements

The privacy policy must clearly state:
- What data is collected and why
- How long data is retained
- How to request deletion
- Whether data is shared with third parties (Supabase, Vercel, Google)
- The data controller's contact information

### Data Processing Agreements (DPAs)

DPAs required with:
- **Vercel** — EU DPA available
- **Supabase** — EU DPA available (data stored in EU region)
- **Google** (OAuth) — DPA via Google Workspace Terms
- **Resend** — DPA available

### Data Location

All data stored on Supabase in the EU (Frankfurt, `eu-central-1`). Configure during Supabase project creation: Select EU region. Do not store data in US regions without explicit user consent and SCCs.

---

## 13. Security Testing

### Automated (runs in CI)

```yaml
# .github/workflows/ci.yml
- name: Security audit
  run: npm audit --audit-level=high

- name: SAST scan
  uses: github/codeql-action/analyze@v3
  with:
    languages: typescript
```

### Manual (before each release)

- [ ] OWASP ZAP scan against staging environment
- [ ] Manual IDOR testing: attempt to access another user's snapshots with a valid session
- [ ] File upload abuse testing: ZIP bomb, executable files, non-ZIP files
- [ ] Auth flow testing: session fixation, token replay, concurrent sessions
- [ ] Password reset flow: token expiry, token reuse, email enumeration

### Dependency Scanning

- Dependabot alerts enabled on GitHub
- `npm audit` runs in CI on every PR
- Review and update dependencies weekly

---

## 14. Incident Response

### Severity Levels

| Level | Example | Response Time | Notification |
|-------|---------|--------------|--------------|
| P0 - Critical | Active data breach, account takeover at scale | Immediate (< 1 hour) | All users affected |
| P1 - High | Potential IDOR bug, auth bypass discovered | < 4 hours | Affected users |
| P2 - Medium | Rate limiting bypass, XSS in non-sensitive area | < 24 hours | Internal |
| P3 - Low | Verbose error messages, minor information leak | < 1 week | Internal |

### GDPR Breach Notification

Under GDPR Art. 33, personal data breaches must be reported to the supervisory authority within **72 hours** of discovery.

Personal data breaches affecting users must also be communicated to affected users (Art. 34) if they pose a high risk.

### Responsible Disclosure

Security researchers can report vulnerabilities to `security@followback.app`. A vulnerability disclosure policy (VDP) should be published at `/security.txt` before public launch.
