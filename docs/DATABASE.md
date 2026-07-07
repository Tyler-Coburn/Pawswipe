# Database & security

The authoritative schema lives in `supabase/migrations/`. This document
summarizes the **current** state after all migrations and explains the
privacy model. (Earlier migrations created demo tables/policies that later
migrations dropped or tightened — this reflects the end state.)

## Tables

| Table | Purpose | Client access under RLS |
|---|---|---|
| `profiles` | Signed-in user profile (`display_name`, `preferred_city`, `preferred_species`, `bio`); PK references `auth.users(id)` | Select/insert/update **own** row only |
| `saved_pets` | Favourited pets (denormalized pet snapshot + `source`/`source_url`) | Select/insert/delete own row; anonymous visitors see only `user_id IS NULL` rows |
| `adoption_applications` | Interest notes / starter applications, including applicant PII (`applicant_name`, `email`, `phone`, `city`, housing, etc.) | **Insert only** for anon; a signed-in submitter may select **their own** rows. No public read of PII. |
| `sync_logs` | Provider sync bookkeeping | **No client access** — RLS enabled with no permissive policies; `service_role` (edge functions) only |

Dropped during hardening: `user_profiles` (replaced by `profiles`) and
`application_notes` (unused demo scaffolding).

## Privacy model

- **Applicant PII is never publicly readable.** `adoption_applications` grants
  `INSERT` to anon/authenticated and has no public `SELECT` policy — submitted
  emails/phones/addresses cannot be read back from the client. A signed-in
  submitter can read only their own rows.
- **The preview shelter dashboard shows redacted data only.** It calls the
  `list_recent_applications_redacted(limit)` RPC, which returns initials + a
  handful of non-PII fields (city, timestamps). `SECURITY DEFINER` lets it run
  without granting `SELECT` on the underlying table.
- **Sync logs are server-only.** All client roles are revoked; only edge
  functions (service_role) read/write them.

## RPCs

All are `SECURITY DEFINER` and, after the security-cleanup migrations, execute
is granted to `authenticated` only (revoked from `PUBLIC`/`anon`):

| Function | Returns |
|---|---|
| `list_recent_applications_redacted(_limit int)` | Redacted recent applications (initials + non-PII) for the preview dashboard |
| `adoption_applications_health()` | Aggregate counts for `/data-health` |
| `my_profile_stats()` | The caller's own saved/applied counts |

Trigger helpers `handle_new_user()` (seeds `profiles` on signup) and
`touch_updated_at()` have execute revoked from client roles.

## Keys

- `RESCUEGROUPS_API_KEY` is a **server-side** Supabase Edge Function secret and
  never reaches the client (see `supabase/functions/rescuegroups`).
- `VITE_SUPABASE_PUBLISHABLE_KEY` is the publishable/anon key and is safe to
  ship; RLS enforces all access.

## Applying migrations

```sh
supabase link --project-ref <ref>
supabase db push          # applies supabase/migrations in order
supabase functions deploy rescuegroups
supabase secrets set RESCUEGROUPS_API_KEY=<key>
```
