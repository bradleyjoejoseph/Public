# 14 — Development Milestones

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09  
> Total Milestones: 20

---

## Overview

Each milestone is designed to be independently completable in a single focused coding session. Milestones are ordered by dependency: complete them in sequence unless noted otherwise.

**Difficulty scale:**
- 🟢 Easy (1–2 hours) — configuration, schema, boilerplate
- 🟡 Medium (2–4 hours) — feature implementation, multiple files
- 🔴 Hard (4–8 hours) — complex algorithms, integration, architecture

---

## Milestone 01 — Project Foundation

**Difficulty:** 🟢 Easy  
**Estimated Time:** 2 hours

### Objective
Bootstrap the Next.js project with all tooling configured and verified working.

### Deliverables
- [ ] Next.js 15 project initialised with TypeScript (`--typescript`) and App Router (`--app`)
- [ ] Tailwind CSS 4 configured with `globals.css` CSS variables (light + dark)
- [ ] shadcn/ui initialised (`npx shadcn@latest init`)
- [ ] ESLint configured per `12_CODING_STANDARDS.md`
- [ ] Prettier configured per `12_CODING_STANDARDS.md`
- [ ] Husky + lint-staged pre-commit hooks configured
- [ ] `tsconfig.json` strict mode enabled, path alias `@/` → `src/`
- [ ] `.env.example` created with all required variables (no values)
- [ ] `.gitignore` includes `.env.local`, `.next`, `node_modules`
- [ ] GitHub repository created, initial commit pushed
- [ ] `README.md` with basic setup instructions

### Acceptance Criteria
- `npm run dev` starts without errors
- `npm run lint` passes with zero warnings
- `npm run type-check` passes
- Tailwind dark mode (`class` strategy) works by toggling `dark` class on `<html>`
- All shadcn/ui base components render correctly in both light and dark mode

---

## Milestone 02 — Database Schema & Prisma Setup

**Difficulty:** 🟢 Easy  
**Estimated Time:** 2 hours

### Objective
Define the complete database schema and establish the Prisma ORM connection.

### Deliverables
- [ ] Supabase project created (EU region, free tier)
- [ ] `prisma/schema.prisma` with complete schema from `04_DATABASE.md`
- [ ] All Prisma models: `User`, `Account`, `Session`, `VerificationToken`, `Import`, `Snapshot`, `SnapshotEntry`, `DiffCache`
- [ ] All enums: `ImportStatus`, `EntryType`
- [ ] All indexes defined in schema
- [ ] `src/lib/db/prisma.ts` — Prisma client singleton with connection pooling
- [ ] Initial migration created and applied to Supabase
- [ ] `prisma/seed.ts` — creates 2 test users with sample snapshots
- [ ] `.env.local` populated with Supabase connection strings

### Acceptance Criteria
- `npx prisma migrate status` shows all migrations applied
- `npx prisma db seed` completes without errors
- `npx prisma studio` opens and shows seeded data
- Prisma generates correct TypeScript types (`npx prisma generate`)

---

## Milestone 03 — Authentication System

**Difficulty:** 🔴 Hard  
**Estimated Time:** 5 hours

### Objective
Implement complete authentication: email/password sign-up/sign-in/out, Google OAuth, email verification, password reset.

### Deliverables
- [ ] Better Auth installed and configured (`src/lib/auth/auth.ts`)
- [ ] Google OAuth provider configured in Google Cloud Console + Better Auth
- [ ] Resend configured for transactional email
- [ ] Better Auth catch-all route: `app/api/v1/auth/[...all]/route.ts`
- [ ] Next.js middleware for session validation and auth guards
- [ ] Sign Up page (`/sign-up`) with email/password form + Google OAuth button
- [ ] Sign In page (`/sign-in`) with email/password + Google OAuth + remember me
- [ ] Forgot Password page (`/forgot-password`)
- [ ] Reset Password page (`/reset-password`)
- [ ] Email Verification page (`/verify-email`)
- [ ] Sign out action (in header, functional)
- [ ] Email verification template (HTML)
- [ ] Password reset template (HTML)

### Acceptance Criteria
- New user can sign up with email, receive verification email, verify, and access the app
- Existing user can sign in and access dashboard
- Google OAuth sign-in creates an account on first use, signs in on subsequent uses
- Password reset flow completes end-to-end (email received, link works, new password works)
- Unauthenticated users accessing `/dashboard` are redirected to `/sign-in`
- After sign-in, users are redirected to the page they originally requested

