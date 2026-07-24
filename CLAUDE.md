@AGENTS.md

# REI Grove Forum Post Generator — Project Brief for Claude Code

## Overview
A tool that helps the REI Grove team stimulate activity in the REI Grove community forums by generating discussion-starter posts (questions, polls, "share your win" prompts, etc.) — some tied to REI Grove's existing content library (calculators, checklists, The Breakdown, webinars, podcast episodes), some general real estate investing topics. All posts are transparently authored and posted as the official REI Grove team account — this tool does **not** simulate fake member personas or fabricate community engagement.

**Primary user:** Whoever manages the REI Grove community forum (non-technical)
**Goal:** Give the forum manager a steady stream of on-brand discussion-starter drafts to post, instead of coming up with topics from scratch.

---

## Constitution
This project follows the **Innago Internal Tools Constitution** at `/Users/tiya/Documents/Claude/Projects/CONSTITUTION.md`.

All UI patterns, language, component styles, tech stack decisions, and file structure rules in the Constitution apply here unless explicitly overridden below.

---

## This App's Pages

| Page | Purpose |
|---|---|
| Dashboard (`/`) | Stat cards (pending review, approved this month, posted this month) + recent activity + "New Batch" CTA |
| Input (`/input`) | Choose forum category, content source (resource-tied / general / mix), post type, and how many posts to generate |
| Approve (`/approve`) | Card queue — Edit / Regenerate / Delete / Approve each generated post; copy-to-clipboard for manual posting |
| History (`/history`) | Table of all posts that left the queue — Approved, Posted, Rejected — with a "Mark Posted" action and filters |
| Settings (`/settings`) | Anthropic API key status, editable forum category list |

---

## Integrations
- **Anthropic API (Claude):** Generates post titles/bodies. Requires `ANTHROPIC_API_KEY` env var. Uses the REI Grove brand voice, content library, and a set of real (anonymized) forum threads for tone/specificity calibration — see `lib/rei-grove-context.ts`.
- **No forum platform integration.** This tool does not post directly to the forum — a human copies the approved draft and posts it manually. (See Overrides below.)

---

## Database Schema (key tables)

| Table | Purpose |
|---|---|
| `ForumPost` | Every generated post: category, source type (resource/general), source reference, post type, title, body, status, timestamps |

`ForumPost.status`: `pending_review` → `approved` \| `rejected`, and separately `posted` (set manually once a human has actually posted it to the forum, via "Mark Posted" in History). This lets the generator avoid re-suggesting topics that are already live.

---

## Overrides from Constitution

1. **No auto-send / no platform posting.** The Constitution's Phase 4 (Send/Act) doesn't apply here — REI Grove's forum has no posting API, so "Approve" simply marks a draft as ready and moves it to History with status `Approved`. A separate "Mark Posted" action in History (manual, human-triggered) records `postedAt`.
2. **No Microsoft/Azure AD auth for v1.** This is a single-user internal tool; login gating adds setup overhead (Azure app registration + tenant admin approval) with no real access-control benefit yet. If this tool gets a second user or moves to a shared environment, add NextAuth + Azure AD per Constitution §8.
3. **History status labels (per Constitution §12, Page 3):** `Approved` (ready to post, not yet posted), `Posted` (confirmed live on the forum), `Rejected` (not used).
4. **Forum categories** match the real REI Grove forum's actual sections (from the forum's own import data): New Member Introductions, Multifamily, Market Trends & Current Events, Maintenance, House Flipping, General Advice, Self-storage, Flipping/Rehabbing, Miscellaneous. Editable in Settings if the real forum's categories change.
5. **Sidebar order (overrides Constitution §12):** Input, Approve, History, Settings are listed first, with Dashboard below a divider — the reverse of the Constitution's default (Dashboard above the four pages). Per explicit request.

---

## Starting Instructions for Claude Code
1. Scaffold Next.js app with Tailwind — done
2. Create Prisma schema (`ForumPost` model) against Postgres (Supabase) — set `DATABASE_URL` in `.env` before running migrations
3. Build the app shell (sidebar nav: Dashboard, Input, Approve, History, Settings)
4. Build `lib/generator.ts` — Anthropic SDK call with REI Grove brand voice + content library context
5. Build Input → Approve → History flow per Constitution §12
6. Build Settings page (Anthropic key status, category list)
7. Verify end-to-end with a real generation batch before considering done
