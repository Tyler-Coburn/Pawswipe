# PawSwipe Vancouver — Complete Build Guide
### Everything needed to go from landing page to working app

---

## WHERE WE ARE RIGHT NOW

### ✅ Done
- **Landing page v1** — Generic PawSwipe concept, swipe card UI mockup, hero/how-it-works/features/shelter/CTA sections
- **Landing page v2** — Vancouver-localized, real shelter orgs (BC SPCA, VOKRA, RAPS, LAPS, City of Vancouver), real animal names (Linus & Chester, Snickers, Queso, Crema/Pico/Dingo, Apricot, Leona, Toretto), live shelter addresses + phone numbers, direct links to adoption pages

### ❌ Not yet built
Everything below this line.

---

## WHAT "WORKING APP" MEANS — SCOPE DECISION FIRST

Before writing a line of code, you need to decide which version you're building. This determines everything.

### Option A — Static PWA (Fastest, build in weeks)
- No backend, no database
- Data pulled from public APIs (Petfinder API, BC SPCA)
- Auth via a service like Clerk or Firebase Auth
- Swipe UI in React
- Hosted free on Vercel or Netlify
- **Good for:** Demo, MVP, investor pitch, user testing
- **Missing:** Real shelter dashboard, messaging, application tracking

### Option B — Full-Stack Web App (Realistic production app)
- React/Next.js frontend
- Supabase backend (PostgreSQL + Auth + Realtime)
- Petfinder API + manual shelter data ingestion
- In-app messaging, adoption application flow, user profiles
- Shelter admin dashboard
- **Good for:** Actual launch, real users
- **Timeline:** 3–6 months solo dev, 6–12 weeks with a team

### Option C — Native Mobile App (Full vision)
- React Native or Flutter
- All of Option B + push notifications, geolocation, camera
- App Store + Google Play submission
- **Timeline:** Add 2–4 months to Option B

**Recommendation: Build Option A first as your MVP. Validate. Then build Option B. This guide covers the full Option B stack because that's what "working app" means.**

---

## FULL TECH STACK (Recommended)

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR, SEO, routing, API routes |
| Styling | Tailwind CSS + CSS Modules | Speed + design control |
| UI Components | shadcn/ui + custom | Accessible, unstyled base |
| Swipe Engine | react-spring + @use-gesture | Physics-based card swipe |
| State | Zustand | Lightweight, no Redux boilerplate |
| Auth | Supabase Auth | Email, Google, Apple sign-in |
| Database | Supabase (PostgreSQL) | Realtime, Row Level Security |
| File Storage | Supabase Storage | Pet photos, user avatars |
| Pet Data API | Petfinder API (free) | Live BC/Vancouver listings |
| Messaging | Supabase Realtime | In-app shelter ↔ user chat |
| Maps | Mapbox GL JS | Shelter locations, distance |
| Email | Resend + React Email | Transactional emails |
| Hosting | Vercel | Edge network, CI/CD from GitHub |
| Analytics | PostHog (open source) | User behavior, funnel tracking |
| Domain | pawswipe.ca | .ca for Canadian positioning |

---

## PAGES & SCREENS TO BUILD

### Public (unauthenticated)
1. `/` — Landing page (DONE ✅ — needs React conversion)
2. `/about` — Mission, team, how it works
3. `/shelters` — All partner orgs directory
4. `/shelters/[slug]` — Individual shelter page (BC SPCA, VOKRA, etc.)
5. `/animals` — Browsable grid (no swipe, for SEO)
6. `/animals/[id]` — Individual animal profile page
7. `/blog` — Adoption tips, Vancouver pet news
8. `/sign-up` — User registration
9. `/sign-in` — Login

### Authenticated User App
10. `/app` — Swipe discovery (CORE SCREEN)
11. `/app/matches` — Animals you've liked
12. `/app/applications` — Your active adoption applications + status
13. `/app/messages` — Inbox: conversations with shelters
14. `/app/messages/[threadId]` — Individual conversation
15. `/app/profile` — Your preferences, lifestyle info, edit profile
16. `/app/settings` — Notifications, account, delete

