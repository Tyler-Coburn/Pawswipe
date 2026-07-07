# Misc — early prototypes & design references

These are **pre-Vite artifacts** kept for design history. They are **not part
of the running app** (nothing in `src/` imports them) and are not deployed.
Some describe an early Next.js plan that was **not** the direction taken — the
live app is Vite + React (see the repo `README.md`). Treat everything here as
historical reference only.

- `*.html` — early static-HTML mockups (swipe, onboarding, animal detail,
  matches, application, messages, shelter dashboard/profile, shelters directory,
  landing), the design system, brand assets, and email templates. Use them as a
  visual spec, not as code.
- `pawswipe-build-guide.md`, `pawswipe-tasks.md` — early planning notes.
- `shelter-outreach-emails.md` — draft outreach copy.
- `schema.sql`, `seed.sql` — early database drafts. **Superseded** by the
  authoritative migrations in `supabase/migrations/`; do not run these.
- `petfinder.ts`, `supabase.ts` — early integration sketches, superseded by
  `src/lib/providers/` and `src/integrations/supabase/`.

The live product documentation is the repo `README.md` and `docs/`; the in-app
`/status` page is the source of truth for what is live, preview, and future.