---

## Milestone 04 — App Shell & Navigation

**Difficulty:** 🟡 Medium  
**Estimated Time:** 3 hours

### Objective
Build the authenticated application shell: sidebar navigation, header, mobile bottom bar, and route group layout.

### Deliverables
- [ ] `app/(app)/layout.tsx` — authenticated layout with sidebar + main area
- [ ] `components/layout/Sidebar.tsx` — full desktop sidebar with all nav items
- [ ] `components/layout/Header.tsx` — top bar with logo, username display, user menu
- [ ] `components/layout/MobileBottomNav.tsx` — bottom tab bar for mobile
- [ ] Theme toggle (light/dark/system) in header (desktop) and settings (mobile)
- [ ] `next-themes` integrated, theme persisted to localStorage
- [ ] Active route highlighting in navigation
- [ ] Sidebar collapses to icon-only on tablet
- [ ] All authenticated routes render inside the app shell
- [ ] Skeleton loading state for shell while session loads

### Acceptance Criteria
- Navigation renders correctly on mobile (< 768px), tablet (768px–1023px), desktop (≥ 1024px)
- Active page is highlighted in the navigation
- Theme toggle works; preference persists across page refresh
- Shell renders within 100ms of page load (no flash of unstyled content)
- Keyboard navigation works through the sidebar

---

## Milestone 05 — Onboarding Flow

**Difficulty:** 🟢 Easy  
**Estimated Time:** 2 hours

### Objective
Build the 3-step onboarding flow shown to new users after first sign-in.

### Deliverables
- [ ] `app/(app)/onboarding/page.tsx` — 3-step flow
- [ ] Step 1: Welcome (what FollowBack does, key benefits)
- [ ] Step 2: How to download Instagram data export (step-by-step, with numbered instructions)
- [ ] Step 3: "Ready to import?" with CTA
- [ ] Progress indicator (1 of 3, 2 of 3, etc.)
- [ ] "Skip" option on each step
- [ ] `PATCH /api/v1/users/me` endpoint with `onboardingCompleted: true`
- [ ] Redirect to `/import` on completion
- [ ] Onboarding is skipped for returning users (`onboardingCompleted === true`)
- [ ] Onboarding accessible again via Settings → Help

### Acceptance Criteria
- New users are redirected to `/onboarding` after email verification
- Returning users go directly to `/dashboard`
- "Skip" on any step marks onboarding complete and redirects to dashboard
- Onboarding progress indicator updates on each step
- Instructions on Step 2 are clear enough for a non-technical user to find their Instagram export

---

## Milestone 06 — Import Provider Interface & Instagram Parser

**Difficulty:** 🔴 Hard  
**Estimated Time:** 6 hours

### Objective
Build the core import system: the provider interface, the Instagram export parser, and all validation logic.

### Deliverables
- [ ] `src/lib/import/types.ts` — `ImportProvider`, `ImportInput`, `ParsedFollowerData`, `FollowerEntry`, `ValidationResult` interfaces
- [ ] `src/lib/import/registry.ts` — provider registry with `register`, `getProvider`, `getDefaultProvider`
- [ ] `src/lib/import/providers/instagram-export/index.ts` — `InstagramExportProvider` class
- [ ] `src/lib/import/providers/instagram-export/validator.ts` — ZIP validation (magic bytes, compression ratio, required files)
- [ ] `src/lib/import/providers/instagram-export/parser.ts` — JSON parsing with format variant handling
- [ ] Unit tests for all parser functions (≥ 95% line coverage)
- [ ] Unit tests for validator functions (all error paths covered)
- [ ] Test fixtures: sample Instagram export ZIPs (small, paginated, HTML format, corrupted)

### Acceptance Criteria
- Parser correctly extracts followers and following from a real Instagram export ZIP
- Parser handles paginated follower files (`followers_1.json`, `followers_2.json`, etc.)
- Validator rejects: non-ZIP files, HTML exports, corrupted ZIPs, ZIP bombs, ZIPs with executables
- Validator accepts: valid Instagram export ZIPs (multiple format versions)
- All unit tests pass: `npm run test:unit`
- Parser handles 10,000 entries in < 2 seconds