### Shelter Admin Dashboard
17. `/shelter/dashboard` — Overview: active listings, applications, messages
18. `/shelter/animals` — Manage animal listings
19. `/shelter/animals/new` — Add new animal
20. `/shelter/animals/[id]/edit` — Edit listing
21. `/shelter/applications` — Review incoming applications
22. `/shelter/applications/[id]` — Application detail + approve/reject
23. `/shelter/messages` — Shelter inbox
24. `/shelter/settings` — Shelter profile, hours, contact info

---

## DATABASE SCHEMA

### Tables to create in Supabase

```sql
-- Users (extends Supabase auth.users)
profiles (
  id uuid PRIMARY KEY references auth.users,
  full_name text,
  avatar_url text,
  location_city text,         -- e.g. "Vancouver", "Burnaby"
  location_lat float,
  location_lng float,
  housing_type text,          -- apartment | house | condo | townhouse
  has_yard boolean,
  has_kids boolean,
  has_other_pets boolean,
  other_pets_type text,
  activity_level text,        -- low | medium | high
  experience_level text,      -- first-time | some | experienced
  allergies text[],
  preferred_species text[],   -- dog | cat | rabbit | etc
  max_pet_size text,          -- small | medium | large | any
  created_at timestamptz DEFAULT now()
)

-- Shelters / Rescue Organizations
shelters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,          -- "BC SPCA Vancouver"
  slug text UNIQUE,            -- "bc-spca-vancouver"
  type text,                   -- spca | rescue | foster-network | municipal
  address text,
  city text,
  lat float,
  lng float,
  phone text,
  email text,
  website text,
  petfinder_id text,           -- for API sync
  is_nokill boolean,
  is_foster_based boolean,
  description text,
  logo_url text,
  hours jsonb,                 -- { mon: null, tue: "12:00-16:30", ... }
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
)

-- Animals
animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id uuid references shelters,
  external_id text,            -- Petfinder ID for sync
  name text NOT NULL,
  species text,                -- dog | cat | rabbit | bird | small-animal
  breed_primary text,
  breed_secondary text,
  age_years float,
  age_label text,              -- "Baby" | "Young" | "Adult" | "Senior"
  sex text,                    -- male | female | unknown
  size text,                   -- small | medium | large | xlarge
  color text,
  coat text,
  description text,
  status text DEFAULT 'available', -- available | pending | adopted
  is_urgent boolean DEFAULT false,
  is_bonded boolean DEFAULT false,
  bonded_with uuid[],          -- array of animal IDs
  good_with_dogs boolean,
  good_with_cats boolean,
  good_with_kids boolean,
  good_with_seniors boolean,
  needs_yard boolean,
  apartment_ok boolean,
  energy_level text,           -- low | medium | high
  training_level text,
  special_needs boolean,
  special_needs_notes text,
  photos text[],               -- array of storage URLs
  primary_photo text,
  video_url text,
  location_city text,
  days_in_shelter int,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Swipes (the core interaction)
swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid references profiles,
  animal_id uuid references animals,
  direction text NOT NULL,     -- right | left | super
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, animal_id)
)

-- Matches (right swipe → shelter notified)
matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid references profiles,
  animal_id uuid references animals,
  shelter_id uuid references shelters,
  status text DEFAULT 'new',   -- new | contacted | applied | approved | rejected | adopted
  created_at timestamptz DEFAULT now()
)

-- Adoption Applications
applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid references matches,
  user_id uuid references profiles,
  animal_id uuid references animals,
  shelter_id uuid references shelters,
  status text DEFAULT 'submitted', -- submitted | reviewing | approved | rejected | withdrawn
  answers jsonb,               -- questionnaire responses
  notes text,
  shelter_notes text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  decision_at timestamptz
)

-- Messages
message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid references matches,
  user_id uuid references profiles,
  shelter_id uuid references shelters,
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now()
)

messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid references message_threads,
  sender_id uuid,              -- user or shelter staff
  sender_type text,            -- user | shelter
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
)
```

---

## API INTEGRATIONS

### 1. Petfinder API (FREE — most important)
- Sign up: developers.petfinder.com
- Free tier: 1,000 requests/day
- Gives you: live animal listings from BC SPCA Vancouver, RAPS, LAPS, others
- Pull every 6 hours via a cron job (Vercel cron or Supabase Edge Functions)
- Filter by: location=Vancouver,BC + distance=50 + country=CA

