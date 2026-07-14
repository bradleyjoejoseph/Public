# 11 — Deployment

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09

---

## Table of Contents

1. [Environment Strategy](#1-environment-strategy)
2. [Infrastructure Overview](#2-infrastructure-overview)
3. [Environment Variables](#3-environment-variables)
4. [Development Environment](#4-development-environment)
5. [Staging Environment](#5-staging-environment)
6. [Production Environment](#6-production-environment)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Database Migrations](#8-database-migrations)
9. [Rollback Strategy](#9-rollback-strategy)
10. [Monitoring & Alerting](#10-monitoring--alerting)
11. [Vercel Configuration](#11-vercel-configuration)
12. [Domain & DNS](#12-domain--dns)

---

## 1. Environment Strategy

FollowBack runs in three environments:

| Environment | Purpose | Hosting | Database | Branch |
|-------------|---------|---------|----------|--------|
| Development | Local development | Localhost | Local Postgres / Supabase Dev | Any feature branch |
| Staging | Pre-release validation | Vercel Preview | Supabase Staging project | `develop` |
| Production | Live application | Vercel Production | Supabase Production project | `main` |

**Principle:** Code flows `development → staging → production`. No hotfixes bypass staging. Staging mirrors production configuration as closely as possible.

---

## 2. Infrastructure Overview

```mermaid
graph LR
    subgraph GitHub
        PR[Pull Request] --> CI[GitHub Actions CI]
        CI --> Merge[Merge to develop]
        Merge --> CD_Stage[Deploy to Staging]
        CD_Stage --> Review[Manual Review]
        Review --> Main[Merge to main]
        Main --> CD_Prod[Deploy to Production]
    end

    subgraph Vercel
        CDN[Edge CDN]
        Preview[Preview Deployment]
        Prod[Production Deployment]
    end

    subgraph Supabase
        SB_Dev[(Dev DB)]
        SB_Stage[(Staging DB)]
        SB_Prod[(Production DB)]
        ST_Dev[Dev Storage]
        ST_Stage[Staging Storage]
        ST_Prod[Prod Storage]
    end

    CD_Stage --> Preview
    CD_Prod --> Prod
    Preview --> SB_Stage
    Prod --> SB_Prod
    CDN --> Prod
```

---

## 3. Environment Variables

### Required Variables

All environments require these variables. Production and staging values live in Vercel Environment Variables. Development values live in `.env.local` (never committed).

```bash
# .env.example — commit this file with placeholder values only

# ── Application ──────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000       # Full URL of the app
NODE_ENV=development                            # development | staging | production

# ── Database ─────────────────────────────────────────────
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=1
# ^ Use pgbouncer URL for serverless (transaction mode)
DIRECT_DATABASE_URL=postgresql://...
# ^ Direct connection for Prisma migrations (not pooled)

# ── Authentication (Better Auth) ─────────────────────────
BETTER_AUTH_SECRET=                            # 32+ random bytes, base64 encoded
BETTER_AUTH_URL=http://localhost:3000          # Same as NEXT_PUBLIC_APP_URL

# ── Google OAuth ─────────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── Supabase ─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=                     # Server-side only; never expose to client

# ── Email (Resend) ───────────────────────────────────────
RESEND_API_KEY=
EMAIL_FROM=FollowBack <hello@followback.app>

# ── Rate Limiting (Upstash Redis) ────────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ── Error Tracking (Sentry) ──────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=                             # For source map uploads in CI

# ── Analytics ────────────────────────────────────────────
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

### Variable Scoping Rules

| Prefix | Exposed to Browser | Use For |
|--------|:---:|---------|
| `NEXT_PUBLIC_` | Yes | Client-safe config (Supabase URL, app URL, DSNs) |
| (no prefix) | No | Secrets, server-only config |

**Rule:** Never put secrets in `NEXT_PUBLIC_` variables. The browser will expose them.

### Secret Generation

```bash
# Generate BETTER_AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

# Or using openssl
openssl rand -base64 32
```

---

## 4. Development Environment

### Prerequisites

```bash
node >= 22.0.0
npm >= 10.0.0
git >= 2.40.0
```

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/followback.git
cd followback

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your local values

# 4. Start local Postgres (or use Supabase local dev)
docker run -d \
  --name followback-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=followback \
  -p 5432:5432 \
  postgres:16

# 5. Run migrations
npx prisma migrate dev

# 6. Seed development data
npx prisma db seed

# 7. Start development server
npm run dev
```

### Local Development Options

**Option A: Docker Postgres** (recommended for isolation)
Use the Docker command above. Set `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/followback`.

**Option B: Supabase Local Dev**
```bash
npx supabase start
# Uses Docker under the hood; provides local Supabase with storage
```

**Option C: Supabase Cloud Dev Project**
Create a separate Supabase project for development. Good for testing real Supabase Storage.

### NPM Scripts

```json
{
  "scripts": {
    "dev":              "next dev",
    "build":            "next build",
    "start":            "next start",
    "lint":             "eslint . --max-warnings 0",
    "lint:fix":         "eslint . --fix",
    "format":           "prettier --write .",
    "type-check":       "tsc --noEmit",
    "test":             "vitest",
    "test:unit":        "vitest run --reporter=verbose tests/unit src/**/*.test.ts",
    "test:integration": "vitest run tests/integration",
    "test:e2e":         "playwright test",
    "test:coverage":    "vitest run --coverage",
    "db:migrate":       "prisma migrate dev",
    "db:push":          "prisma db push",
    "db:seed":          "prisma db seed",
    "db:studio":        "prisma studio",
    "analyze":          "ANALYZE=true next build"
  }
}
```

---

## 5. Staging Environment

### Purpose

Staging is the final gate before production. It is used to:
- Validate database migrations against a production-like schema
- Manually test new features before release
- Run E2E tests against a fully deployed environment
- Performance test with realistic data volumes

### Staging Supabase Project

A separate Supabase project exists for staging:
- Region: Same as production (EU)
- Storage: Separate bucket
- Database: Migrated independently from production

### Staging Deployment

Vercel creates a preview deployment for every push to the `develop` branch. The URL is: `https://followback-staging.vercel.app`

### Staging Data Policy

- Staging uses realistic but fictional data (generated by the seed script at scale)
- No real user data in staging
- Staging database is reset on a weekly basis via a manual process

---

## 6. Production Environment

### Vercel Project Configuration

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm ci`
- **Node.js Version:** 22.x

### Production Supabase Configuration

```
Region: eu-central-1 (Frankfurt)
Plan: Free (upgrade trigger: approaching 490MB database size or 100 active connections)
Connection Pooling: Supabase Pgbouncer, transaction mode
SSL: Enforced
Point-in-time Recovery: Not available on free tier (first paid upgrade enables this)
```

### Production Deployment Checklist

Before each production deployment:

- [ ] All CI checks pass (lint, type-check, unit tests, integration tests)
- [ ] Feature tested on staging environment
- [ ] Database migration reviewed and tested on staging
- [ ] No pending `npm audit` vulnerabilities at high or critical severity
- [ ] `CHANGELOG.md` updated
- [ ] Sentry release created (automated in CI)

---

## 7. CI/CD Pipeline

### Branch Strategy

```
main          ← Production deployments only
  └── develop ← Staging deployments; merge PRs here
        └── feature/your-feature ← Development branches
```

### GitHub Actions Workflows

**`ci.yml`** — Runs on every PR and push to `develop`/`main`:
1. `lint-and-typecheck` — ESLint + TypeScript compiler
2. `security-audit` — `npm audit --audit-level=high`
3. `unit-tests` — Vitest unit tests + coverage report
4. `integration-tests` — Vitest integration tests against test Postgres

**`deploy-staging.yml`** — Runs on push to `develop`:
1. Waits for `ci.yml` to pass
2. Triggers Vercel staging deployment via Vercel CLI
3. Runs database migrations on staging (`prisma migrate deploy`)
4. Runs E2E tests against staging URL

**`deploy-production.yml`** — Runs on push to `main`:
1. Waits for `ci.yml` to pass
2. Runs database migrations on production
3. Triggers Vercel production deployment
4. Creates Sentry release
5. Posts deployment notification to Slack (future)

```yaml
# .github/workflows/deploy-production.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - name: Run migrations
        env:
          DIRECT_DATABASE_URL: ${{ secrets.PRODUCTION_DIRECT_DATABASE_URL }}
        run: npx prisma migrate deploy

  deploy:
    needs: migrate
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

      - name: Create Sentry Release
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: followback
          SENTRY_PROJECT: followback-web
        with:
          environment: production
```

---

## 8. Database Migrations

### Migration Execution Order

Migrations **must run before** the new code is deployed. This is the "expand-contract" pattern:

```
1. Deploy migration (adds new column as nullable)
2. Deploy new code (reads new column, falls back gracefully if null)
3. Deploy migration (backfills data, makes column non-nullable)
```

This prevents downtime from schema changes.

### Migration Commands in CI

```bash
# In CI before code deployment:
npx prisma migrate deploy
```

`prisma migrate deploy` applies all pending migrations in order. It does NOT prompt for confirmation (safe for CI). It does NOT create new migrations (only applies existing ones).

### Migration Failure Handling

If a migration fails in production:
1. CI pipeline stops; code is not deployed
2. Alert fires (Sentry + GitHub CI failure)
3. Engineer investigates using direct database connection
4. If migration is partially applied, a compensating migration is created

Migrations should be designed to be safely re-runnable (idempotent) where possible using `IF NOT EXISTS` in raw SQL.

---

## 9. Rollback Strategy

### Code Rollback (Vercel)

Vercel keeps all previous deployments. Code rollback is a one-click operation in the Vercel dashboard. No rebuild required — Vercel promotes a previous deployment to active.

**Steps:**
1. Vercel Dashboard → Project → Deployments
2. Find the last known-good deployment
3. Click "..." → "Promote to Production"
4. Previous deployment is instantly live

### Database Rollback

Prisma does not support automatic down migrations. If a schema migration must be reverted:

1. Write a manual compensation migration: `0005_revert_column_xyz.sql`
2. Run `prisma migrate dev --name revert_column_xyz` in a development environment
3. Test the compensation migration
4. Deploy it via the normal CI pipeline

**Prevention is better than rollback:** Test migrations on staging before production. Design migrations to be additive (add columns, don't drop them immediately).

### Rollback Decision Matrix

| Situation | Action |
|-----------|--------|
| Bug in code, no migration | Rollback code via Vercel (instant) |
| Bug in code, non-destructive migration applied | Rollback code; migration stays (backward compatible) |
| Bug in code, destructive migration applied | Stop; write compensation migration; coordinate manually |
| Performance regression | Rollback code via Vercel; investigate indexes |
| Auth system broken | Rollback code immediately; check session token config |

---

## 10. Monitoring & Alerting

### Error Tracking (Sentry)

```typescript
// instrumentation.ts (Next.js)

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}
```

Sentry is configured to:
- Capture all unhandled errors (client + server)
- Track performance (transactions, web vitals)
- Alert on new error types within 5 minutes
- Alert on error rate spike (>10 errors/minute for a previously rare error)

### Uptime Monitoring

Use a free uptime monitor (UptimeRobot or Better Stack free tier):
- Monitor `https://followback.app/api/v1/health` every 5 minutes
- Alert on non-200 response after 2 consecutive failures
- Alert channel: email + Slack (future)

### Key Metrics to Watch

| Metric | Alert Threshold | Platform |
|--------|----------------|---------|
| Error rate | > 1% of requests | Sentry |
| API response time p95 | > 3000ms | Vercel Analytics |
| Uptime | < 99.5% in any hour | UptimeRobot |
| Database connections | > 80% of pool | Supabase Dashboard |
| Storage usage | > 90% of tier limit | Supabase Dashboard |
| Import failure rate | > 20% | Sentry (custom metric) |

### Performance Monitoring

Vercel Analytics (built in, free):
- Core Web Vitals (LCP, FID, CLS) per page
- Time to First Byte
- Geographic distribution

Custom logging via structured JSON to Vercel Logs:
- Import processing times
- Diff computation times
- Unusual error patterns

---

## 11. Vercel Configuration

### `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Image domains (Google avatars)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // Log server-side only packages (exclude from client bundle)
  serverExternalPackages: ['adm-zip'],

  // Enable compression
  compress: true,

  // Bundle analyser (run with ANALYZE=true npm run build)
  ...(process.env.ANALYZE === 'true' && {
    // @next/bundle-analyzer configuration
  }),
}

export default nextConfig
```

### `vercel.json`

```json
{
  "functions": {
    "app/api/v1/imports/route.ts": {
      "maxDuration": 60
    }
  },
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

The import function gets the maximum 60-second timeout. All other functions default to 10 seconds.

---

## 12. Domain & DNS

### DNS Configuration

```
followback.app          A record → Vercel IP (managed by Vercel)
www.followback.app      CNAME → cname.vercel-dns.com
api.followback.app      Not needed (API is under /api on main domain)
```

### SSL Certificate

Vercel auto-provisions and renews Let's Encrypt certificates for all configured domains. No manual SSL management required.

### Email DNS (for Resend)

```
# Add to DNS for email deliverability:
send._domainkey.followback.app    TXT → DKIM public key (from Resend dashboard)
followback.app                    TXT → "v=spf1 include:sendgrid.net ~all"  # or Resend's SPF
_dmarc.followback.app             TXT → "v=DMARC1; p=quarantine; rua=mailto:dmarc@followback.app"
```