---

## Milestone 07 — Storage Service

**Difficulty:** 🟡 Medium  
**Estimated Time:** 2 hours

### Objective
Implement the Supabase Storage integration for uploading and managing import ZIP files.

### Deliverables
- [ ] Supabase Storage bucket created (`user-imports`, private, 50MB limit)
- [ ] Bucket RLS policy configured (defence in depth)
- [ ] `src/services/storage.service.ts` — `StorageService` with `upload`, `delete`, `deleteUserFolder`, `getSignedUrl`
- [ ] `src/lib/storage/supabase-storage.ts` — Supabase client initialisation (service role key for server-side)
- [ ] Unit tests for `StorageService` using a mock Supabase client
- [ ] File path convention: `imports/{userId}/{importId}/export.zip`

### Acceptance Criteria
- `storageService.upload()` successfully uploads a ZIP file and returns the storage key
- `storageService.delete()` removes the file from the bucket
- `storageService.getSignedUrl()` returns a time-limited URL (15 minutes)
- Files are not accessible without a signed URL (bucket is private)
- Unit tests pass with mock client

---

## Milestone 08 — Import Service & API Route

**Difficulty:** 🔴 Hard  
**Estimated Time:** 5 hours

### Objective
Wire together the storage service and import provider into a complete import pipeline, exposed via an API route.

### Deliverables
- [ ] `src/services/import.service.ts` — `ImportService` with `processUpload` and `listByUser`
- [ ] `src/repositories/import.repository.ts` — `ImportRepository`
- [ ] `src/repositories/snapshot.repository.ts` — `SnapshotRepository` with `createWithEntries` (batch insert)
- [ ] `src/services/snapshot.service.ts` — `SnapshotService` with `createFromParsedData`
- [ ] `src/lib/utils/api-handler.ts` — `withErrorHandler` and `requireAuth` utilities
- [ ] `app/api/v1/imports/route.ts` — `POST` (upload) and `GET` (list) handlers
- [ ] `app/api/v1/imports/[id]/route.ts` — `DELETE` handler
- [ ] Rate limiting middleware on import POST (5/hour per user)
- [ ] Integration tests for the full import pipeline
- [ ] Handles deduplication, batch insert, transaction safety

### Acceptance Criteria
- `POST /api/v1/imports` with a valid Instagram export ZIP returns `201` with snapshot stats
- `POST /api/v1/imports` with an invalid ZIP returns `400` with a specific error message
- `POST /api/v1/imports` with a file > 50MB returns `413`
- Import creates correct `snapshot_entries` records in the database
- Failed imports clean up their storage files
- 5th import in 1 hour returns `429`
- Integration tests pass

---

## Milestone 09 — Snapshot Service & List API Routes

**Difficulty:** 🟡 Medium  
**Estimated Time:** 3 hours

### Objective
Build the snapshot query API: listing snapshots, fetching the latest, and all four relationship lists (followers, following, non-followers, non-following, mutuals).

### Deliverables
- [ ] `app/api/v1/snapshots/route.ts` — `GET` (list all snapshots)
- [ ] `app/api/v1/snapshots/latest/route.ts` — `GET` (latest snapshot with computed stats)
- [ ] `app/api/v1/snapshots/[id]/route.ts` — `GET` (single snapshot)
- [ ] `app/api/v1/snapshots/[id]/non-followers/route.ts` — `GET` (paginated)
- [ ] `app/api/v1/snapshots/[id]/non-following/route.ts` — `GET` (paginated)
- [ ] `app/api/v1/snapshots/[id]/mutuals/route.ts` — `GET` (paginated)
- [ ] `app/api/v1/snapshots/[id]/followers/route.ts` — `GET` (paginated)
- [ ] `app/api/v1/snapshots/[id]/following/route.ts` — `GET` (paginated)
- [ ] Pagination query param parsing via `paginationSchema`
- [ ] Search filtering via `search` query param
- [ ] Integration tests for all endpoints (auth, ownership, pagination)

### Acceptance Criteria
- All endpoints require authentication (401 if no session)
- All endpoints return 404 if the resource belongs to another user (not 403)
- Pagination works correctly (correct total, page, hasNext, hasPrev)
- Search filters by `instagramUsername` case-insensitively
- `GET /api/v1/snapshots/latest` returns correct `nonFollowerCount`, `nonFollowingCount`, `mutualCount`