```javascript
// Example fetch
const response = await fetch(
  'https://api.petfinder.com/v2/animals?location=Vancouver,BC&distance=50&country=CA&limit=100',
  { headers: { Authorization: `Bearer ${token}` } }
)
```

### 2. BC SPCA Direct (adopt.spca.bc.ca)
- No public API — scrape or link out
- Option: Contact BC SPCA tech team for data partnership
- Their site uses WordPress + custom plugin

### 3. VOKRA
- No API — contact vokra.ca directly
- They list on Petfinder (handle: VOKRA) — covered by integration #1

### 4. RAPS
- Lists on Petfinder and Adopt-A-Pet
- Covered by Petfinder API

### 5. LAPS
- Lists on lapsbc.ca — no public API
- Check if they use Shelterluv or similar (many shelters do)

---

## CORE FEATURES — BUILD ORDER

### Phase 1: Foundation (Week 1–2)
- [ ] Next.js project setup with Tailwind + shadcn/ui
- [ ] Supabase project: tables, RLS policies, auth
- [ ] Convert landing page HTML → Next.js components
- [ ] Deploy to Vercel, connect domain (pawswipe.ca)
- [ ] Basic routing: /, /sign-up, /sign-in, /app

### Phase 2: Animal Data (Week 2–3)
- [ ] Petfinder API integration + token refresh
- [ ] Cron job: sync Vancouver-area animals every 6 hours
- [ ] Animal model in Supabase, map Petfinder fields
- [ ] `/animals` browse grid (public, for SEO)
- [ ] `/animals/[id]` detail page with photos, description, shelter info

### Phase 3: Auth + Onboarding (Week 3–4)
- [ ] Sign-up / sign-in pages (email + Google)
- [ ] Onboarding flow: 6-screen questionnaire
  - Screen 1: Where do you live? (city, housing type)
  - Screen 2: Who's at home? (kids, other pets)
  - Screen 3: Activity level + lifestyle
  - Screen 4: Experience with pets
  - Screen 5: What species? Size preference?
  - Screen 6: Any allergies or restrictions?
- [ ] Save to `profiles` table
- [ ] Profile edit page

### Phase 4: Swipe Engine (Week 4–5) ← THE CORE
- [ ] SwipeCard component with react-spring physics
- [ ] Drag gesture detection (left/right/super)
- [ ] Visual feedback: green ♥ overlay on right, red ✕ on left
- [ ] Card stack (3 cards visible, loads more as you swipe)
- [ ] Swipe saved to `swipes` table
- [ ] Right swipe → creates `match` record
- [ ] Filter controls: species, size, distance, energy level
- [ ] "Out of cards" state with refresh prompt

### Phase 5: Matches + Messaging (Week 5–6)
- [ ] `/app/matches` — grid of liked animals
- [ ] Match → shelter notification (email via Resend)
- [ ] In-app messaging with Supabase Realtime
- [ ] Message thread UI (iMessage-style)
- [ ] Read receipts

### Phase 6: Adoption Application (Week 6–7)
- [ ] Application form (triggered from match)
- [ ] Dynamic questions based on animal (dogs vs cats different questions)
- [ ] Application status tracking (submitted/reviewing/approved/rejected)
- [ ] Email notifications at each status change
- [ ] `/app/applications` status dashboard

### Phase 7: Shelter Dashboard (Week 7–9)
- [ ] Shelter sign-up flow (separate from user)
- [ ] `/shelter/dashboard` with metrics
- [ ] Animal listing management (add/edit/archive)
- [ ] Photo upload to Supabase Storage
- [ ] Application inbox + review UI
- [ ] Approve/reject with notes
- [ ] Messaging with applicants

### Phase 8: Polish + Launch (Week 9–10)
- [ ] Mobile responsiveness audit
- [ ] Performance: image optimization, lazy loading
- [ ] SEO: meta tags, OG images, sitemap
- [ ] Analytics: PostHog events on swipe, match, apply
- [ ] Error handling, empty states, loading skeletons
- [ ] Accessibility audit (WCAG AA)
- [ ] Legal: Privacy Policy, Terms of Service (Canadian law)
- [ ] Beta launch with BC SPCA / VOKRA partnership outreach

