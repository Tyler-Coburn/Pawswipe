# PawSwipe — Recommended Lovable Cloud Schema

This document describes the database tables PawSwipe will need to move from
the current demo dashboard to a live, shelter-managed product. None of these
tables exist yet — the app currently runs in two modes:

1. **Synced read-only listings** via the `rescuegroups` edge function.
2. **Demo / mock data** for the marketing pages and shelter dashboard.

When shelters start managing listings directly through PawSwipe, the tables
below should be created in Lovable Cloud (Supabase). Every public-schema
table must include `GRANT` statements and Row Level Security policies.

---

## `shelters`

Shelter / rescue organizations. Distinguish shelters managed directly in
PawSwipe from external organizations whose listings we sync.

| Field             | Type                 | Notes |
| ----------------- | -------------------- | ----- |
| `id`              | `uuid`               | PK, `default gen_random_uuid()` |
| `slug`            | `text unique`        | URL-safe identifier |
| `name`            | `text not null`      | |
| `city`            | `text not null`      | One of the Lower Mainland cities |
| `address`         | `text`               | |
| `phone`           | `text`               | |
| `email`           | `text`               | |
| `website`         | `text`               | |
| `hours`           | `text`               | |
| `description`     | `text`               | |
| `verified`        | `boolean default false` | PawSwipe-vetted flag |
| `is_managed`      | `boolean default false` | `true` = shelter logs into PawSwipe; `false` = external/synced |
| `source`          | `text`               | `shelter-direct` \| `rescuegroups` \| `petfinder` |
| `source_shelter_id` | `text`             | External org id, when synced |
| `source_url`      | `text`               | Original org page |
| `created_at`      | `timestamptz default now()` | |
| `updated_at`      | `timestamptz default now()` | |

RLS: public read; insert/update restricted to shelter members via a
`shelter_members(user_id, shelter_id)` join table or the `user_roles` pattern.

---

## `pets`

Listings displayed in Discover and Pet Detail. Holds both synced and
shelter-direct listings — distinguished by `source`.

| Field              | Type                | Notes |
| ------------------ | ------------------- | ----- |
| `id`               | `uuid`              | PK |
| `shelter_id`       | `uuid references shelters(id) on delete cascade` | |
| `name`             | `text not null`     | |
| `species`          | `text`              | `dog` \| `cat` \| `rabbit` \| `small` |
| `breed`            | `text`              | |
| `age`              | `text`              | Free-form, e.g. "2 years" |
| `age_group`        | `text`              | `puppy` \| `young` \| `adult` \| `senior` |
| `gender`           | `text`              | `male` \| `female` |
| `size`             | `text`              | `small` \| `medium` \| `large` |
| `weight_kg`        | `numeric`           | |
| `energy_level`     | `text`              | |
| `location_city`    | `text`              | |
| `distance_km`      | `numeric`           | Derived for the viewing user |
| `images`           | `text[]`            | Public URLs |
| `bio`              | `text`              | Stripped of HTML on ingest |
| `ideal_home`       | `text`              | |
| `personality_tags` | `text[]`            | |
| `good_with_dogs`   | `boolean`           | |
| `good_with_cats`   | `boolean`           | |
| `good_with_kids`   | `boolean`           | |
| `vaccinated`       | `boolean`           | |
| `spayed_neutered`  | `boolean`           | |
| `medical_notes`    | `text`              | |
| `meet_and_greet`   | `text`              | |
| `adoption_fee`     | `numeric default 0` | |
| `status`           | `text default 'available'` | `available` \| `pending` \| `on-hold` \| `adopted` |
| **Source metadata** | | Lets the UI render `SourceBadge` and stale-listing warnings |
| `source`           | `text not null`     | `shelter-direct` \| `rescuegroups` \| `petfinder` |
| `source_pet_id`    | `text`              | External id (e.g. `animalID`) |
| `source_url`       | `text`              | Original listing page |
| `last_synced_at`   | `timestamptz`       | Last successful fetch from external provider |
| `last_updated_at`  | `timestamptz`       | Source-reported update time |
| `created_at`       | `timestamptz default now()` | |
| `updated_at`       | `timestamptz default now()` | |

