# 02 — Product Requirements Document (PRD)

> **FollowBack** · Instagram Relationship Intelligence Platform  
> Version 1.0 · Last Updated: 2026-07-09  
> Status: Approved for Development

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Stories](#2-user-stories)
3. [Feature Specifications](#3-feature-specifications)
   - [F-01 Authentication](#f-01-authentication)
   - [F-02 Onboarding](#f-02-onboarding)
   - [F-03 Import Flow](#f-03-import-flow)
   - [F-04 Dashboard](#f-04-dashboard)
   - [F-05 Non-Followers View](#f-05-non-followers-view)
   - [F-06 Non-Following View](#f-06-non-following-view)
   - [F-07 Mutuals View](#f-07-mutuals-view)
   - [F-08 Snapshot History](#f-08-snapshot-history)
   - [F-09 Diff / Change View](#f-09-diff--change-view)
   - [F-10 Account Settings](#f-10-account-settings)
   - [F-11 Data Deletion](#f-11-data-deletion)
4. [Page Inventory](#4-page-inventory)
5. [User Flows](#5-user-flows)
6. [Edge Cases](#6-edge-cases)
7. [Acceptance Criteria Summary](#7-acceptance-criteria-summary)
8. [Future Features (Parked)](#8-future-features-parked)

---

## 1. Overview

FollowBack v1.0 is a single-user, single-Instagram-account web application. The MVP delivers five core capabilities:

1. Import an Instagram Data Export
2. View follower relationship breakdowns
3. Track changes between multiple imports
4. Manage account and data
5. Understand the app via onboarding

All features must work on desktop (1024px+), tablet (768px–1023px), and mobile (320px–767px) screen sizes.

---

## 2. User Stories

### Authentication

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|------------|----------|
| US-001 | Visitor | Sign up with email and password | I can create an account | Must |
| US-002 | Visitor | Sign in with Google OAuth | I can access my account quickly | Must |
| US-003 | User | Sign out | My session is ended securely | Must |
| US-004 | User | Reset my password via email | I can recover my account | Must |
| US-005 | User | Stay signed in across sessions | I don't have to log in every time | Must |

### Import

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|------------|----------|
| US-010 | User | Upload my Instagram data export ZIP | FollowBack can read my follower data | Must |
| US-011 | User | See upload progress in real time | I know the system is working | Must |
| US-012 | User | Be told if my ZIP file is invalid | I can fix the problem and retry | Must |
| US-013 | User | Import multiple exports over time | I can track changes | Must |
| US-014 | User | See a history of all my imports | I know when each snapshot was taken | Must |

### Dashboard

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|------------|----------|
| US-020 | User | See a summary of my follower stats | I get an instant overview | Must |
| US-021 | User | See how many people don't follow me back | I can decide who to unfollow | Must |
| US-022 | User | See who I don't follow back | I can choose to reciprocate | Must |
| US-023 | User | See my mutual followers | I know who has a reciprocal relationship with me | Must |
| US-024 | User | Search within any list | I can find specific accounts | Must |
| US-025 | User | Sort any list by date added or username | I can prioritise my review | Should |

### History & Diff

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|------------|----------|
| US-030 | User | Compare two snapshots | I can see what changed between imports | Must |
| US-031 | User | See new followers since last import | I can celebrate growth | Must |
| US-032 | User | See lost followers since last import | I know who unfollowed me | Must |
| US-033 | User | See a timeline of follower counts | I can visualise growth | Should |

### Settings & Privacy

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|------------|----------|
| US-040 | User | Delete a specific snapshot | I can remove old data I don't need | Must |
| US-041 | User | Delete all my data | I can fully remove myself from the platform | Must |
| US-042 | User | Change my email address | I can keep my account current | Should |
| US-043 | User | Change my password | I can maintain security | Should |
| US-044 | User | See when my data will be auto-deleted | I understand the data retention policy | Should |

---

## 3. Feature Specifications

---

### F-01 Authentication

#### Description
Users can create an account, sign in, and manage their session. Authentication uses Better Auth with email/password and Google OAuth as providers.

#### Acceptance Criteria

**Sign Up (email/password)**
- [ ] User enters: display name, email address, password (min 8 chars, 1 uppercase, 1 number)
- [ ] Password strength meter is displayed
- [ ] On submit, system creates account and sends verification email
- [ ] User is redirected to onboarding flow after email verification
- [ ] Duplicate email shows an appropriate error: "An account with this email already exists"
- [ ] Rate limited to 5 sign-up attempts per IP per hour

**Sign In (email/password)**
- [ ] User enters email and password
- [ ] Wrong credentials: "Invalid email or password" (no specificity about which is wrong)
- [ ] Rate limited to 10 failed attempts per account per 15 minutes (then soft-lock with CAPTCHA)
- [ ] Successful login redirects to dashboard (or to the page they were trying to access)
- [ ] "Remember me" checkbox persists session for 30 days

**Google OAuth**
- [ ] Clicking "Sign in with Google" opens OAuth popup
- [ ] On success, account is created (if new) or signed into (if existing email match)
- [ ] Display name and avatar are pulled from Google profile
- [ ] OAuth errors show a human-readable message

**Sign Out**
- [ ] "Sign out" in user menu immediately invalidates session
- [ ] User is redirected to landing page

**Password Reset**
- [ ] User enters email address
- [ ] If email exists, a reset link is sent (valid for 1 hour)
- [ ] If email does not exist, same success message is shown (prevents enumeration)
- [ ] Reset link opens a form for new password entry
- [ ] Old sessions are invalidated on password change

#### Edge Cases
- User signs up with email that matches an existing Google OAuth account → prompt to merge or use Google login
- Session token expires mid-session → silent refresh attempt, then graceful redirect to sign in with flash message
- Verification email not received → "Resend verification email" option after 60 seconds

---

### F-02 Onboarding

#### Description
First-time users are guided through the purpose of the application and how to obtain their Instagram Data Export.

#### Acceptance Criteria
- [ ] Onboarding flow is shown once after first login (tracked via `onboardingCompleted` flag)
- [ ] Step 1: Welcome screen explaining what FollowBack does
- [ ] Step 2: Step-by-step guide on how to request Instagram Data Export (with screenshots)
  - Open Instagram → Profile → Settings → Your Activity → Download your information
  - Select "Followers and Following" data type
  - Select JSON format (not HTML)
  - Request download
  - Wait for email from Instagram (typically minutes to hours)
- [ ] Step 3: "Ready to import?" CTA linking to import flow
- [ ] "Skip for now" option on each step
- [ ] Onboarding can be re-accessed from Settings → Help → Onboarding Guide
- [ ] Progress indicator showing Step X of 3

---

### F-03 Import Flow

#### Description
The core import pipeline allows users to upload an Instagram Data Export ZIP and process it into a Snapshot.

#### Acceptance Criteria

**Pre-upload**
- [ ] Import page shows: instructions, supported file format, max file size (50MB)
- [ ] Drag-and-drop zone OR file browser button
- [ ] Accepted file type: `.zip` only (enforced client-side and server-side)
- [ ] If the user has no snapshots, the page surfaces the onboarding guide steps

**Upload**
- [ ] File is validated client-side before upload: must be `.zip`, must be ≤ 50MB
- [ ] Upload progress bar shows percentage
- [ ] If upload is cancelled, the incomplete file is removed from storage
- [ ] Upload is chunked for large files to handle slow connections
- [ ] On upload failure (network error), a retry option is presented

**Server-Side Processing**
- [ ] ZIP is scanned for required files: `followers_1.json` or similar (see Import System spec)
- [ ] ZIP is rejected if it contains: no Instagram data files, executable files, files > 10MB individually
- [ ] Parser extracts follower and following lists
- [ ] Snapshot is created and stored in database
- [ ] Raw ZIP is stored in Supabase Storage under user-scoped path
- [ ] Processing completes in ≤ 30 seconds for files up to 50MB
- [ ] If processing fails, an error is shown and the stored file is cleaned up

**Post-upload**
- [ ] User sees a "Processing..." state with an animated indicator
- [ ] On success, user is redirected to the dashboard with a success toast notification
- [ ] Dashboard immediately reflects the new snapshot data
- [ ] If this is the user's second or later import, a "New changes detected!" banner links to the Diff view

**Import History**
- [ ] Each import is listed with: date/time, Instagram username detected in the file, follower count at time of import, following count at time of import
- [ ] User can delete an individual import (with confirmation dialog)
- [ ] Deleting an import deletes its snapshot and the stored ZIP file

#### Edge Cases
- Duplicate import (same export ZIP uploaded twice): system detects identical timestamp in export metadata and warns "This export appears to already be imported. Continue anyway?"
- ZIP contains multiple `followers_*.json` files (paginated export for large accounts): all are merged
- Export file uses a different locale/format (date format variation): parser must be locale-agnostic
- Zero followers or zero following: valid state, not an error
- User uploads HTML export (not JSON): detected and rejected with instruction to re-export as JSON

---

### F-04 Dashboard

#### Description
The main application view after login. Shows a summary of the user's most recent snapshot.

#### Acceptance Criteria

**Layout**
- [ ] Sidebar navigation (desktop) / bottom tab bar (mobile)
- [ ] Header shows: app logo, current Instagram account username (from snapshot), user avatar/menu

**Summary Cards**
The following stat cards are displayed prominently:

| Card | Value Shown | Click Behaviour |
|------|-------------|----------------|
| Following | Total count | Links to following list |
| Followers | Total count | Links to followers list |
| Non-Followers | Count of following who don't follow back | Links to Non-Followers view |
| Non-Following | Count of followers who aren't followed back | Links to Non-Following view |
| Mutuals | Count of mutual follows | Links to Mutuals view |
| Last Import | Relative date (e.g. "3 days ago") | Links to Import History |

- [ ] Cards display a loading skeleton while data is fetched
- [ ] Cards show N/A with CTA to import if no snapshot exists

**Empty State (no imports)**
- [ ] Full-page empty state: illustration, headline, sub-text explaining the need to import, prominent "Import Data" button

**Quick Actions**
- [ ] "Import New Export" button always visible in header or sidebar
- [ ] "View Changes" button visible when 2+ snapshots exist

---

### F-05 Non-Followers View

#### Description
A paginated, searchable list of Instagram accounts the user follows that do not follow the user back.

#### Acceptance Criteria
- [ ] List shows: Instagram username, profile URL (links to Instagram profile), date the user started following them (from snapshot data if available)
- [ ] Default sort: alphabetical by username
- [ ] Secondary sort option: by date followed (if available in export)
- [ ] Search field filters list in real time (client-side, debounced 300ms)
- [ ] Pagination: 50 items per page, with page controls
- [ ] Count badge in header: "247 Non-Followers"
- [ ] Empty state: "Everyone you follow follows you back!" with a congratulatory illustration
- [ ] Each row has a "View on Instagram" link (opens in new tab)
- [ ] Bulk select (checkboxes) — UI only in v1.0, no action performed (precursor to bulk unfollow in v2.0)

---

### F-06 Non-Following View

#### Description
A paginated, searchable list of Instagram accounts that follow the user but the user does not follow back.

#### Acceptance Criteria
- [ ] Same layout and features as Non-Followers view
- [ ] Count badge: "183 Not Followed Back"
- [ ] Empty state: "You follow everyone who follows you!" with an illustration
- [ ] Each row links to the Instagram profile

---

### F-07 Mutuals View

#### Description
A paginated, searchable list of accounts where both the user follows them and they follow the user.

#### Acceptance Criteria
- [ ] Same layout and features as other list views
- [ ] Count badge: "512 Mutuals"
- [ ] Empty state: "No mutual followers yet"

---

### F-08 Snapshot History

#### Description
A timeline view of all imports, showing follower/following counts at each point in time.

#### Acceptance Criteria
- [ ] List of all imports, newest first
- [ ] Each entry shows: date, time, follower count, following count, non-follower count
- [ ] Line chart showing follower count over time (if 2+ snapshots exist)
- [ ] "Compare" button on each snapshot pair → links to Diff view for those two
- [ ] Delete snapshot button (with confirmation: "Deleting this snapshot will remove all associated data and cannot be undone")
- [ ] Empty state: "No imports yet. Upload your Instagram data export to get started."

---

### F-09 Diff / Change View

#### Description
A side-by-side or stacked view showing what changed between two selected snapshots.

#### Acceptance Criteria

**Snapshot Selector**
- [ ] Two dropdown selectors: "From" and "To" snapshots
- [ ] Default selection: second-most-recent and most-recent snapshots
- [ ] "To" must be newer than "From" (enforced in UI)

**Change Summary Cards**
| Card | Description |
|------|-------------|
| New Followers | Accounts that appear in "To" followers but not in "From" followers |
| Lost Followers | Accounts in "From" followers that are missing from "To" followers |
| New Following | Accounts the user started following (in "To" but not "From") |
| Unfollowed | Accounts the user stopped following (in "From" but not in "To") |
| Net Follower Change | `new_followers - lost_followers` with positive/negative indicator |

- [ ] Each card is clickable and expands a list of the relevant accounts
- [ ] Each account in a change list links to their Instagram profile
- [ ] If no changes are detected: "No changes between these two snapshots"
- [ ] Changes are calculated server-side and cached; not recalculated on every page load

---

### F-10 Account Settings

#### Description
User profile and preference management.

#### Acceptance Criteria

**Profile Section**
- [ ] Display name (editable)
- [ ] Email address (editable, requires re-verification)
- [ ] Password change (current password required)
- [ ] Profile avatar (uses Google profile picture if OAuth, otherwise initials-based avatar)

**Preferences Section**
- [ ] Theme toggle: Light / Dark / System (default: System)
- [ ] Notification preferences (placeholder for v2.0 email notifications)

**Data Section**
- [ ] List of connected Instagram accounts (username detected from imports)
- [ ] Data retention info: "Your data is stored until you delete it or close your account"
- [ ] Download my data button (exports a JSON of all stored snapshots — GDPR compliance)

**Danger Zone**
- [ ] Delete all snapshots (keeps account)
- [ ] Delete account (deletes everything, requires typing "DELETE" to confirm)

---

### F-11 Data Deletion

#### Description
GDPR-compliant data deletion flows.

#### Acceptance Criteria

**Delete Specific Snapshot**
- [ ] Confirmation modal with snapshot date
- [ ] On confirm: snapshot record deleted, associated storage file deleted, page refreshes
- [ ] Non-reversible — no soft delete

**Delete All Snapshots**
- [ ] Confirmation modal: "This will delete all X snapshots and cannot be undone"
- [ ] On confirm: all snapshot records deleted, all storage files deleted
- [ ] Account remains; user is returned to empty dashboard

**Delete Account**
- [ ] Confirmation modal requiring user to type "DELETE"
- [ ] On confirm: all snapshots deleted, all storage files deleted, user record deleted, all sessions invalidated
- [ ] User is redirected to landing page with a "Your account has been deleted" message
- [ ] Deletion is processed within 30 days per GDPR (immediate in practice for v1.0)

---

## 4. Page Inventory

| Route | Page | Auth Required | Notes |
|-------|------|:---:|-------|
| `/` | Landing Page | No | Marketing, sign up CTA |
| `/sign-in` | Sign In | No | Redirect to `/dashboard` if already authenticated |
| `/sign-up` | Sign Up | No | |
| `/forgot-password` | Forgot Password | No | |
| `/reset-password` | Reset Password | No | Token-gated |
| `/verify-email` | Email Verification | No | Token-gated |
| `/onboarding` | Onboarding Flow | Yes | Shown once post-signup |
| `/dashboard` | Dashboard | Yes | Default post-login destination |
| `/import` | Import Flow | Yes | |
| `/import/history` | Import History | Yes | |
| `/non-followers` | Non-Followers List | Yes | |
| `/non-following` | Non-Following List | Yes | |
| `/mutuals` | Mutuals List | Yes | |
| `/changes` | Diff / Change View | Yes | |
| `/settings` | Account Settings | Yes | |
| `/settings/profile` | Profile Settings | Yes | |
| `/settings/data` | Data Management | Yes | |
| `404` | Not Found | No | |
| `500` | Server Error | No | |

---

## 5. User Flows

### Flow 1: First-Time User Journey

```
Landing Page
    ↓ [Click "Get Started"]
Sign Up Page
    ↓ [Submit form]
Email Verification (check inbox)
    ↓ [Click verification link]
Onboarding Step 1: Welcome
    ↓ [Click "Next"]
Onboarding Step 2: How to get your Instagram data
    ↓ [Click "Next"]
Onboarding Step 3: Ready to Import?
    ↓ [Click "Import Now"]
Import Page (empty state)
    ↓ [Upload ZIP file]
Processing State (animated)
    ↓ [Processing complete]
Dashboard (first snapshot, populated)
```

### Flow 2: Returning User — Quick Check

```
Landing Page (not signed in)
    ↓ [Click "Sign In"]
Sign In Page
    ↓ [Submit credentials]
Dashboard
    ↓ [Click "Non-Followers" card]
Non-Followers List
    ↓ [Search for username]
Filtered List
    ↓ [Click "View on Instagram"]
Instagram profile (new tab)
```

### Flow 3: Import and Compare

```
Dashboard
    ↓ [Click "Import New Export"]
Import Page
    ↓ [Upload new ZIP]
Processing State
    ↓ [Processing complete]
Dashboard (with "Changes Detected" banner)
    ↓ [Click "View Changes"]
Diff View (pre-selected: previous vs latest)
    ↓ [Review new/lost followers]
```

### Flow 4: Account Deletion

```
Settings
    ↓ [Click "Data" tab]
Data Settings Page
    ↓ [Click "Delete Account"]
Confirmation Modal (type "DELETE")
    ↓ [Confirm]
All data deleted → Redirect to Landing Page
    ↓ Flash message: "Your account has been permanently deleted"
```

---

## 6. Edge Cases

### Import Edge Cases

| Case | Behaviour |
|------|-----------|
| ZIP file contains no recognisable Instagram data | Error: "This doesn't look like an Instagram data export. Please download your data from Instagram and try again." |
| ZIP contains HTML format instead of JSON | Error: "Please re-download your Instagram data and select JSON format, not HTML format." |
| ZIP file is password protected | Error: "This ZIP file is password protected. Please upload an unprotected file." |
| ZIP file is corrupted | Error: "The file could not be read. Please try downloading your Instagram data again." |
| Instagram export has zero followers and zero following | Valid — creates snapshot with empty lists, shows "0" counts |
| Export JSON is paginated (`followers_1.json`, `followers_2.json`) | All pages merged automatically |
| User has 100,000+ followers | Handled gracefully; pagination in UI; processing may take longer (show extended wait message at 10s) |
| Same file uploaded twice | Warning dialog: "This import appears identical to one already uploaded (same timestamp). Import anyway?" |
| Upload interrupted mid-transfer | Partial file removed from storage; user sees retry option |

### Authentication Edge Cases

| Case | Behaviour |
|------|-----------|
| Google account email matches existing email/password account | Prompt: "An account with this email already exists. Sign in with email/password to link your Google account." |
| Verification email link expired | User sees "Link expired" page with option to resend |
| Password reset with non-existent email | Same success message shown (prevent email enumeration) |
| Session expired during active use | Silent token refresh attempt → if fails, toast "Your session has expired. Please sign in again." + redirect |

### Dashboard Edge Cases

| Case | Behaviour |
|------|-----------|
| User has 0 snapshots | Empty state with import CTA |
| User has exactly 1 snapshot | No diff available; "Changes" card is disabled with tooltip "Import again to see changes" |
| Snapshot processing fails silently | Background job failure → user sees "Import failed" notification; import is removed |

---

## 7. Acceptance Criteria Summary

| Feature | Criteria Count | Priority |
|---------|---------------|----------|
| F-01 Authentication | 18 | Must |
| F-02 Onboarding | 6 | Must |
| F-03 Import Flow | 22 | Must |
| F-04 Dashboard | 12 | Must |
| F-05 Non-Followers | 8 | Must |
| F-06 Non-Following | 6 | Must |
| F-07 Mutuals | 4 | Must |
| F-08 Snapshot History | 7 | Must |
| F-09 Diff View | 10 | Must |
| F-10 Settings | 14 | Should |
| F-11 Data Deletion | 10 | Must |

**Total acceptance criteria: 117**

---

## 8. Future Features (Parked)

These are scoped out of v1.0 but must be considered in architecture decisions:

| Feature | Notes |
|---------|-------|
| Subscription billing | Stripe integration; gate features behind Pro tier |
| Multiple Instagram accounts | Schema and auth must support this from day one |
| Bulk unfollow assistant | Requires Meta API or browser extension; defer |
| Ghost follower detection | Requires engagement data; not in export |
| AI analytics | GPT-4 based insights on follower patterns |
| Weekly email digest | Summary of changes sent weekly |
| CSV export | Export any list view as CSV |
| Shareable report card | Shareable image card showing follower stats |
| Growth analytics | Trend charts, follower velocity, predictions |
| Team accounts | Multi-seat access to a shared account dashboard |
| Mobile app | React Native wrapper around same API |
| Browser extension | Chrome/Firefox extension for enhanced data collection |