---

## ASSETS TO CREATE

### Immediately (I will build these)
- [ ] `/app` — Swipe UI screen (full working component)
- [ ] Onboarding questionnaire flow (6 screens)
- [ ] Animal detail page template
- [ ] Shelter directory page
- [ ] Match notification email template
- [ ] Application form component
- [ ] Shelter dashboard UI
- [ ] App icon (SVG, multiple sizes)
- [ ] OG image for social sharing
- [ ] Loading skeleton components
- [ ] Empty states (no more animals, no matches yet)
- [ ] Error pages (404, 500)

### Branding Assets
- [ ] Logo (wordmark + icon variants)
- [ ] Favicon set (16x16, 32x32, 180x180 apple-touch)
- [ ] OG image (1200x630) for link previews
- [ ] App icon (1024x1024 for App Store later)
- [ ] Colour palette finalised as design tokens

---

## WHAT TO BUILD NEXT (Suggested Order)

Tell me which to start with and I'll build it immediately:

### 🥇 Option 1 — Swipe Screen (the "wow" moment)
Full working `/app` swipe UI: card stack, drag physics, left/right/super, overlays, filters panel, "match!" celebration modal. This is the heart of the app.

### 🥈 Option 2 — Onboarding Flow
All 6 onboarding screens as a React component: animated step transitions, progress bar, housing/lifestyle questions, saves to state (ready to wire to Supabase).

### 🥉 Option 3 — Animal Detail Page
Full animal profile: photo gallery, personality traits, compatibility matrix, shelter info + hours, adopt button, share button, map embed. Works as a standalone page.

### 🏅 Option 4 — Complete Design System
Tokens, typography scale, button variants, card components, tag/badge components, form elements, modals — all in one reusable file. Foundation for everything else.

### 🎯 Option 5 — Shelter Dashboard
Admin UI: metrics overview, animal listing table, application queue with approve/reject, messaging inbox. The B2B side of the product.

---

## REALISTIC TIMELINE

| Milestone | Time (solo dev) | Time (with help) |
|---|---|---|
| MVP swipe app (Phase 1–4) | 6–8 weeks | 3–4 weeks |
| Full feature set (Phase 1–7) | 4–5 months | 8–10 weeks |
| Beta launch with real shelters | Add 4 weeks for partnership setup | Same |
| App Store submission | Add 4–6 weeks | Same |

---

## PARTNERSHIP OUTREACH (Do this early)

Contact these orgs before the app is done — they need lead time:

1. **BC SPCA Tech Team** — email tech@spca.bc.ca, ask about data sharing agreement and Petfinder partnership status
2. **VOKRA** — vokra.ca contact form, introduce the concept, offer free shelter dashboard
3. **RAPS** — rapsbc.com, same pitch
4. **LAPS** — lapsbc.ca, same pitch
5. **City of Vancouver Animal Services** — vancouver.ca, contact animal-services@vancouver.ca

Key ask: "We want to feature your animals on our platform and send you pre-qualified adoption applicants. It's free for shelters."

---

## LEGAL REQUIREMENTS (Canada / BC)

- **PIPEDA compliance** — Canadian federal privacy law for personal data
- **BC PIPA** — BC Personal Information Protection Act
- **Privacy Policy** — must disclose: data collected, how used, retention, deletion rights
- **Terms of Service** — user conduct, shelter responsibilities, no guarantee of adoption
- **Cookie consent** — required for analytics
- **Accessibility** — AODA-aligned (not legally required federally but best practice)

---

## WHAT I CAN BUILD FOR YOU RIGHT NOW

Just say the word. I'll build each of these as complete, production-ready files:

1. **Full swipe screen** (React, with physics + animations)
2. **Onboarding flow** (React multi-step)
3. **Animal card component** (reusable, all states)
4. **Shelter directory page** (with all 5 real Vancouver orgs)
5. **Application form** (multi-step, with validation)
6. **Shelter dashboard** (full admin UI)
7. **Design system** (tokens, components)
8. **Match celebration modal** (confetti + contact CTA)
9. **Email templates** (match notification, application update)
10. **Logo + app icon** (SVG)

Pick one (or several) and I'll start immediately.
