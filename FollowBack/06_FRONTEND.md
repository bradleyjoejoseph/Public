# 06 — Frontend Specification

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Page Specifications](#2-page-specifications)
3. [Layout System](#3-layout-system)
4. [Component Library](#4-component-library)
5. [Responsive Behaviour](#5-responsive-behaviour)
6. [Dark Mode](#6-dark-mode)
7. [Loading States](#7-loading-states)
8. [Animations](#8-animations)
9. [Accessibility](#9-accessibility)
10. [Performance Budget](#10-performance-budget)
11. [Navigation Structure](#11-navigation-structure)

---

## 1. Architecture Overview

### Rendering Strategy

| Page Type | Rendering | Rationale |
|-----------|-----------|-----------|
| Landing page | Static (SSG) | SEO, zero server cost |
| Sign in / Sign up | Static (SSG) | No personalised content |
| Dashboard | Server Component + Client hydration | Fresh data on each visit |
| List views (non-followers, etc.) | Server Component + Client pagination | Initial data fast, then interactive |
| Import page | Client Component | Real-time upload progress |
| Settings | Server Component | Form pre-population |

### Server Components vs Client Components

**Default to Server Components.** A component is a Client Component (`"use client"`) only if it:
- Uses browser APIs (`window`, `document`, `localStorage`)
- Uses React hooks (`useState`, `useEffect`, etc.)
- Needs event listeners
- Uses TanStack Query

**Data fetching pattern:**
```
Server Component (fetches initial data via service layer)
  └── Client Component (receives initial data as props, augments with TanStack Query)
        └── Interactive UI (search, pagination, modals)
```

---

## 2. Page Specifications

### Landing Page (`/`)

**Purpose:** Convert visitors to sign-ups. Communicate value proposition.

**Sections:**
1. **Hero** — Headline: "Finally know who doesn't follow you back." Sub-headline. Two CTAs: "Get Started Free" and "See How It Works"
2. **Social Proof** — Stat counters (users, imports, relationships analysed)
3. **How It Works** — 3-step horizontal flow: Download Export → Upload → Discover
4. **Features Grid** — 6 feature cards with icons
5. **Privacy Promise** — "Your data never leaves your account" section with trust signals
6. **CTA Banner** — Final conversion section
7. **Footer** — Links, legal, social

**SEO requirements:**
- `<title>FollowBack – Discover Who Doesn't Follow You Back on Instagram</title>`
- Open Graph and Twitter card meta tags
- Structured data (WebApplication schema)
- Sitemap entry

---

### Sign In Page (`/sign-in`)

**Layout:** Centered card on gradient background

**Components:**
- App logo at top
- "Sign in with Google" button (primary, full-width)
- Divider: "or"
- Email field
- Password field with toggle visibility button
- "Forgot password?" link (right-aligned below password)
- "Remember me" checkbox
- "Sign In" button
- "Don't have an account? Sign up" link

**Form validation:**
- Email: valid format required
- Password: non-empty required
- Errors appear below each field (not toast)

**States:**
- Default
- Loading (button spinner, form disabled)
- Error (inline field errors)
- Success (redirect)

---

### Sign Up Page (`/sign-up`)

**Components:**
- App logo
- "Sign up with Google" button
- Divider
- Name field
- Email field
- Password field with strength meter
- Confirm password field
- Terms of Service checkbox with link
- "Create Account" button
- "Already have an account? Sign in" link

**Password strength meter:**
- 4 levels: Too weak / Weak / Good / Strong
- Colour coded: red / orange / yellow / green
- Criteria shown: length ≥ 8, uppercase, number

---

### Dashboard (`/dashboard`)

**Layout:** App shell with sidebar (desktop) / bottom nav (mobile)

**Content structure:**

```
┌─ Header ─────────────────────────────────────────────┐
│  FollowBack logo    @alice_creates    [Import] [User] │
├─ Sidebar ──┬─ Main Content ────────────────────────── │
│            │                                          │
│ Dashboard  │  ┌─ Summary Cards Row ───────────────┐  │
│ Non-Follow │  │ Following | Followers | Mutuals    │  │
│ Non-Follow │  │ Non-Followers | Non-Following      │  │
│ Mutuals    │  └────────────────────────────────────┘  │
│ Changes    │                                          │
│ History    │  ┌─ Quick Stats ─────────────────────┐  │
│            │  │ Last import: 3 days ago            │  │
│ Settings   │  │ [View Changes] [Import Again]      │  │
│            │  └────────────────────────────────────┘  │
│            │                                          │
│            │  ┌─ Follower Trend Chart ────────────┐  │
│            │  │ (if 2+ snapshots, line chart)      │  │
│            │  └────────────────────────────────────┘  │
└────────────┴──────────────────────────────────────────┘
```

**Summary Cards:**
Each card shows: icon, label, count value (large), click target → relevant view

---

### Import Page (`/import`)

**States:**
1. **Empty (no imports yet)** — illustration, explanation, upload zone prominent
2. **Ready to upload** — drag-and-drop zone, browse button, instructions
3. **Uploading** — progress bar, cancel button, file name and size shown
4. **Processing** — animated spinner, "Analysing your follower data..." message
5. **Success** — green check, stats summary (X followers, Y following found), "Go to Dashboard" button
6. **Error** — red icon, error message, specific guidance, "Try Again" button

**Upload zone:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│           📁  Drop your Instagram export here          │
│               or click to browse files                  │
│                                                         │
│         Accepted: .zip files up to 50MB                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Non-Followers View (`/non-followers`)

**Layout:** Full-width table with toolbar

**Toolbar components:**
- Count badge: "247 non-followers"
- Search input: "Search by username..."
- Sort dropdown: "A–Z", "Z–A", "Newest", "Oldest"

**Table columns:**
| Column | Description | Sortable |
|--------|-------------|---------|
| Username | `@handle` linked to Instagram profile | Yes |
| Followed Since | Date or "Unknown" | Yes |
| Actions | "View on Instagram" icon button | No |

**Pagination:** 50 rows per page, previous/next buttons, page indicator

**Empty state:**
- Illustration of two people shaking hands
- Heading: "Everyone follows you back!"
- Sub-text: "All X accounts you follow also follow you."

---

### Non-Following View (`/non-following`)

Identical layout to Non-Followers view. Label: "Not Following Back"

---

### Mutuals View (`/mutuals`)

Identical layout to Non-Followers view. Label: "Mutual Followers"

---

### Snapshot History (`/import/history`)

**Layout:** Timeline list + chart

**Timeline entry:**
```
● Jul 9, 2026, 2:30 PM
  alice_creates
  1,247 followers · 892 following · 203 non-followers
  [View Changes Since This] [Delete]
```

**Chart:** Line chart showing follower count on Y-axis, import date on X-axis. Only shown with 2+ snapshots.

---

### Diff View (`/changes`)

**Layout:** Two dropdowns at top + change summary cards + expandable lists

**Header:**
```
Compare: [Jun 1 snapshot ▼]  →  [Jul 9 snapshot ▼]
         1,100 followers          1,247 followers
```

**Change Cards:**
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ +189         │  │ -42          │  │ +15          │  │ -8           │
│ New Followers│  │ Lost         │  │ New Following│  │ Unfollowed   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

Below cards: expandable accordion sections for each change type with username lists.

---

### Settings (`/settings`)

**Layout:** Sidebar tabs + content area

**Tabs:**
- Profile (display name, email, password)
- Appearance (theme)
- Data (imports list, GDPR actions)
- Danger Zone (delete account)

---

## 3. Layout System

### App Shell

The authenticated app uses a persistent shell layout:

```typescript
// app/(app)/layout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <MobileBottomNav className="md:hidden" />
    </div>
  )
}
```

### Grid System

Based on Tailwind CSS responsive prefixes:
- Mobile: 1 column, `p-4`
- Tablet: 2 columns, `p-6`
- Desktop: 3–4 columns, `p-8`
- Max content width: `max-w-7xl mx-auto`

---

## 4. Component Library

All components are built on shadcn/ui primitives (Radix UI). Do not re-implement primitives that shadcn/ui provides.

### Installed shadcn/ui Components

```
button          card            dialog          dropdown-menu
form            input           label           pagination
progress        separator       skeleton        sonner (toast)
table           tabs            tooltip         badge
avatar          alert           alert-dialog    sheet (mobile nav)
select          switch          checkbox        scroll-area
```

### Custom Components

#### `StatCard`

```typescript
interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
  href?: string
  loading?: boolean
}
```

Displays a metric with optional trend indicator and click-through link.

#### `DataTable`

```typescript
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pagination: PaginationState
  onPaginationChange: (state: PaginationState) => void
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  isLoading?: boolean
  emptyState?: React.ReactNode
}
```

Generic table component with built-in pagination, search, and loading states. Uses TanStack Table internally.

#### `EmptyState`

```typescript
interface EmptyStateProps {
  illustration?: 'followers' | 'import' | 'success' | 'search'
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}
```

#### `FileDropzone`

```typescript
interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  accept: string[]
  maxSizeMB: number
  disabled?: boolean
  error?: string
}
```

Wraps react-dropzone with styled UI matching the design system.

#### `ImportProgress`

Multi-step import progress component showing: upload → validate → process → complete states with animated transitions.

#### `SnapshotSelector`

```typescript
interface SnapshotSelectorProps {
  snapshots: Snapshot[]
  fromId: string
  toId: string
  onFromChange: (id: string) => void
  onToChange: (id: string) => void
}
```

Two linked dropdowns that enforce `from` < `to` ordering.

#### `FollowerTrendChart`

Recharts-based line chart for the dashboard. Responsive, dark-mode aware, with tooltip showing exact counts on hover.

---

## 5. Responsive Behaviour

### Breakpoints (Tailwind defaults)

| Name | Min Width | Use Case |
|------|-----------|----------|
| `sm` | 640px | Large phones landscape |
| `md` | 768px | Tablets, sidebar appears |
| `lg` | 1024px | Desktops, full layout |
| `xl` | 1280px | Wide desktop |

### Navigation

- **Mobile (< 768px):** Bottom tab bar with 5 icons (Dashboard, Non-Followers, Non-Following, Changes, Menu)
- **Tablet+ (≥ 768px):** Left sidebar, collapsed by default, expand on hover or click
- **Desktop (≥ 1024px):** Left sidebar, always expanded with labels

### Tables

On mobile, tables collapse to card layout:
```
@alice_creator         ← username links to Instagram
Followed: Jan 15, 2025
[View on Instagram →]
```

### Summary Cards

- Mobile: 2-column grid
- Tablet: 3-column grid
- Desktop: 3-column or 6-column row

---

## 6. Dark Mode

Implemented via `next-themes` with Tailwind CSS dark mode class strategy.

**Strategy:** `class` (not `media`) — gives users explicit control with a toggle, while defaulting to system preference.

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  // ...
}
```

**Colour variables** are defined in `globals.css` using CSS custom properties for both light and dark themes:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... all shadcn/ui variables ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

**Theme toggle** is in the header (desktop) and settings (mobile). Options: Light / Dark / System.

All charts, illustrations, and custom components must support dark mode. Test in both modes before marking any component as done.

---

## 7. Loading States

Every async data boundary has a defined loading state. Never show a blank screen.

### Skeleton Loading (preferred)

Used for content that has a known shape (tables, cards, stats):

```typescript
// components/shared/LoadingSkeleton/StatCardSkeleton.tsx
export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  )
}
```

### Spinner (secondary)

Used for actions (form submissions, delete confirmations, import processing).

### Error State

After 3 failed retries, show an error card with a "Try again" button and a link to contact support.

### Loading Priorities

| Component | Loading Strategy | Why |
|-----------|-----------------|-----|
| Dashboard stats | Skeleton | Shape is known |
| Data tables | Skeleton rows (5) | Shape is known |
| Charts | Spinner inside chart bounds | Variable height |
| Import processing | Animated progress steps | User expects wait |
| Auth forms | Button spinner | Action-in-progress |

---

## 8. Animations

Use Framer Motion for meaningful transitions. Avoid decorative animations that slow down the user.

### Principles

- **Purposeful** — every animation communicates state change or guides attention
- **Fast** — max 300ms for UI transitions, max 500ms for page transitions
- **Reducible** — respect `prefers-reduced-motion`

```typescript
// lib/utils/motion.ts
import { type Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

export const staggerChildren: Variants = {
  visible: { transition: { staggerChildren: 0.05 } },
}
```

### Used Animations

| Element | Animation | Duration |
|---------|-----------|---------|
| Page content | `fadeIn` | 200ms |
| Summary cards | `staggerChildren` + `slideUp` | 50ms stagger |
| Modal open/close | Scale + fade | 150ms |
| Toast notifications | Slide in from right | 200ms |
| Upload progress bar | Smooth width transition | Continuous |
| Import success state | Checkmark draw | 400ms |
| Number counters | Count-up animation | 1s |

---

## 9. Accessibility

FollowBack targets **WCAG 2.1 AA** compliance.

### Requirements

**Keyboard Navigation**
- All interactive elements reachable and activatable via keyboard
- Visible focus indicator on all focusable elements (not removed with `outline: none` without replacement)
- Logical tab order (matches visual order)
- Modal dialogs trap focus within the dialog
- `Escape` closes all modals and dropdowns

**Screen Readers**
- All images have descriptive `alt` attributes (or `alt=""` for decorative)
- Form inputs have associated `<label>` elements
- Error messages are associated with their fields via `aria-describedby`
- Dynamic content updates use `aria-live` regions
- Icons that convey meaning have `aria-label`; purely decorative icons use `aria-hidden="true"`
- Loading states announced: `aria-busy="true"` on loading containers

**Colour Contrast**
- Normal text: ≥ 4.5:1 contrast ratio
- Large text (≥ 18pt or 14pt bold): ≥ 3:1
- Interactive elements: ≥ 3:1 against backgrounds
- Charts: never use colour alone to convey information (use patterns or labels)

**Motion**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Semantic HTML**
- One `<h1>` per page
- Heading hierarchy: h1 → h2 → h3 (no skipping)
- `<nav>` for navigation regions
- `<main>` for page content
- `<aside>` for sidebar
- Buttons for actions, `<a>` for navigation

**Testing Tools**
- `axe-core` integrated into Playwright E2E tests
- Manual keyboard testing before each release
- VoiceOver (macOS) spot checks on critical flows

---

## 10. Performance Budget

| Metric | Budget | Measurement |
|--------|--------|-------------|
| Largest Contentful Paint (LCP) | < 2.5s | Vercel Analytics |
| First Input Delay (FID) | < 100ms | Vercel Analytics |
| Cumulative Layout Shift (CLS) | < 0.1 | Vercel Analytics |
| Time to First Byte (TTFB) | < 800ms | Vercel Analytics |
| JS bundle (initial, gzipped) | < 150KB | Bundle analyser |
| Total page weight (dashboard) | < 500KB | Chrome DevTools |

### Optimisation Requirements

- All images: Next.js `<Image>` component (lazy loading, modern formats)
- Self-hosted fonts: subset to Latin character set, `font-display: swap`
- No unused CSS: Tailwind purges via content scanning
- Recharts tree-shaken to only imported components
- `dynamic()` imports for heavy components (e.g., chart library) not needed at page load

---

## 11. Navigation Structure

### Sidebar Navigation Items

```
Dashboard          /dashboard
───────────────
Non-Followers      /non-followers
Not Following Back /non-following
Mutual Followers   /mutuals
───────────────
Changes            /changes
Import History     /import/history
───────────────
Import Data        /import          (highlighted CTA button)
───────────────
Settings           /settings
Help               (link to onboarding guide)
```

### Breadcrumb Policy

Breadcrumbs are shown on all pages except the dashboard. Format:

```
Dashboard / Non-Followers
Dashboard / Import / History
Dashboard / Settings / Data
```

### Back Navigation

On mobile, pages with a clear parent show a back chevron in the header. Back navigation uses `router.back()` unless the user navigated directly (e.g., from a bookmark), in which case it links to the parent route.
