# Architecture

PawSwipe is a Vite + React + TypeScript single-page app backed by Supabase
(Postgres + Auth + Edge Functions). This document describes how the pieces fit
together; the in-app `/status` page is the source of truth for what is live,
preview, or future.

## Layers

```
UI (pages/, components/)
      │  calls internal "API route" stand-ins only — never a provider directly
      ▼
lib/api/*        pets.ts · shelters.ts · savedPets.ts · applications.ts · sync.ts · profile.ts
      │  resolves the active data source from the provider registry
      ▼
lib/providers/*  adoptionProvider (registry) → mockProvider · rescueGroupsProvider · petfinderProvider
      │  third-party calls go through a server-side edge function
      ▼
supabase/functions/rescuegroups   reads RESCUEGROUPS_API_KEY from Deno.env (never client-side)
```

- **`lib/api/*`** — the only surface the UI imports for data. Keeps components
  agnostic of which provider is active and where data comes from.
- **`lib/providers/*`** — a registry (`adoptionProvider.ts`) keyed by
  `VITE_DATA_MODE` (`mock` | `rescuegroups` | `petfinder`, default
  `rescuegroups`). Providers return domain types normalized by
  `normalizePet.ts` / `normalizeShelter.ts`. On failure the UI surfaces an
  error/retry state — it never silently swaps in mock data.
- **Edge function** — `supabase/functions/rescuegroups` proxies RescueGroups so
  the API key stays on the server. It supports `status` / `list` / `get`.

## Data flow example (Discover)

`Discover.tsx` → `GET_pets()` (`lib/api/pets.ts`) → `getAdoptionProvider()`
→ active provider `listPets()` → (rescuegroups) `callEdge("list")` →
`normalizePet()` → deduped `Pet[]` rendered as a swipe deck.

## Auth

`lib/auth/AuthContext.tsx` subscribes to Supabase auth state and exposes
`{ user, session, loading, signInWithPassword, signUpWithPassword,
signInWithGoogle, signOut }`. Anonymous visitors work without signing in
(`user === null`); saved pets and applications fall back to `user_id IS NULL`
rows under RLS.

Google OAuth goes through `lib/auth/oauthProvider.ts`, an adapter selected by
`VITE_OAUTH_PROVIDER`:

- `lovable` (default) — Lovable Cloud OAuth wrapper the app was scaffolded with.
- `supabase` — native `supabase.auth.signInWithOAuth`; requires the Google
  provider to be configured in the Supabase project.

This seam keeps the vendor dependency out of `AuthContext` and gives a clean
migration path off Lovable without touching UI code.

## Routing & bundling

Routes are declared in `App.tsx`. The landing page ships in the main chunk;
every other route is `React.lazy`-loaded behind a `<Suspense>` fallback, and
`vite.config.ts` splits `react`, `@supabase/supabase-js`, and
`@tanstack/react-query` into separate long-cached vendor chunks.

## Key directories

| Path | Purpose |
|---|---|
| `src/pages/` | One component per route |
| `src/components/` | `layout/`, `pet/`, `shelter/`, `ui/` (shadcn) |
| `src/lib/api/` | Internal API stand-ins (the UI's only data surface) |
| `src/lib/providers/` | Provider registry + normalizers |
| `src/lib/auth/` | Auth context + OAuth adapter |
| `src/integrations/supabase/` | Generated Supabase client & types |
| `supabase/migrations/` | Authoritative schema + RLS |
| `supabase/functions/` | Edge functions (server-side keys) |