RLS: public read for `status = 'available'`; insert/update restricted to
shelter members of the owning shelter; synced rows are upserted by a
service-role edge function only.

Index: `(source, source_pet_id)` unique to dedupe synced records.

---

## `saved_pets`

Per-user shortlist powering the Matches page. Currently stored in
`localStorage` under the key `pawswipe:saved`.

| Field        | Type                                   | Notes |
| ------------ | -------------------------------------- | ----- |
| `id`         | `uuid`                                 | PK |
| `user_id`    | `uuid references auth.users not null`  | |
| `pet_id`     | `uuid references pets(id) on delete cascade` | |
| `created_at` | `timestamptz default now()`            | |

Unique `(user_id, pet_id)`. RLS: `auth.uid() = user_id`.

---

## `adoption_applications`

Submissions from the Apply page. For synced (`rescuegroups`) listings, the
form is informational — the shelter's official application may still be
required.

| Field                | Type                                          | Notes |
| -------------------- | --------------------------------------------- | ----- |
| `id`                 | `uuid`                                        | PK |
| `pet_id`             | `uuid references pets(id) on delete set null` | |
| `shelter_id`         | `uuid references shelters(id) on delete set null` | |
| `user_id`            | `uuid references auth.users`                  | Nullable for guest interest |
| `applicant_name`     | `text not null`                               | |
| `email`              | `text not null`                               | |
| `phone`              | `text`                                        | |
| `city`               | `text`                                        | |
| `housing_type`       | `text`                                        | |
| `rent_or_own`        | `text`                                        | |
| `landlord_permission`| `boolean`                                     | |
| `current_pets`       | `text`                                        | |
| `children_in_home`   | `text`                                        | |
| `pet_experience`     | `text`                                        | |
| `reason`             | `text`                                        | |
| `preferred_contact`  | `text`                                        | |
| `availability`       | `text`                                        | |
| `consent`            | `boolean not null`                            | |
| `status`             | `text default 'new'`                          | `new` \| `reviewing` \| `contacted` \| `meet-greet` \| `approved` \| `not-selected` |
| `is_synced_listing`  | `boolean default false`                       | Mirrors `pets.source != 'shelter-direct'` at submit time |
| `created_at`         | `timestamptz default now()`                   | |
| `updated_at`         | `timestamptz default now()`                   | |

RLS: applicants can read their own rows; shelter members can read/update
rows for their shelter via a `has_role` security-definer function.

---

## `application_notes` _(removed)_

Previously planned for shelter-staff notes on an application. Dropped during
the public-beta security cleanup — never wired into the client and had
permissive demo RLS. Recreate with proper `has_role`-scoped policies when
shelter staff accounts ship.

---

## `sync_logs`

Append-only record of provider syncs. Powers the Data Health page (which
currently keeps an in-memory log).

| Field            | Type                        | Notes |
| ---------------- | --------------------------- | ----- |
| `id`             | `uuid`                      | PK |
| `provider`       | `text not null`             | `rescuegroups` \| `petfinder` |
| `result`         | `text not null`             | `ok` \| `skipped` \| `error` |
| `message`        | `text`                      | |
| `pets_count`     | `integer`                   | |
| `shelters_count` | `integer`                   | |
| `error_detail`   | `text`                      | Never include the API key |
| `created_at`     | `timestamptz default now()` | |

RLS: read restricted to admins via `has_role(auth.uid(), 'admin')`; insert
restricted to `service_role` (edge function only).

---

## Synced vs shelter-direct listings — UI rules

The frontend distinguishes the two via `pets.source` and renders different
copy and CTAs:

- **`shelter-direct`** — shelter manages the listing in PawSwipe. The Apply
  form is the official application. `SourceBadge` shows "Shelter direct."
- **`rescuegroups` / `petfinder`** — synced from an external provider.
  PawSwipe interest forms are saved but the shelter's official application
  may still be required; the Apply page shows a "View official shelter
  listing" CTA pointing to `pets.source_url`.

The `SourceBadge` component already encodes this distinction; backend
policies should match — synced rows are read-only to shelter members and
writable only by the syncing service role.
