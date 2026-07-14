# 13 — UI/UX Design Language

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Colour Palette](#2-colour-palette)
3. [Typography](#3-typography)
4. [Spacing System](#4-spacing-system)
5. [Component Design Language](#5-component-design-language)
6. [Iconography](#6-iconography)
7. [Illustration Style](#7-illustration-style)
8. [Interaction Design](#8-interaction-design)
9. [Responsive Design Patterns](#9-responsive-design-patterns)
10. [Accessibility Design](#10-accessibility-design)
11. [Empty States](#11-empty-states)
12. [Data Visualisation](#12-data-visualisation)
13. [Page-Specific Design Notes](#13-page-specific-design-notes)

---

## 1. Design Principles

### Clarity over cleverness

Every UI decision serves the user's goal: understanding their Instagram follower relationships quickly and accurately. Remove anything that doesn't serve that goal.

### Data-forward

Numbers are the product. Typography and layout must let counts, usernames, and trend lines breathe. White space is not wasted space.

### Trust through restraint

Users are sharing personal social data. The UI communicates trustworthiness through clean design, honest labels, and no dark patterns. We never hide the "Delete all data" button.

### Speed feels like care

Loading states are thoughtfully designed. Transitions are purposeful. The user should never feel like they're waiting or confused about what is happening.

---

## 2. Colour Palette

FollowBack uses a neutral base with a purposeful accent. The palette works in both light and dark mode.

### Brand Colours

```css
/* Primary brand accent — Instagram-adjacent purple-blue gradient */
--brand-primary: #6366F1;       /* Indigo 500 */
--brand-primary-dark: #4F46E5;  /* Indigo 600 */
--brand-secondary: #8B5CF6;     /* Violet 500 — for gradients */

/* Brand gradient */
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
```

### Semantic Colours

```css
/* Success — new followers, positive changes */
--color-success: #10B981;        /* Emerald 500 */
--color-success-light: #D1FAE5;  /* Emerald 100 */

/* Destructive — lost followers, delete actions */
--color-destructive: #EF4444;    /* Red 500 */
--color-destructive-light: #FEE2E2; /* Red 100 */

/* Warning — import errors, validation warnings */
--color-warning: #F59E0B;        /* Amber 500 */
--color-warning-light: #FEF3C7;  /* Amber 100 */

/* Neutral — non-followers (not good/bad, just informational) */
--color-neutral: #6B7280;        /* Gray 500 */
```

### Light Mode Palette

```css
:root {
  --background: #FFFFFF;
  --foreground: #111827;          /* Gray 900 */
  --card: #FFFFFF;
  --card-foreground: #111827;
  --popover: #FFFFFF;
  --popover-foreground: #111827;
  --primary: #6366F1;             /* Indigo 500 */
  --primary-foreground: #FFFFFF;
  --secondary: #F3F4F6;           /* Gray 100 */
  --secondary-foreground: #1F2937; /* Gray 800 */
  --muted: #F9FAFB;               /* Gray 50 */
  --muted-foreground: #6B7280;    /* Gray 500 */
  --accent: #EEF2FF;              /* Indigo 50 */
  --accent-foreground: #4338CA;   /* Indigo 700 */
  --border: #E5E7EB;              /* Gray 200 */
  --input: #E5E7EB;
  --ring: #6366F1;
  --radius: 0.5rem;
}
```

### Dark Mode Palette

```css
.dark {
  --background: #0F172A;          /* Slate 900 */
  --foreground: #F1F5F9;          /* Slate 100 */
  --card: #1E293B;                /* Slate 800 */
  --card-foreground: #F1F5F9;
  --popover: #1E293B;
  --popover-foreground: #F1F5F9;
  --primary: #818CF8;             /* Indigo 400 — lighter for dark mode */
  --primary-foreground: #0F172A;
  --secondary: #1E293B;           /* Slate 800 */
  --secondary-foreground: #CBD5E1; /* Slate 300 */
  --muted: #1E293B;
  --muted-foreground: #64748B;    /* Slate 500 */
  --accent: #1E293B;
  --accent-foreground: #818CF8;
  --border: #334155;              /* Slate 700 */
  --input: #334155;
  --ring: #818CF8;
}
```

### Colour Usage Rules

- **Primary colour** (`--primary`): CTAs, active nav items, links, focus rings
- **Muted** (`--muted`): Background for cards in dark sections, table row hover
- **Destructive** (`--color-destructive`): Delete buttons, error states, lost follower counts
- **Success** (`--color-success`): New follower counts, completion states
- **Never** use colour as the only indicator — pair with icon or text label

---

## 3. Typography

### Font Stack

```css
/* Primary font: Geist (Vercel's font — free, excellent for data-heavy UIs) */
--font-sans: 'Geist', system-ui, -apple-system, sans-serif;

/* Monospace: for usernames (Instagram handles), numbers, code */
--font-mono: 'Geist Mono', 'Fira Code', 'Cascadia Code', monospace;
```

**Why Geist?** It's open source, optimised for screen reading, excellent at small sizes for table data, and has a matching mono variant for usernames.

**Self-host**: Download from vercel.com/font and serve from `public/fonts/`. Never load from Google Fonts (privacy, CSP complexity).

### Type Scale

Uses Tailwind's default type scale:

| Class | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| `text-xs` | 12px | 400 | 1.5 | Labels, metadata, timestamps |
| `text-sm` | 14px | 400 | 1.5 | Table body, secondary text |
| `text-base` | 16px | 400 | 1.5 | Body copy, form inputs |
| `text-lg` | 18px | 500 | 1.4 | Card headings |
| `text-xl` | 20px | 600 | 1.3 | Page sub-headings |
| `text-2xl` | 24px | 600 | 1.2 | Stat card values |
| `text-3xl` | 30px | 700 | 1.2 | Dashboard hero numbers |
| `text-4xl` | 36px | 800 | 1.1 | Landing page headline |

### Username Display

Instagram usernames (`@handle`) are displayed in monospace font to aid scanning:

```tsx
<span className="font-mono text-sm text-foreground">@alice_creates</span>
```

### Number Display

Large statistics use tabular numbers to prevent layout shift when values change:

```css
.stat-value {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}
```

---

## 4. Spacing System

Tailwind's spacing scale (4px base unit). Use only Tailwind spacing utilities — no arbitrary pixel values.

### Common Spacing Patterns

```
Component internal padding:  p-4 (16px) for cards, p-3 (12px) for buttons
Section gaps:                gap-6 (24px) between cards, gap-4 between list items  
Page margins:                px-4 (mobile), px-6 (tablet), px-8 (desktop)
Page max-width:              max-w-7xl mx-auto
Stack spacing:               space-y-4 for form fields, space-y-6 for page sections
```

### Grid System

```css
/* Dashboard summary cards */
grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4

/* Settings tabs + content */
grid-cols-1 md:grid-cols-[200px_1fr] gap-8
```

---

## 5. Component Design Language

### Cards

Cards are the primary content container. Two variants:

**Default card:** White background, subtle border, gentle shadow
```html
<div class="rounded-lg border border-border bg-card p-6 shadow-sm">
```

**Elevated card (for stat cards):** Stronger shadow, hover lift effect
```html
<div class="rounded-lg border border-border bg-card p-6 shadow-md 
            transition-shadow hover:shadow-lg cursor-pointer">
```

### Buttons

Four variants from shadcn/ui, with consistent sizing:

| Variant | Use Case | Appearance |
|---------|----------|------------|
| `default` | Primary actions (Import, Save) | Filled, brand colour |
| `secondary` | Secondary actions (Cancel, Back) | Outlined or ghost |
| `destructive` | Delete actions | Filled, red |
| `ghost` | Tertiary actions in tables (View on Instagram) | Text-only with hover |

**Button sizing:**
- `size="lg"` — Hero CTAs (landing page, empty states)
- `size="default"` — Standard form actions
- `size="sm"` — Table row actions, compact UIs
- `size="icon"` — Icon-only buttons (must have `aria-label`)

### Form Controls

All form inputs follow this pattern:
- 8px border-radius (`rounded-md`)
- 40px height for standard inputs
- Visible focus ring (brand colour)
- Error state: red border + red helper text below
- Disabled state: reduced opacity + `cursor-not-allowed`

```html
<div class="space-y-2">
  <label class="text-sm font-medium text-foreground" for="email">
    Email address
  </label>
  <input
    class="w-full rounded-md border border-input bg-background px-3 py-2 
           text-sm ring-offset-background
           focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
           disabled:cursor-not-allowed disabled:opacity-50"
    id="email" type="email" />
  <p class="text-sm text-destructive">This field is required</p>
</div>
```

### Tables

Data tables have:
- Sticky header on scroll
- Alternating row colour in light mode (every other row: `bg-muted/50`)
- Row hover: `hover:bg-muted transition-colors`
- Column headers: `text-xs uppercase tracking-wider text-muted-foreground`

### Badges

Used for counts, status indicators, and labels:

```html
<!-- Follower count badge -->
<span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
  1,247 followers
</span>

<!-- Status badges -->
<span class="bg-success-light text-success rounded-full px-2 py-0.5 text-xs">Completed</span>
<span class="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs">Failed</span>
```

### Navigation (Sidebar)

```
Width: 240px (expanded), 64px (collapsed icon-only on tablet)
Background: var(--background) or var(--card)
Active item: bg-accent text-accent-foreground rounded-md
Hover item: bg-muted rounded-md transition-colors
Icon size: 20px (h-5 w-5)
Item height: 40px (h-10)
```

The "Import Data" nav item is styled as a button (brand background) to draw attention.

---

## 6. Iconography

**Library:** Lucide React (consistent, well-maintained, MIT licensed)

### Icon Assignments

| UI Element | Lucide Icon |
|-----------|-------------|
| Dashboard | `LayoutDashboard` |
| Non-followers | `UserX` |
| Non-following | `UserCheck` |
| Mutuals | `Users` |
| Changes / Diff | `GitCompare` |
| Import History | `History` |
| Import (action) | `Upload` |
| Settings | `Settings` |
| Delete | `Trash2` |
| View on Instagram | `ExternalLink` |
| Search | `Search` |
| Sort | `ArrowUpDown` |
| Success | `CheckCircle2` |
| Error | `XCircle` |
| Warning | `AlertTriangle` |
| Info | `Info` |
| Followers (stat) | `UserRound` |
| Following (stat) | `UserRoundCheck` |
| Close / Cancel | `X` |
| Menu (mobile) | `Menu` |
| Theme toggle | `Sun` / `Moon` / `Monitor` |

### Icon Sizing

- In buttons: `h-4 w-4` with `mr-2` margin if text follows
- Standalone icons (nav): `h-5 w-5`
- Large decorative icons (empty states): `h-12 w-12` or `h-16 w-16`
- Always pair standalone icons with `aria-hidden="true"` if label is nearby, or `aria-label` if standalone

---

## 7. Illustration Style

Empty states and onboarding use custom illustrations. Style guidelines:

- **Style:** Simple, geometric, line-based SVG illustrations
- **Colour:** Uses brand colours with light tints; adapts to dark mode via CSS variable fills
- **Subjects:** Abstract representations of social connections (people, arrows, network graphs)
- **NOT:** Photos, complex illustrations, culturally-specific figures

Illustrations are implemented as React SVG components (not `<img>` tags) so they inherit CSS variables for dark mode compatibility.

```tsx
// components/shared/illustrations/EmptyFollowers.tsx
export function EmptyFollowersIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={cn('text-primary', className)} aria-hidden="true">
      {/* SVG paths using currentColor and CSS variables */}
    </svg>
  )
}
```

---

## 8. Interaction Design

### Micro-interactions

| Trigger | Response | Duration |
|---------|---------|---------|
| Button click | Scale down 0.97 | 100ms |
| Card hover | Shadow elevation increase | 150ms |
| Nav item hover | Background fade in | 100ms |
| Row hover | Background tint | 100ms |
| Modal open | Scale 0.95 → 1.0 + fade | 150ms |
| Modal close | Fade out | 100ms |
| Toast appear | Slide in from right | 200ms |
| Toast dismiss | Fade + slide out | 150ms |
| Number counter | Count-up animation | 1000ms ease-out |
| Progress bar | Smooth width transition | Live |

### Confirmation Patterns

Actions with irreversible consequences require confirmation:

| Action | Confirmation Type |
|--------|------------------|
| Delete snapshot | Alert dialog with description |
| Delete all snapshots | Alert dialog with description |
| Delete account | Alert dialog + type "DELETE" |
| Cancel import in progress | Simple confirm dialog |

Confirmation dialogs follow the pattern:
- Clear headline: "Delete this snapshot?"
- Description explaining consequences: "This will permanently delete the snapshot from July 9 and its 1,247 follower records. This cannot be undone."
- Two buttons: Cancel (secondary) + Confirm action (destructive)
- Destructive button is NOT the default focused button

### Loading Feedback

Rule: Any action taking > 200ms shows a loading indicator.

| Duration | Indicator |
|----------|-----------|
| < 200ms | None (feels instant) |
| 200ms–1s | Button spinner (disable button, show spinner in place of icon) |
| 1s–10s | Button spinner + progress or status message |
| > 10s | Full-page or card loading state with descriptive message |

---

## 9. Responsive Design Patterns

### Navigation Pattern

```
Mobile (< 768px):
  - Fixed bottom bar: [Dashboard] [Non-followers] [Import] [Changes] [More]
  - "More" opens a drawer with remaining navigation items
  - Top bar: Logo + User avatar + Notifications (future)

Tablet (768px–1023px):
  - Left sidebar, icon-only (64px wide)
  - Hovering expands to full sidebar temporarily
  - Sidebar collapses automatically on route change

Desktop (≥ 1024px):
  - Full sidebar always visible (240px)
  - No toggle needed
```

### Table to Card Pattern (mobile)

On screens < 640px, data tables collapse to card lists:

```
Desktop:
┌─────────────┬──────────────────┬────────────┐
│ Username    │ Followed Since   │ Actions    │
├─────────────┼──────────────────┼────────────┤
│ @alice      │ Jan 15, 2025     │ [→]        │
└─────────────┴──────────────────┴────────────┘

Mobile:
┌─────────────────────────────────────────────┐
│ @alice                          [→ Instagram]│
│ Followed since: Jan 15, 2025                │
└─────────────────────────────────────────────┘
```

### Form Layout

- Mobile: Full-width, single column
- Tablet+: Two-column where logical (e.g., First name / Last name)
- Max form width: 480px (centred on wide screens)

---

## 10. Accessibility Design

### Focus Indicators

Never remove focus outlines. Custom focus ring:

```css
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: var(--radius);
}
```

### Colour Contrast Checklist

All text must meet WCAG AA:
- Body text on `--background`: `--foreground` → ≥ 7:1 (AAA target)
- Muted text on `--background`: `--muted-foreground` → ≥ 4.5:1
- White on `--primary` (buttons): ≥ 4.5:1
- `--color-success` on white: verify and adjust if needed
- Charts: never use colour alone; include labels and patterns

### Interactive Element Sizing

Minimum touch target: 44×44px. Achieved by:
- All buttons: `min-h-[44px]`
- Table row action icons: wrapped in `<button>` with `p-2` padding
- Nav items: `h-10` (40px) with adequate padding

### Screen Reader Landmarks

```html
<body>
  <header role="banner">...</header>
  <nav aria-label="Main navigation">...</nav>
  <main id="main-content">
    <h1>Dashboard</h1>
    ...
  </main>
  <aside aria-label="Quick actions">...</aside>
</body>
```

Skip navigation link (first focusable element on every page):
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 ...">
  Skip to main content
</a>
```

---

## 11. Empty States

Every empty state includes: illustration, headline, description, and a primary action.

| State | Illustration | Headline | Description | CTA |
|-------|-------------|---------|-------------|-----|
| No imports | Upload cloud | "Start by importing your data" | "Download your Instagram data export and upload it here." | "Import Data" |
| No non-followers | Two people shaking hands | "Everyone follows you back!" | "All X accounts you follow also follow you." | "Import Again" |
| No non-following | Checkmark in circle | "You follow everyone back!" | — | "Import Again" |
| No mutuals | Empty network | "No mutual followers yet" | — | — |
| No changes | Two identical charts | "No changes detected" | "These two snapshots appear identical." | "Select Different Snapshots" |
| Search no results | Magnifier | "No results for '...'" | "Try a different search term." | Clear Search |
| Import failed | Warning triangle | "Import failed" | Specific error message | "Try Again" |

---

## 12. Data Visualisation

### Follower Trend Chart

- **Library:** Recharts
- **Chart type:** Area chart (line with subtle fill) for follower count over time
- **X-axis:** Import dates, formatted as "Jul 9" or "Jul 9, 2026" depending on range
- **Y-axis:** Follower count, formatted with K notation above 1,000
- **Tooltip:** Shows exact count + date on hover
- **Dark mode:** Uses CSS variables; chart background transparent
- **Responsive:** Uses `<ResponsiveContainer>` to fill parent width
- **Colour:** Brand primary with 20% opacity fill

```tsx
<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={chartData}>
    <defs>
      <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
        <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
    <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
    <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} tickFormatter={formatK} />
    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
    <Area
      type="monotone"
      dataKey="followerCount"
      stroke="var(--brand-primary)"
      strokeWidth={2}
      fill="url(#followerGradient)"
    />
  </AreaChart>
</ResponsiveContainer>
```

### Diff Summary Visualization

The diff view uses coloured number callouts:

```
+189 new followers    (emerald / success colour)
-42 lost followers    (red / destructive colour)
+15 new following     (blue / primary colour)
-8 unfollowed         (gray / muted colour)
```

Not a chart — pure typography with colour. Keeps it readable and fast to scan.

---

## 13. Page-Specific Design Notes

### Landing Page

- Hero section uses the brand gradient as a background mesh or gradient blob (not a solid colour)
- "How it works" uses a numbered step pattern with connecting lines
- Social proof stats use count-up animation on scroll into view
- The "Privacy Promise" section uses a lock icon and plain language copy — builds trust
- CTA buttons: large (`size="lg"`), full-width on mobile

### Dashboard

- Stat cards use large tabular numbers (`text-3xl font-bold`)
- Negative or concerning counts (non-followers) use a subtly different visual weight — not red, but slightly muted, with an appropriate icon
- The "Last Import" card shows a human-readable relative time ("3 days ago") with the exact date in a tooltip

### Import Page

- The dropzone is the largest element on the page — it IS the page on first load
- During upload: the progress bar is prominent, file name/size is shown
- During processing: animated indigo spinner, reassuring copy
- Success: large green checkmark + stats summary
- All error messages are specific and actionable

### Diff View

- Color-code the change counts: green for gains, red for losses — this is the one place where colour carries meaning (paired with +/- prefix and icon)
- Net change is shown prominently in a hero callout: "+147 followers since last import" in brand colour if positive, muted red if negative

### Settings

- Danger zone is visually separated with a red border or section header in red
- Data deletion actions require at least one confirmation click; account deletion requires typing "DELETE"