---

## Milestone 10 — Diff Service & API Route

**Difficulty:** 🔴 Hard  
**Estimated Time:** 4 hours

### Objective
Build the snapshot diff algorithm, caching layer, and API endpoint.

### Deliverables
- [ ] `src/lib/diff/snapshot-diff.ts` — `computeSnapshotDiff` function
- [ ] `src/lib/diff/snapshot-analysis.ts` — `computeSnapshotAnalysis` function
- [ ] `src/services/diff.service.ts` — `DiffService` with cache check + compute + cache store
- [ ] `src/repositories/diff-cache.repository.ts` — `DiffCacheRepository`
- [ ] `app/api/v1/diff/route.ts` — `GET` endpoint with `from` and `to` query params
- [ ] Unit tests for diff algorithm (all edge cases from `10_TESTING.md`)
- [ ] Performance test: 50,000 entries diffed in < 500ms
- [ ] Cache hit test: second call returns `cached: true`

### Acceptance Criteria
- Diff correctly identifies new followers, lost followers, new following, unfollowed
- Case-insensitive username comparison
- Empty snapshots handled without errors
- Diff is cached after first computation
- Cache is used on subsequent requests (verified by `cached: true` in response)
- Both snapshot IDs must belong to the authenticated user (404 if not)
- `from` must be older than `to` (400 if not)

---

## Milestone 11 — Dashboard Page

**Difficulty:** 🟡 Medium  
**Estimated Time:** 3 hours

### Objective
Build the main dashboard page with summary stat cards and follower trend chart.

### Deliverables
- [ ] `app/(app)/dashboard/page.tsx` — Server Component fetching latest snapshot
- [ ] `components/features/dashboard/StatCard.tsx` — reusable stat card with icon, label, value, link
- [ ] `components/features/dashboard/DashboardStats.tsx` — 5-card grid
- [ ] `components/features/dashboard/FollowerTrendChart.tsx` — Recharts area chart
- [ ] `components/features/dashboard/EmptyDashboard.tsx` — empty state (no imports)
- [ ] `components/shared/LoadingSkeleton/` — skeleton variants for all dashboard components
- [ ] Dashboard shows: followers, following, non-followers, non-following, mutuals, last import date
- [ ] "View Changes" button (disabled with tooltip if < 2 snapshots)
- [ ] "Import New Export" CTA

### Acceptance Criteria
- Dashboard loads in < 2 seconds (including SSR)
- Empty state shown when user has 0 snapshots
- Trend chart appears when user has 2+ snapshots
- All stat cards link to the correct sub-views
- Skeleton loaders shown during any client-side refetch
- Dashboard looks correct in both light and dark mode

---

## Milestone 12 — Relationship List Views

**Difficulty:** 🟡 Medium  
**Estimated Time:** 4 hours

### Objective
Build the four relationship list pages: Non-Followers, Non-Following, Mutuals, and a shared base component.

### Deliverables
- [ ] `components/features/followers/FollowerDataTable.tsx` — shared table with pagination, search, sort
- [ ] `app/(app)/non-followers/page.tsx`
- [ ] `app/(app)/non-following/page.tsx`
- [ ] `app/(app)/mutuals/page.tsx`
- [ ] Search input (debounced, 300ms, client-side)
- [ ] Sort dropdown (A–Z, Z–A, Newest, Oldest)
- [ ] Pagination controls (prev/next + page indicator)
- [ ] "View on Instagram" link per row (opens in new tab, `rel="noopener noreferrer"`)
- [ ] Count badge in page header
- [ ] Empty states for each view
- [ ] Mobile card layout for < 640px

### Acceptance Criteria
- All three pages load and display correct data for the logged-in user's latest snapshot
- Search filters correctly and debounces (no request on each keystroke)
- Pagination works: correct page count, prev/next disable at boundaries
- Table is accessible (keyboard navigable, screen reader compatible)
- Mobile card layout renders correctly on 375px screen width

---

## Milestone 13 — Import Page & Upload UI

**Difficulty:** 🟡 Medium  
**Estimated Time:** 3 hours

### Objective
Build the full import UI: drag-and-drop upload zone, progress tracking, all states.

