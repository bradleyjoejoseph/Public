# 01 — Project Overview

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09  
> Status: Pre-Development · Classification: Internal

---

## Table of Contents

1. [Vision](#1-vision)
2. [Mission](#2-mission)
3. [The Problem](#3-the-problem)
4. [The Solution](#4-the-solution)
5. [Target Users](#5-target-users)
6. [Goals](#6-goals)
7. [Non-Goals](#7-non-goals)
8. [Success Metrics](#8-success-metrics)
9. [Competitive Landscape](#9-competitive-landscape)
10. [Product Roadmap](#10-product-roadmap)
11. [Risk Register](#11-risk-register)
12. [Glossary](#12-glossary)

---

## 1. Vision

**FollowBack** will become the definitive platform for Instagram relationship intelligence — giving creators, brands, and everyday users complete clarity over who they follow, who follows them, and how those relationships change over time.

We believe that social data is deeply personal. Our users deserve a privacy-first, portable, no-API-key-required tool that puts them in control of their own social graph.

---

## 2. Mission

To give every Instagram user a clear, honest, and private view of their follower relationships — enabling them to grow intentionally, prune strategically, and understand their audience deeply — without compromising their account security or privacy.

---

## 3. The Problem

Instagram provides no native mechanism to see:

- Which accounts you follow that do not follow you back
- Which accounts follow you that you do not follow back
- When someone stopped following you
- When you gained a new follower
- Trends in your follower / following ratio over time

Third-party Instagram API tools that historically solved this problem are no longer viable: Meta's current Graph API does not expose follower/following relationship data for personal accounts. Legacy solutions either violate Instagram's Terms of Service, require dangerous credential sharing (username/password), or have been shut down by Meta.

The result: millions of users have no safe, reliable way to understand their own follower network.

---

## 4. The Solution

FollowBack uses **Instagram's official Data Export** (available natively in the Instagram app and web interface) as its data source. Users download their own data — a ZIP file containing JSON files — and upload it to FollowBack. No Instagram credentials are ever shared. No API keys are required. The process is fully compliant with Meta's Terms of Service.

FollowBack then:

1. Parses and validates the uploaded data export
2. Creates a versioned **snapshot** of the user's follower/following state at that point in time
3. Compares snapshots across time to reveal changes (new followers, lost followers, etc.)
4. Presents all relationship data in a clean, fast, responsive dashboard

The system is architected around an **Import Provider abstraction layer**, so future data sources — including potential future Meta API endpoints, browser extensions, or third-party integrations — can be added without changing core application logic.

---

## 5. Target Users

### Primary: The Conscious Creator (MVP focus)

- Instagram content creators with 500–50,000 followers
- Uses Instagram for personal branding, side business, or creative expression
- Frustrated that Instagram doesn't show who doesn't follow back
- Not technical; needs a simple, guided import flow
- Values: simplicity, speed, privacy, clarity

### Secondary: The Social Brand Manager

- Manages one or more Instagram accounts for a small business or brand
- Needs to track follower growth metrics over time
- Wants to identify reciprocal vs. one-sided relationships
- Values: data accuracy, export capability, history

### Tertiary: The Power User / Growth Hacker

- Runs aggressive follow/unfollow strategies (not endorsed, but realistic)
- Needs precise diff views between imports
- Values: bulk actions, detailed history, fast interface

### Future: The Agency / Team Account

- Manages multiple Instagram accounts for clients
- Needs multi-account dashboards and team-level access
- Values: multi-seat access, white-label potential, reporting

---

## 6. Goals

### v1.0 Goals (MVP)

| # | Goal | Why It Matters |
|---|------|---------------|
| G1 | Users can upload an Instagram data export and see their follower/following breakdown within 60 seconds | Core value proposition |
| G2 | Users can identify non-followers (following but not followed back) | #1 requested feature across all competitor reviews |
| G3 | Users can identify non-following (follower who is not followed back) | Enables reciprocal growth decisions |
| G4 | Users can see mutual followers | Context for relationship health |
| G5 | Users can upload a second export and see exactly what changed | Enables time-based tracking without an API |
| G6 | Data is stored securely and deleted on user request | GDPR compliance and user trust |
| G7 | The application loads and responds in under 2 seconds on a standard connection | User experience quality bar |
| G8 | The system handles exports from 1 to 10,000+ followers without degradation | Scalability requirement |

### Strategic Goals (v2.0+)

- Build a monetisable subscription tier on top of the free core
- Achieve viral growth via a shareable "My Follower Report" card
- Establish the brand as the trusted, privacy-first alternative to sketchy Instagram tools
- Architect for potential Meta API integration the moment one becomes available

---

## 7. Non-Goals

The following are explicitly **out of scope** for v1.0 and should not influence MVP architecture decisions:

| Non-Goal | Reason |
|----------|--------|
| Direct Instagram API integration | Not currently possible for follower data |
| Bulk unfollow/follow actions | Requires API access; against Meta ToS without it |
| Real-time follower monitoring | No safe polling mechanism without API |
| Social graph visualisation | Deferred to v2.0 |
| Mobile native apps (iOS/Android) | Progressive Web App covers MVP needs |
| Multi-account management | Deferred to v2.0 |
| Team/agency features | Deferred to v2.0 |
| Stripe payments / subscription billing | Deferred to v2.0 |
| AI-powered analytics | Deferred to v2.0 |
| Browser extension | Deferred to v2.0 |
| CSV export of results | Deferred to v2.0 (but architected for) |
| Ghost follower detection | Deferred to v2.0 |
| Email notifications / weekly digests | Deferred to v2.0 |

---

## 8. Success Metrics

### North Star Metric

**Weekly Active Uploads (WAU)** — the number of unique users who complete at least one data import per week. This metric captures both acquisition and retention.

### v1.0 Launch Targets (90 days post-launch)

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Registered users | 1,000 | Auth table user count |
| WAU | 200 | Import event tracking |
| Import completion rate | ≥ 75% | Funnel analysis (start → complete) |
| Time to first insight (TTFI) | < 90 seconds | Import pipeline timing |
| p99 API response time | < 500ms | Vercel Analytics / observability |
| Core Web Vitals (LCP) | < 2.5s | Vercel Analytics |
| User-reported satisfaction | ≥ 4.0/5 | In-app rating prompt |
| Churn (7-day return rate) | ≥ 40% | Session tracking |
| Zero critical security incidents | 0 CVEs exploited | Security audit + monitoring |

### v2.0 Targets (12 months post-launch)

| Metric | Target |
|--------|--------|
| Registered users | 50,000 |
| Monthly paying subscribers | 2,000 |
| Monthly Recurring Revenue (MRR) | $10,000 |
| WAU | 15,000 |
| NPS Score | ≥ 50 |

---

## 9. Competitive Landscape

| Competitor | Approach | Fatal Flaw | Our Advantage |
|-----------|----------|------------|---------------|
| Followers & Unfollowers (mobile app) | Uses unofficial API | Account bans, ToS violation | Safe, export-based |
| Unfollowers for Instagram | Password sharing | Security risk, likely dead | No credential sharing |
| InstaFollow | Unofficial API | Fragile, regularly broken | Stable data export method |
| Snoopreport | Paid, tracks others | Different use case | Self-focused, free tier |
| Manual spreadsheet | User uploads CSV manually | Tedious, error-prone | Automated parsing |

**Key differentiators:**

1. **Safety** — zero Instagram credentials required
2. **Privacy** — data stored only for the authenticated user, deletable on demand
3. **Reliability** — export-based, not subject to API changes or bans
4. **History** — snapshot comparison across multiple imports over time
5. **Design** — modern, fast, beautiful UI vs. dated competitors

---

## 10. Product Roadmap

### Phase 0 — Foundation (Weeks 1–4)
Project scaffolding, auth, database schema, core import pipeline

### Phase 1 — MVP (Weeks 5–10)
Complete import flow, dashboard views, snapshot comparison, basic analytics

### Phase 2 — Polish & Launch (Weeks 11–12)
Performance optimisation, accessibility audit, security review, public launch

### Phase 3 — Growth (Months 4–6)
- Shareable report cards
- Email notifications for import reminders
- CSV export
- Improved onboarding funnel

### Phase 4 — Monetisation (Months 7–9)
- Stripe integration
- Free vs. Pro plan feature gating
- Subscription management

### Phase 5 — Scale (Months 10–18)
- Multiple Instagram account support
- Bulk unfollow assistant (if Meta API permits)
- AI analytics (ghost followers, engagement rate correlation)
- Team accounts
- Mobile app (React Native or PWA enhancement)
- Browser extension

### Phase 6 — Platform (18+ months)
- Public API for third-party integrations
- Agency/white-label tier
- Data export partnerships
- Potential Meta Graph API integration

---

## 11. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Meta changes export format | Medium | High | Versioned parser with format detection; monitor Meta changelog |
| Supabase free tier limits hit | Medium | Medium | Architect for easy tier upgrade; monitor usage proactively |
| Competitor clones with better marketing | High | Medium | Build community, moat via history/analytics |
| User uploads malicious ZIP files | Low | High | Strict file validation, sandboxed parsing, virus scanning |
| GDPR compliance failure | Low | Critical | Privacy-by-design from day one; data deletion flow |
| Auth provider outage (Better Auth) | Low | High | Graceful degradation; self-hosted auth reduces vendor risk |
| Vercel cold starts affecting UX | Medium | Low | Optimise bundle size; warm critical routes |

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **Data Export** | The ZIP file downloaded from Instagram via Settings → Your Activity → Download your information |
| **Snapshot** | A point-in-time record of a user's complete follower/following list, created from a single import |
| **Import** | The act of uploading a Data Export ZIP and processing it into a Snapshot |
| **Non-Follower** | An account the user follows that does not follow the user back |
| **Non-Following** | An account that follows the user but the user does not follow back |
| **Mutual** | An account both followed by and following the user |
| **Diff** | The calculated difference between two Snapshots — showing gained/lost followers |
| **Import Provider** | An abstraction layer representing a source of follower/following data (e.g., Instagram Export, future Meta API) |
| **WAU** | Weekly Active Uploads — primary engagement metric |
| **TTFI** | Time To First Insight — time from upload start to dashboard render |
