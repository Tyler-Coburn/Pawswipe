# Contributing

## Setup

```sh
npm install
cp .env.example .env    # fill in Supabase URL + publishable key
npm run dev             # http://localhost:8080
```

No API keys are required to run locally: set `VITE_DATA_MODE=mock` to use local
sample data.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server (port 8080) |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Watch mode |
| `npm run lint` | ESLint |

Before pushing, run `npm run test` and `npm run build`. For type safety,
`npx tsc -p tsconfig.app.json --noEmit` must be clean (the Vite build does not
fail on type errors on its own).

## Environment variables

See `.env.example`. Client vars are prefixed `VITE_`; `RESCUEGROUPS_API_KEY` is
server-side only (a Supabase Edge Function secret) and must never be added to a
`VITE_`-prefixed variable or imported in client code.

- `VITE_DATA_MODE` — `mock` | `rescuegroups` | `petfinder`
- `VITE_OAUTH_PROVIDER` — `lovable` (default) | `supabase`

## Conventions

- The UI imports data only from `src/lib/api/*` — never a provider or Supabase
  query directly from a component.
- New third-party integrations that need a secret go through a Supabase Edge
  Function, not the client.
- Keep listings honest: link to the official shelter/source, label
  preview/future features as such, and never imply shelter verification or
  partnerships. See the repo `README.md` for the product's hard rules.
- Add routes as `React.lazy` imports in `src/App.tsx` (landing stays eager).

## Testing

Vitest + Testing Library (jsdom). The Supabase client is stubbed globally in
`src/test/setup.ts`, so tests that transitively import it don't need a
configured `.env`. Put new tests under `src/**/*.{test,spec}.{ts,tsx}`.

## Database

Schema and RLS live in `supabase/migrations/`; see [DATABASE.md](./DATABASE.md).
Never loosen the applicant-privacy policies on `adoption_applications` or the
lockdown on `sync_logs`.