### Deliverables
- [ ] `app/(app)/import/page.tsx` — main import page
- [ ] `components/features/import/FileDropzone.tsx` — drag-and-drop + browse
- [ ] `components/features/import/ImportProgress.tsx` — multi-step progress (upload → process → complete)
- [ ] Client-side file validation before upload (type, size)
- [ ] XHR upload with progress percentage (not `fetch` — fetch doesn't expose upload progress)
- [ ] Cancel upload support
- [ ] All states: empty, uploading (with %), processing, success, error
- [ ] Error messages are specific (matches error codes from API)
- [ ] Success state shows: follower count, following count found
- [ ] "Go to Dashboard" button on success

### Acceptance Criteria
- File can be selected via both drag-and-drop and file browser
- Upload progress bar is smooth and accurate
- Invalid files (wrong type, too large) show immediate client-side error without uploading
- Network failure during upload shows error with retry option
- Processing state shows while API is working
- Success state matches the counts from the created snapshot

---

## Milestone 14 — Import History & Snapshot Timeline

**Difficulty:** 🟡 Medium  
**Estimated Time:** 2 hours

### Objective
Build the import history view showing all past imports as a timeline with a trend chart.

### Deliverables
- [ ] `app/(app)/import/history/page.tsx`
- [ ] `components/features/import/ImportHistoryList.tsx` — timeline list of imports
- [ ] `components/features/import/ImportHistoryItem.tsx` — single import entry
- [ ] Delete snapshot button + confirmation dialog
- [ ] Follower trend chart (same chart component as dashboard, reused)
- [ ] Empty state (no imports yet)
- [ ] "Compare" link on each import (links to `/changes?from=X&to=Y`)

### Acceptance Criteria
- All imports shown, newest first
- Each import shows: date, time, Instagram username (if detected), follower count, following count
- Delete confirmation dialog matches spec from PRD
- On delete, import and snapshot are removed from the list
- Trend chart appears with 2+ imports

---

## Milestone 15 — Diff / Changes View

**Difficulty:** 🟡 Medium  
**Estimated Time:** 3 hours

### Objective
Build the diff view with snapshot selectors and change summary cards.

### Deliverables
- [ ] `app/(app)/changes/page.tsx` — with `from` and `to` query params
- [ ] `components/features/diff/SnapshotSelector.tsx` — two linked dropdowns
- [ ] `components/features/diff/DiffSummaryCards.tsx` — 4 change cards + net change
- [ ] `components/features/diff/DiffList.tsx` — expandable accordion list per change type
- [ ] "To" must be newer than "From" (enforced in dropdown)
- [ ] Defaults to most recent two snapshots on page load
- [ ] "No changes" empty state
- [ ] Loading skeleton while diff is computed

### Acceptance Criteria
- Diff view loads correctly when navigated to from "View Changes" CTA
- Snapshot dropdowns are pre-populated with the two most recent snapshots
- Change counts are correct (validated against known test data)
- Each change list accordion expands to show affected usernames
- Each username in the lists links to their Instagram profile
- Changing either dropdown triggers a new diff request

---

## Milestone 16 — Account Settings

**Difficulty:** 🟡 Medium  
**Estimated Time:** 3 hours

### Objective
Build the settings pages: profile editing, theme, and data management (GDPR flows).

### Deliverables
- [ ] `app/(app)/settings/page.tsx` — tabs for Profile, Appearance, Data, Danger Zone
- [ ] `app/(app)/settings/profile/page.tsx` — display name and email editing
- [ ] `app/(app)/settings/data/page.tsx` — import history summary, GDPR actions
- [ ] Password change form (requires current password)
- [ ] Email change (sends verification to new email)
- [ ] "Download my data" button → calls `POST /api/v1/users/me/data-export`
- [ ] "Delete all snapshots" with confirmation
- [ ] "Delete account" with "DELETE" text confirmation
- [ ] All delete flows work end-to-end
- [ ] `DELETE /api/v1/users/me` API route implemented
- [ ] `POST /api/v1/users/me/data-export` API route implemented

### Acceptance Criteria
- Display name update saves and reflects immediately in the header
- Delete account flow: types "DELETE", confirms, account is fully deleted, redirected to landing page
- GDPR data export downloads a JSON file containing all user snapshots
- All danger zone actions require explicit confirmation

---

## Milestone 17 — Health Check & Error Pages

**Difficulty:** 🟢 Easy  
**Estimated Time:** 1 hour

### Deliverables
- [ ] `app/api/v1/health/route.ts` — health check endpoint
- [ ] `app/not-found.tsx` — custom 404 page (matches app shell styles)
- [ ] `app/error.tsx` — global error boundary (graceful error page)
- [ ] Per-route `error.tsx` in `app/(app)/` (feature-specific errors)
- [ ] `app/loading.tsx` — root loading fallback

### Acceptance Criteria
- `GET /api/v1/health` returns `{ status: 'ok' }` with 200
- `GET /api/v1/health` returns `{ status: 'degraded' }` with 503 when database is unreachable
- 404 page matches the app's visual design
- Error page shows a friendly message with a "Go home" link (not a stack trace in production)

---

## Milestone 18 — End-to-End Tests & Accessibility Audit

**Difficulty:** 🟡 Medium  
**Estimated Time:** 3 hours

### Objective
Write the critical E2E test suite and fix any accessibility violations found during audit.

### Deliverables
- [ ] Playwright configured (`playwright.config.ts`)
- [ ] E2E test: first-time user import flow (sign up → import → see dashboard)
- [ ] E2E test: returning user compares two imports (diff view)
- [ ] E2E test: account deletion (all data removed)
- [ ] E2E test: all critical navigation paths
- [ ] Accessibility audit with `axe-core` on: landing page, dashboard, import page, non-followers list
- [ ] All WCAG 2.1 AA violations fixed
- [ ] E2E tests pass in CI

### Acceptance Criteria
- All 4 E2E test scenarios pass locally and in CI
- Axe-core reports zero WCAG AA violations on audited pages
- Skip navigation link works on all authenticated pages
- All interactive elements reachable by keyboard

---

## Milestone 19 — Performance Optimisation & Security Hardening

**Difficulty:** 🟡 Medium  
**Estimated Time:** 3 hours

### Objective
Ensure the application meets the performance budget and all security headers are in place.

### Deliverables
- [ ] Security headers added to `next.config.ts` (all from `09_SECURITY.md`)
- [ ] Bundle analyser run; no unnecessary large packages in client bundle
- [ ] `adm-zip` confirmed as `serverExternalPackages` (not bundled to client)
- [ ] All images use `<Image>` component with explicit `width`/`height`
- [ ] Fonts self-hosted and subsetted
- [ ] Lighthouse audit on dashboard: ≥ 90 Performance, ≥ 90 Accessibility, 100 Best Practices
- [ ] Rate limiting verified on staging (hit limits with test script)
- [ ] Zip bomb test: upload a 1KB file that decompresses to 1GB → rejected with error
- [ ] IDOR test: attempt to access another user's snapshot → returns 404

### Acceptance Criteria
- Lighthouse scores meet targets
- Initial JS bundle (gzipped) < 150KB
- All security headers present (verified with securityheaders.com)
- ZIP bomb rejected before causing memory issues
- IDOR vulnerability confirmed absent

---

## Milestone 20 — Production Launch

**Difficulty:** 🟡 Medium  
**Estimated Time:** 4 hours

### Objective
Deploy to production, configure monitoring, and confirm the full system works end-to-end.

### Deliverables
- [ ] Production Supabase project created (EU region)
- [ ] Vercel project created and linked to GitHub `main` branch
- [ ] All production environment variables set in Vercel
- [ ] Custom domain `followback.app` configured and SSL active
- [ ] DNS records for email deliverability (SPF, DKIM, DMARC) configured
- [ ] Sentry project created; DSN configured in production env
- [ ] UptimeRobot monitoring `https://followback.app/api/v1/health` every 5 minutes
- [ ] GitHub CI/CD pipeline confirmed working (push to main → auto-deploy)
- [ ] Full end-to-end test on production (sign up with real email, import real export ZIP, verify all views)
- [ ] Privacy policy page published at `/privacy`
- [ ] Terms of service page published at `/terms`
- [ ] `security.txt` at `/.well-known/security.txt`

### Acceptance Criteria
- Production deployment live and accessible at `https://followback.app`
- Full sign-up → import → dashboard flow works with a real Instagram export
- Sentry receives test error (verify monitoring is active)
- UptimeRobot shows 100% uptime check passing
- Email deliverability test passes (no spam folder, SPF/DKIM pass)
- All 20 milestones' acceptance criteria verified in production
