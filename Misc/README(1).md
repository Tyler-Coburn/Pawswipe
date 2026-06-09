# PawSwipe Vancouver

A free, mobile-first adoption-discovery tool for Lower Mainland animal shelters.
Browse adoptable animals, save the ones you love, and get linked straight to each
shelter's real adoption process.

---

## Project status

| Layer | State |
|---|---|
| UI / design system / brand / emails | ✅ Built (21 static files from design phase) |
| Database schema + RLS | ✅ `db/schema.sql` |
| Seed data (real shelters + animals) | ✅ `db/seed.sql` |
| Supabase client + queries | ✅ `lib/supabase.ts` |
| Petfinder integration | ✅ `lib/petfinder.ts` |
| Env template | ✅ `.env.local.template` |
| Shelter outreach | ✅ `docs/shelter-outreach-emails.md` |
| **Next.js wiring (below)** | 👤 You — follow this README |
| Domain, accounts, legal docs | 👤 You |

---

## What's in this folder

```
pawswipe/
├── db/
│   ├── schema.sql          # tables, enums, indexes, triggers, RLS
│   └── seed.sql            # 5 real shelters + 10 real animals
├── lib/
│   ├── supabase.ts         # client + getSwipeDeck/recordSwipe/getMatches/…
│   └── petfinder.ts        # optional live-listings integration
├── docs/
│   └── shelter-outreach-emails.md
├── .env.local.template
└── README.md
```

The 21 static HTML/SVG design files (swipe screen, onboarding, dashboards, email
templates, etc.) live in your design outputs — use them as the visual spec when you
convert each screen into a React component.

---

## Setup — get it running

### 1. Scaffold Next.js
```bash
npx create-next-app@latest pawswipe --typescript --tailwind --app --src-dir
cd pawswipe
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Drop in these files
- Copy `lib/supabase.ts` and `lib/petfinder.ts` into `src/lib/`
- Copy `.env.local.template` to `.env.local` and fill in real values

### 3. Create the database
- Create a project at [supabase.com](https://supabase.com) (region: US West / Oregon)
- In the SQL editor, run `db/schema.sql`, then `db/seed.sql`
- Copy your Project URL + anon key + service-role key into `.env.local`

### 4. Run it
```bash
npm run dev   # http://localhost:3000
```

### 5. Deploy
- Push to GitHub, import the repo at [vercel.com](https://vercel.com)
- Add the same env vars in Vercel → Settings → Environment Variables

---

## Build order for the React conversion

Convert the static screens into components in this order — each maps to a design file:

1. **Design tokens** → port `design-system.html` variables into `tailwind.config` + globals.css
2. **Swipe deck** (`app-swipe-screen.html`) → uses `getSwipeDeck` / `recordSwipe`
3. **Onboarding** (`app-onboarding.html`) → writes to `adopter_prefs`
4. **Animal detail** (`animal-detail.html`)
5. **Matches** (`app-matches.html`) → uses `getMatches`
6. **Application form** (`app-application.html`) → uses `submitApplication`
7. **Messages** (`app-messages.html`) → `messages` table, realtime optional
8. **Shelter portal** (`shelter-dashboard`, `shelter-add-animal`, `shelter-application-review`)
9. **Public pages** (`shelters-directory`, `shelter-profile-bcspca`)
10. **Emails** (`email-templates.html`) → wire to Resend using the 5 templates

---

## Remaining human tasks (can't be coded ahead of time)

- [ ] Register `pawswipe.ca` (~$20/yr) and point DNS at Vercel
- [ ] Create Supabase, Petfinder, Resend, and PostHog accounts; fill `.env.local`
- [ ] Run the SQL files
- [ ] Send the shelter outreach emails (`docs/`)
- [ ] Generate Privacy Policy + Terms (Termsfeed free tier) and link them in the footer

---

## A note on data accuracy

`seed.sql` uses real organizations and animals that were verified during the design
phase. **Listings change constantly** — before any public launch, refresh from the
shelters' live pages (or the Petfinder integration) so you never show an animal that's
already been adopted. Treat the seed data as a realistic demo, not a live feed.
