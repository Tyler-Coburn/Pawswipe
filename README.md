# PawSwipe

**Local pet adoption, made easier.**

PawSwipe helps Vancouver and Lower Mainland adopters discover nearby adoptable pets, save favourites, and take the right next step with shelters through a clean, responsible, mobile-first adoption experience.

Live beta: https://pawswipe-gold.vercel.app

## What PawSwipe is (and isn't)

PawSwipe is **responsible adoption discovery** — simple browsing, clear fit information, source links, honest status messaging, and shelter-centered next steps.

- It is an independent discovery platform. No official shelter partnerships are implied.
- It does **not** sell pets, process payments, or finalize adoptions.
- Shelters always confirm availability, fit, meet-and-greets, and final decisions.
- Interest notes are introductions, not applications — the shelter's own process applies.
- Synced listings link back to the official shelter/source listing.

## Feature status

| Area | Status |
|---|---|
| Discover/swipe, pet detail, saved matches, shelter directory | **Live** |
| Interest notes (stored privately; not yet delivered to shelters) | **Live** |
| Auth, profile, onboarding preferences | **Live** |
| Live listings via RescueGroups (server-side edge function) | **Live** (requires API key) |
| Shelter dashboard (redacted, read-only) | **Preview** |
| Petfinder integration | **Future** |
| Shelter-managed listings | **Future** |

The in-app [/status](https://pawswipe-gold.vercel.app/status) page is the source of truth for what's live, preview, and future.

## Stack

- [Vite](https://vitejs.dev) + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- TanStack Query, React Router
- [Supabase](https://supabase.com) — Postgres (RLS), Auth, Edge Functions
- Vitest for unit tests
- Deployed on Vercel

## Getting started

```sh
npm install
cp .env.example .env   # then fill in values (see below)
npm run dev
```

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | client | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | client | Supabase publishable (anon) key — safe to expose; RLS enforces access |
| `VITE_DATA_MODE` | client | Listing data source: `mock` (no keys needed), `rescuegroups` (default), or `petfinder` (stub) |
| `VITE_PETFINDER_WIDGET_URL` | client | Optional Petfinder embed URL for `/live-listings` |
| `RESCUEGROUPS_API_KEY` | **server only** | Set as a Supabase Edge Function secret — never shipped to the client |

### Data modes

Listing data flows through a provider registry (`src/lib/providers/`):

- **`mock`** — local sample data; use for development without API keys.
- **`rescuegroups`** — live listings proxied through the `rescuegroups` Supabase edge function so the API key stays server-side. If the feed fails, the UI shows a clear error/retry state — it never silently swaps in mock data.
- **`petfinder`** — future/stub. Not a live integration; `/live-listings` can render an official Petfinder embed widget if configured.

The `/data-health` page shows provider status at runtime.

## Architecture notes

- The frontend only calls internal API-route stand-ins (`src/lib/api/*`), never providers directly.
- Third-party API calls go through Supabase Edge Functions (`supabase/functions/`); no third-party API keys exist in client code.
- Applicant privacy: `adoption_applications` is insert-only for anonymous users; submitters can read only their own rows; the preview shelter dashboard reads only redacted data (initials + non-PII) through a restricted RPC.
- Database schema and RLS policies live in `supabase/migrations/`.

## Scripts

```sh
npm run dev        # local dev server
npm run build      # production build
npm run test       # vitest run
npm run lint       # eslint
```

## Repo layout

- `src/` — app code (pages, components, providers, API stand-ins)
- `supabase/` — migrations, edge functions, config
- `Misc/` — early static prototypes and design references (pre-Vite history; not part of the app)
