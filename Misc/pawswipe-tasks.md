# PawSwipe Vancouver — Web App Task Master
## Complete task list · Claude build instructions · Human tasks

---

## DESIGN SYSTEM REFERENCE (carry through all builds)

```
Colors:
  --cream:       #FDF6EC   (page background)
  --warm-white:  #FFFAF4   (card backgrounds)
  --amber:       #E8923A   (primary accent)
  --amber-deep:  #C97520   (amber hover)
  --clay:        #A84E2A   (primary CTA, headings)
  --sage:        #4A6E5C   (positive/nature tags)
  --sage-light:  #7EA88E
  --blush:       #F2C4A0   (light accent fills)
  --rain:        #7B9DB0   (location/info tags)
  --rain-light:  #B8D0DC
  --charcoal:    #1E1A17   (dark backgrounds, primary text)
  --mid:         #6B5E52   (secondary text)
  --light-stroke: rgba(232,146,58,0.15)

Fonts:
  Display: Fraunces (900 bold, 700, 300 italic) — headlines
  Body:    DM Sans (300, 400, 500) — UI text

Motion principles:
  - Scroll reveals: opacity 0→1, translateY 26px→0, 0.65s ease
  - Hover lifts: translateY(-4px to -6px), box-shadow increase
  - CTA buttons: translateY(-2px) on hover
  - Stagger delays: 70–80ms between sibling reveals
  - All transitions: 0.2s–0.3s ease unless physics-based

Radii: 100px (pills), 18–22px (cards), 12–14px (inner elements), 10px (buttons)
Shadows: 0 4px 22px rgba(168,78,42,0.25) for clay CTAs; 0 18px 55px rgba(30,26,23,0.12) for cards
```

---

## LEGEND
- 🤖 = Claude builds this (full code provided)
- 👤 = Human task (account, service, decision)
- 🤝 = Collaboration (Claude builds, human configures)
- ✅ = Already done

---

## PHASE 0 — ALREADY COMPLETE
- ✅ Landing page v1 (generic concept) — `pawswipe-landing.html`
- ✅ Landing page v2 (Vancouver-localised, real shelters/animals) — `pawswipe-vancouver.html`
- ✅ Build guide — `pawswipe-build-guide.md`

---

## PHASE 1 — FOUNDATION & DESIGN SYSTEM

---

### TASK 1.1 🤖 — Design System & Component Library
**File:** `design-system.html`
**Priority:** CRITICAL — all other builds reference this

**What it is:** A single living reference file containing every reusable UI component in the app. Not just documentation — actual rendered components you can copy from.

**Claude build instructions:**
- Render every component in a two-column layout: left = live component, right = description/specs
- **Colour swatches:** All 12 CSS variables rendered as labelled tiles with hex + usage note
- **Typography scale:** Display (Fraunces) at 72/48/36/28/22/18px + body (DM Sans) at 16/14/12px, each labelled with usage
- **Buttons:** Primary (clay filled), Secondary (outline clay), Ghost (text only), Danger (for reject actions), Icon-only round. All with :hover state shown via JS class toggle demo
- **Tags/Badges:** Species tag, Urgency badge (🔥 Urgent), New badge, Bonded badge, No-kill badge, Location tag, Trait tags (green/blue/blush variants). Show all
- **Cards:** Animal card (full), Animal card (compact grid), Shelter pill, Org profile card, Stat card
- **Form elements:** Text input, Select dropdown, Toggle switch, Checkbox, Radio group, Textarea — all with label + error state + focus state
- **Navigation:** Full nav bar (desktop + mobile hamburger demo)
- **Modals:** Base modal shell, Match celebration modal layout, Confirmation dialog
- **Empty states:** "No more animals nearby", "No matches yet", "No messages" — each with icon + headline + CTA
- **Loading states:** Card skeleton (animated shimmer), Grid skeleton, Text skeleton
- **Alerts:** Success, Warning, Error, Info — with icon + dismiss button
- **Avatar:** User avatar with initials fallback, Shelter logo placeholder
- **Progress bar:** For onboarding steps
- **Tab bar:** For /app mobile bottom nav
- All components use the exact CSS variables — no hardcoded colours
- Include a `<style>` block at top with all variables + global resets
- Include Google Fonts import for Fraunces + DM Sans
- Add a sticky left sidebar that links to each section

---

### TASK 1.2 🤖 — App Logo & Brand Mark (SVG)
**File:** `pawswipe-logo.svg` + `pawswipe-favicon.svg` + `pawswipe-og-image.html`
**Priority:** HIGH

**Claude build instructions for logo SVG:**
- Wordmark: "Paw" in Fraunces 900 italic, "Swipe" in Fraunces 900 upright
- "Paw" = clay (#A84E2A), "Swipe" = amber (#E8923A)
- Icon mark: A simplified paw print where the central pad is replaced with a subtle right-pointing arrow/swipe indicator. Clean, geometric, single-path if possible. Works at 16px (favicon) and 512px (app icon)
- Deliver 4 variants: (1) horizontal lockup light bg, (2) horizontal lockup dark bg, (3) icon mark only, (4) stacked lockup
- All as inline SVG with viewBox, no external dependencies

**Claude build instructions for OG image:**
- HTML file that renders as a 1200×630 image (use exact pixel dimensions in CSS)
- Background: charcoal (#1E1A17) with subtle amber radial gradient centre
- Large Fraunces headline: "Find your perfect match in Vancouver" 
- Subtext: "BC SPCA · VOKRA · RAPS · LAPS" in rain colour
- PawSwipe wordmark top-left
- Paw emoji decorative bottom-right, large, low opacity
- Vancouver skyline silhouette SVG drawn inline at bottom (simple geometric mountains + buildings)

---

### TASK 1.3 👤 — Development Environment Setup
**Human must complete:**
- [ ] Install Node.js 20+ (nodejs.org)
- [ ] Install VS Code (code.visualstudio.com)
- [ ] Install Git (git-scm.com)
- [ ] Create GitHub account/repo: `pawswipe-vancouver`
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Run `npx create-next-app@latest pawswipe --typescript --tailwind --app`
- [ ] Push to GitHub, connect to Vercel (vercel.com → Import Git Repository)

---

### TASK 1.4 👤 — Supabase Project Setup
**Human must complete:**
- [ ] Create account at supabase.com
- [ ] New project: "pawswipe-vancouver", region: US West (closest to Vancouver)
- [ ] Copy: Project URL, anon key, service role key → save in `.env.local`
- [ ] Run the database schema SQL from the build guide (tables: profiles, shelters, animals, swipes, matches, applications, message_threads, messages)
- [ ] Enable Row Level Security on all tables
- [ ] Enable Realtime on: messages, message_threads, matches
- [ ] Create Storage bucket: `animal-photos` (public), `user-avatars` (authenticated)

---

### TASK 1.5 👤 — Petfinder API Access
**Human must complete:**
- [ ] Register at developers.petfinder.com
- [ ] Create application → get Client ID + Client Secret
- [ ] Add to `.env.local`: `PETFINDER_CLIENT_ID`, `PETFINDER_CLIENT_SECRET`
- [ ] Test endpoint: GET `https://api.petfinder.com/v2/animals?location=Vancouver,BC&distance=50`
- [ ] Note: token expires every 3600s — refresh logic needed in sync job

---

## PHASE 2 — PUBLIC PAGES

---

### TASK 2.1 🤖 — Swipe Discovery App Screen (`/app`)
**File:** `app-swipe-screen.html`
**Priority:** CRITICAL — this is the product's soul

**Claude build instructions:**
- Full browser viewport layout. No scroll. Everything fits on screen.
- **Header strip (top, 56px):** PawSwipe logo left, notification bell + avatar right. Thin amber bottom border
- **Filter bar (below header, 48px):** Horizontal scrollable pill row. Pills: "All", "Dogs", "Cats", "Small Animals", "Urgent 🔥", "Near Me 📍", "No-kill ♻️". Selected pill = clay filled white text, unselected = cream bg clay text. Subtle shadow below bar.
- **Card stack (centre, takes remaining height):** 
  - Show 3 cards in a z-stack. Card 3 (back) rotated 5deg, 90% scale, 60% opacity. Card 2 rotated -2deg, 95% scale, 80% opacity. Card 1 (front) 100% scale, full opacity, floating animation (4s sine, -8px vertical)
  - Front card dimensions: 340px wide, auto height, max-height 540px
  - Card anatomy top→bottom:
    - Photo area (240px): large emoji placeholder (will be real photos), gradient overlay bottom 60px with animal name
    - Urgency ribbon (absolute top-left): "🔥 Urgent" or "New 🌱" or "Bonded 💕"
    - Shelter badge (absolute top-right): org name pill in rain colour
    - Name + meta overlay (absolute bottom of photo): Fraunces 700 28px white name, 13px breed/age/location below
    - Body section (white, padding 18px 20px):
      - Trait tags row (scrollable if many): use existing tag styles
      - Compatibility row: small icons + labels "✓ Good with kids" "✓ Apartment ok" "✗ No cats" in sage/clay
      - "Days in care" subtle stat bottom-right of card body
  - **Drag interaction (JavaScript):** On mousedown/touchstart capture pointer. On drag: apply `transform: rotate(Xdeg) translateX(Ypx)` where X = drag_distance/20 (max ±15deg). Show RIGHT SWIPE overlay (green, semi-transparent, "♥ ADOPT" text, 0→1 opacity as drag goes right). Show LEFT SWIPE overlay (clay, semi-transparent, "✕ PASS", same). On release: if |drag| > 120px, animate card off screen in drag direction + load next card. If < 120px, spring back to center (CSS transition 0.4s cubic-bezier(0.34,1.56,0.64,1))
  - **Match celebration:** When right swipe completes, after 400ms: show fullscreen overlay. Charcoal bg 90% opacity. Centered content: large paw confetti animation (10 paw emojis 🐾 animate from center outward with random trajectories, fade out over 1.2s). "It's a Match!" in Fraunces 900 64px cream. Animal name. "Message [Shelter Name]" primary button. "Keep Swiping" ghost button. Overlay dismisses on either button
- **Action buttons (bottom, above tab bar, 72px row):** Three buttons centred:
  - Rewind button (medium, outline circle, ↩ icon) — undo last swipe
  - Pass button (large, clay circle 64px, ✕ icon)
  - Like button (large, amber circle 64px, ♥ icon)
  - Super-like button (medium, sage circle, ⭐ icon) — for urgent animals
- **Bottom tab bar (mobile, 56px):** Discover (paw icon, active) · Matches (heart) · Applications (clipboard) · Messages (chat) · Profile (person). Active tab = amber. Tabs shift page content (use CSS for layout)
- **Keyboard support:** → key = like, ← key = pass, ↑ key = super-like, ← backspace = rewind
- **Demo data:** Preload 8 real Vancouver animals: use the names/orgs from the landing page (Linus & Chester from BC SPCA, Queso from BC SPCA West Van, Apricot from VOKRA, Leona from VOKRA, Toretto from VOKRA, Snickers from BC SPCA, plus 2 invented but realistic animals)
- **Empty state:** After swiping all 8: "You've seen all animals in your area 🎉" + "Check back tomorrow — shelters update listings daily" + links to BC SPCA and VOKRA directly
- Use existing CSS variable palette exactly. Add only new variables needed for overlays.

---

### TASK 2.2 🤖 — Onboarding Flow (6 screens)
**File:** `app-onboarding.html`
**Priority:** HIGH

**Claude build instructions:**
- Single HTML file. JavaScript manages which screen is shown (currentStep variable, 0–5)
- **Outer shell:** Full viewport. Cream background. PawSwipe logo top-left. Step progress bar top-right: "Step 2 of 6" text + thin amber progress bar (animated width transition). Back arrow top-left (except step 0)
- **Step transitions:** On Next: current screen slides left off screen, new screen slides in from right. On Back: reverse. Use CSS transform + transition 0.35s ease.
- **CTA button:** Full-width at bottom of each step, clay filled, "Continue →", disabled grey state when required field empty
- **Step 0 — Welcome:**
  - Large Fraunces headline: "Let's find your perfect match."
  - Body text: "A few quick questions so we can show you animals that actually fit your life — not just cute faces."
  - Big paw emoji illustration (🐾, 120px, amber tint)
  - Button: "Let's go →"
- **Step 1 — Where do you live?**
  - Headline: "Where's home?"
  - City selector: styled dropdown with Vancouver-area options: Vancouver, Burnaby, Richmond, North Vancouver, West Vancouver, Coquitlam, Surrey, Langley, New Westminster, Maple Ridge, Other Lower Mainland
  - Housing type: 4 large toggle cards arranged 2×2: 🏢 Apartment/Condo, 🏠 House, 🏘 Townhouse, 🏡 Other. Click = selected state (clay border + blush bg + clay checkmark top-right)
  - Yard question (appears after housing selection, slide-in): "Do you have a yard or outdoor space?" → Yes / No toggle pills
- **Step 2 — Who's at home?**
  - Headline: "Tell us about your household."
  - "Any children at home?" → Yes / No pills
  - "Any other pets?" → No / Dogs / Cats / Both / Other. Pills row.
  - If "Dogs" or "Both" selected: slide-in "What size?" Small / Medium / Large pills
  - If "Cats" or "Both" selected: slide-in "How many cats?" 1 / 2 / 3+ pills
- **Step 3 — Your lifestyle:**
  - Headline: "How active are you?"
  - 3 large illustrated option cards stacked vertically:
    - 🛋 "Homebody" — I prefer relaxed walks and quiet evenings
    - 🚶 "Moderate" — I walk daily and enjoy weekend outings  
    - 🏃 "Very active" — I hike, run, or spend lots of time outdoors
  - Click = selected (full clay left border + blush tint)
  - Below: "How many hours are you home each day?" → slider 0–16, shows value live "~8 hours/day", amber thumb
- **Step 4 — Your experience:**
  - Headline: "Have you had pets before?"
  - 3 option cards:
    - 🐣 "First time" — This is my first pet
    - 🐾 "Some experience" — I've had pets but it's been a while
    - ⭐ "Experienced" — I've had pets most of my life
  - Checkbox (unchecked by default): "I'm open to animals with special needs"
  - Checkbox: "I can handle a shy or anxious animal"
- **Step 5 — What are you looking for?**
  - Headline: "What kind of companion?"
  - Species multi-select (can choose multiple): 🐶 Dog, 🐱 Cat, 🐰 Rabbit, 🐦 Bird, 🐹 Small Animal. Large icon cards in a row. Selected = amber border + checkmark
  - Size preference (if dog selected, slides in): Any size / Small (under 10kg) / Medium (10–25kg) / Large (25kg+) pills
  - Age preference: Any / Baby/Kitten / Young / Adult / Senior. Pills.
  - One more thing: "Any allergies we should know about?" — text input, placeholder "e.g. cats, dogs, none"
- **Completion screen (after step 5):**
  - Headline: "You're all set, [name]!" 
  - "We've found [X] animals nearby that match your life." (animate number counting up from 0 to random 12–28)
  - 3 small animal card thumbnails slide in (use demo data)
  - Button: "Start Swiping →" → takes to swipe screen
- All form state saved in a JS object `userProfile = {}`, console.log on completion (ready for Supabase wire-up)

---

### TASK 2.3 🤖 — Animal Detail Page
**File:** `animal-detail.html`
**Priority:** HIGH

**Claude build instructions:**
- Desktop: 2-column layout (photo left 55%, details right 45%). Mobile: single column, photos top.
- **Back navigation:** "← Back to results" top-left, clay text, no decoration
- **Photo gallery (left column, desktop / top mobile):**
  - Main photo: full-height container (500px desktop), emoji placeholder with coloured bg, rounded-r-none on desktop
  - Thumbnail strip below: 5 small thumbnails (60×60px), selected = amber border, click switches main photo
  - Navigation arrows on main photo (◀ ▶) for keyboard/click browsing
  - "Share" button absolute top-right of photo (SVG share icon, cream bg, subtle shadow)
  - Urgency ribbon if urgent: diagonal ribbon top-left "🔥 URGENT — Needs home now"
- **Details (right column / below photos mobile):**
  - Shelter badge: org logo placeholder + org name in rain colour, pill
  - Headline: Animal name in Fraunces 900 48px
  - Quick facts row: Age · Breed · Sex · Size — separated by · midpoints, DM Sans 15px mid colour
  - Distance: "📍 3.2 km from Vancouver" in sage
  - Days in care: "In care for 47 days" — if > 30 days, show in clay colour with subtle urgency
  - **Trait grid (2×N grid of trait cards, 12px radius):**
    - Each card: icon + label + value. Examples:
    - 🏃 Energy level: High
    - 🏠 Housing: Apartment OK
    - 👶 Kids: Good with children
    - 🐱 Cats: Not recommended
    - 🐶 Dogs: Loves other dogs
    - 🌱 Experience: Good for first-timers
    - ❤️ Special needs: None
    - Positive traits = sage bg, Negative/caution = blush bg, Neutral = cream bg
  - **About section:** "About [Name]" in Fraunces 700 20px, then shelter's description text (3–5 sentences of lorem ipsum pet bio), 16px DM Sans 300, 1.75 line-height
  - **Compatibility score (unique feature):** 
    - "Your compatibility: 87%" — circular progress ring (SVG, amber stroke, animated on load from 0%)
    - Below: 3 bullet reasons: "✓ Matches your activity level" "✓ Great for apartments" "✓ Good with your household"
    - Note: "(Based on your preferences — sign in to see full report)"
  - **Shelter info card:** Charcoal bg, org name, address, phone, hours table, "View all animals from this shelter →" link
  - **CTA block:**
    - Primary: "♥ I'm Interested" — full width clay button, triggers match flow
    - Secondary: "📅 Schedule a Meet & Greet" — outline button
    - Ghost: "Save for Later" — text link
  - **Similar animals:** "More animals from [Shelter]" — horizontal scroll row of 4 compact animal cards
- **Sidebar (desktop, sticky right edge):** Compact version of CTA block + shelter contact

---

### TASK 2.4 🤖 — Shelter Directory Page (`/shelters`)
**File:** `shelters-directory.html`
**Priority:** MEDIUM

**Claude build instructions:**
- Hero section (compact, not full-height): Charcoal bg, "Find shelters & rescues near you" Fraunces headline, search input (styled, with 📍 icon), region filter pills: All · Vancouver · North Shore · Richmond · Langley · Burnaby & Tri-Cities
- **Map area placeholder (full width, 360px height):** Charcoal bg with "Map view coming soon" + light grid overlay to suggest a map. 5 amber dot markers at approximate real shelter locations with shelter name tooltips on hover. (Mapbox will replace this in production — this is the mockup)
- **Shelter cards grid (below map):** 2 columns desktop, 1 mobile. One card per real shelter.
  - Card anatomy: Logo placeholder (60×60 rounded, org initial in amber on clay bg) · Org name Fraunces 700 · Location + distance · Type badge (SPCA / Rescue / Foster Network / Municipal) · No-kill badge if applicable · Short description (2 sentences) · Stats row: "X animals currently available" · Hours snippet: "Open Tue–Sun 12–4pm" · Two buttons: "See animals →" (clay) + "Website ↗" (ghost)
- **Shelter cards to include (use all real data):**
  1. BC SPCA Vancouver — 1205 E 7th Ave — (604) 879-7721 — Open Mon–Wed, Fri 12–4:30pm, Sat–Sun 12–4pm
  2. BC SPCA West Vancouver — 1020 Pound Rd — (604) 922-4622 — Open Tue–Sun 10–5pm (admin), 12–3pm (adoptions)
  3. VOKRA — 2028 Wall St, Vancouver — (778) 874-1486 — Foster-based, by appointment
  4. RAPS — Richmond — rapsbc.com — Open Sat–Sun 12–4pm (adoptions)
  5. LAPS — Langley (Patti Dale Animal Shelter) — lapsbc.ca — Langley City + Township
  6. City of Vancouver Animal Services — Dogs & small animals only — By appointment — animalshelter@vancouver.ca
- **"Is your rescue listed?" section at bottom:** Sage bg, "Partner with PawSwipe — free for shelters" pitch, email input + "Apply to partner" button

---

### TASK 2.5 🤖 — Individual Shelter Page (`/shelters/bc-spca-vancouver`)
**File:** `shelter-profile-bcspca.html`
**Priority:** MEDIUM

**Claude build instructions:**
- This is the template — build it for BC SPCA Vancouver specifically with all real data
- **Header:** Full-width banner (280px, charcoal bg + subtle amber radial). Org logo left (large placeholder). Org name Fraunces 900 white. Type badge + No-kill badge. Verified checkmark (amber ✓)
- **Quick stats bar (below header, cream bg):** 4 stat tiles: "248 animals listed" · "Est. 1895" · "36 BC branches" · "53,000+ helped/year"
- **Content grid (2-col desktop):**
  - Left (65%): 
    - "About" section with real BC SPCA description
    - "Currently Available" — filterable grid of animal cards (use real animals: Linus, Chester, Snickers + 4 placeholders). Filter by: All / Dogs / Cats / Small Animals
    - "Adoption stories" — 2 testimonial cards with quote + adopter first name + animal name
  - Right (35%, sticky):
    - Contact card: address (map embed placeholder), phone, email, website link
    - Hours table: formatted cleanly, closed days greyed
    - "Adoption fee" info box: fees by species (cats $100–200, dogs $200–400, rabbit $50)
    - "What's included" checklist: microchip ✓, BC Pet Registry ✓, vaccinations ✓, spay/neuter ✓
    - Social links row: Facebook / Instagram icons
- **"Nearby shelters" section at bottom:** 3 compact shelter cards for VOKRA, RAPS, West Van

---

### TASK 2.6 🤖 — User Profile & Preferences (`/app/profile`)
**File:** `app-profile.html`
**Priority:** MEDIUM

**Claude build instructions:**
- Authenticated page layout (use the tab bar from swipe screen)
- **Profile header:** Large avatar (96px circle, charcoal bg with user initial in amber) · Name · "Vancouver, BC" · "Member since May 2026" · Edit button (top-right pencil icon)
- **Preference summary cards (the core of this page):**
  - "Your pet preferences" — expandable card. Summary chips showing their onboarding answers: "Apartment · No yard · 2 cats · Very active · Experienced · Dogs & Cats · Medium size"
  - "Edit preferences" link → re-opens onboarding flow pre-populated
- **Activity section:**
  - "Your stats": Fraunces big numbers: "47 Profiles viewed · 12 Liked · 3 Applications · 1 Adopted 🎉"
  - Small chart (CSS bar chart, amber bars): swipe activity last 7 days
- **Saved animals section:** Horizontal scroll row of saved/bookmarked animals. Empty state: "Tap ⭐ on any animal to save them here"
- **Settings list (bottom):**
  - 🔔 Notifications — toggle: New matches, Application updates, Shelter news
  - 📍 Location — current city setting
  - 🔒 Privacy — link
  - 📄 Terms & Privacy Policy — links
  - 🚪 Sign out — clay text, no button weight
  - 🗑 Delete account — destructive red text

---

### TASK 2.7 🤖 — Matches Screen (`/app/matches`)
**File:** `app-matches.html`
**Priority:** MEDIUM

**Claude build instructions:**
- Tab bar active on Matches. Header: "Your Matches" Fraunces 700 28px
- **Tabs below header:** "Active (3)" · "Applications (2)" · "Adopted (1)" — underline style tabs
- **Match cards (Active tab):** List layout (not grid — more information density)
  - Each card: Animal photo (80×80 circle) · Name + breed · Shelter name · "Matched [X] days ago" · Status pill: "New" (amber) / "Contacted" (rain) / "Applied" (sage) / "Interview" (clay) 
  - Right side: "Message →" button + "View animal" link
  - Subtle left border colour-coded by status
- **Empty state for each tab:** Unique illustration (large emoji) + message. Active empty: "No matches yet — start swiping! 🐾". Applications empty: "Apply to adopt one of your matches". Adopted empty: "Your adopted pets will be celebrated here 🎉"
- **"New match" toast notification demo:** Show a toast sliding in from top: "[Photo] 🎉 New match! Queso from BC SPCA West Van is waiting for you." With "Message" and "Dismiss" actions. Auto-dismiss after 5s with progress bar

---

### TASK 2.8 🤖 — Messaging Screen (`/app/messages`)
**File:** `app-messages.html`
**Priority:** MEDIUM

**Claude build instructions:**
- Desktop: 2-panel layout (thread list left 35%, conversation right 65%). Mobile: thread list full-width, tap to open conversation (back button returns to list)
- **Thread list panel:**
  - Header: "Messages" Fraunces 700 22px
  - Search bar: "Search conversations..." with 🔍 icon, cream bg, amber focus ring
  - Thread items: Avatar (org logo) · Org name bold · Last message preview (1 line, truncated) · Timestamp right · Unread count badge (amber circle) if unread
  - Active thread: clay-tinted bg, left clay border 3px
  - 3 demo threads: BC SPCA Vancouver (re: Linus & Chester), VOKRA (re: Apricot), BC SPCA West Vancouver (re: Queso)
- **Conversation panel:**
  - Header: Shelter name + "Re: [Animal Name]" subtext · Avatar · "View animal →" link right
  - Messages area (scrollable, flex-col):
    - Date separator pills: "Today", "Yesterday", "May 15"
    - Shelter messages: left-aligned, warm-white bg, rounded-r-xl rounded-tl-xl, DM Sans 14px, timestamp below small
    - User messages: right-aligned, clay bg cream text, rounded-l-xl rounded-tr-xl
    - System messages (centred, small, mid colour): "Application submitted · May 16" "Application approved ✓"
  - Demo conversation for BC SPCA (Linus & Chester):
    - BC SPCA: "Hi! Thanks for your interest in Linus and Chester. They're a wonderful bonded pair who've been together their whole lives. Do you have any questions about them?"
    - User: "Hi! Yes — I live in a 2-bedroom apartment in Kitsilano. Would that work for them? They look so sweet together."
    - BC SPCA: "That sounds perfect actually! They're both low-energy dogs who would do wonderfully in an apartment. Linus is a Havanese mix and Chester is a Chihuahua-Dachshund — both small breeds. Would you like to schedule a meet and greet?"
    - User: "I'd love that! I'm available this weekend."
    - BC SPCA: "Great! We're open Saturday 12–4pm at 1205 E 7th Ave. Does Saturday at 1pm work for you?" [Today, 2 hours ago]
    - User: "Saturday at 1pm is perfect. See you then! 🐾" [Today, 1 hour ago — unread by shelter]
  - **Input bar:** Full-width bottom. Textarea (auto-height, max 120px) · Send button (amber, arrow icon) · Attach button (paperclip) · Left: quick-reply pills above input: "When are you open?" / "What's the adoption fee?" / "Is this pet still available?"
- **Empty state (no messages):** "Your conversations with shelters will appear here. Like an animal to start chatting! 🐾"

---

### TASK 2.9 🤖 — Adoption Application Form
**File:** `app-application.html`
**Priority:** HIGH

**Claude build instructions:**
- Modal overlay OR dedicated page (build as full page)
- **Header:** "Adoption Application" · Animal name + shelter name subtitle · Progress: "Step 2 of 4"
- **Step 1 — About You:**
  - Full name (pre-filled from profile)
  - Email (pre-filled)
  - Phone number
  - Current address (street, city, postal code) — Vancouver postal codes start with V
  - How long at current address: dropdown
  - Do you rent or own?: Rent / Own pills — if Rent: "Do you have landlord permission for pets?" Yes / No / Will ask
- **Step 2 — Your Home:**
  - Housing type (pre-filled from profile but editable)
  - Yard access (pre-filled)
  - "How would [Animal Name] spend most of their time?" → Indoor / Mix of indoor and outdoor / Mostly outdoor
  - "Where will [Animal Name] sleep?" → My bed / Dog/Cat bed in bedroom / Crate / Their own space / Undecided
  - "How many hours per day will [Animal Name] be alone?" → Slider 0–12
- **Step 3 — Your Experience:**
  - Experience level (pre-filled from profile)
  - "Do you currently have other pets?" — list them (type, age, spayed/neutered)
  - "Have you ever had to give up a pet?" Yes / No → if Yes: "What happened?" text area (required, sensitive prompt: "We ask this to understand the full picture, not to judge.")
  - "What attracted you to [Animal Name] specifically?" — textarea required, min 50 chars
  - "What are you hoping this animal will bring to your life?" — textarea
- **Step 4 — Agreement & Submit:**
  - Summary of their answers (collapsed cards, expandable)
  - Checkbox: "I understand that adoption is a lifelong commitment and I am prepared to provide proper care, veterinary attention, and a loving home."
  - Checkbox: "I agree that if my circumstances change, I will contact [Shelter Name] before rehoming this animal."
  - Checkbox: "I consent to a home visit if requested by the shelter."
  - Submit button: "Submit Application →" (clay, full width)
  - Small print: "The shelter typically responds within 3–5 business days."
- **Success screen (after submit):**
  - Large ✓ checkmark (animated SVG draw-on, amber)
  - "Application submitted! 🐾"
  - "We've let [Shelter Name] know you're interested in [Animal Name]. They'll be in touch at [email] within 3–5 business days."
  - "In the meantime, feel free to message them directly." → Message button
  - "Keep swiping" → back to discover

---

### TASK 2.10 🤖 — 404 & Error Pages
**File:** `404.html`
**Priority:** LOW

**Claude build instructions:**
- Charcoal background, full viewport
- Large "404" in Fraunces 900, cream, very large (20vw), low opacity behind content
- Centred content: 🐾 paw emoji 80px · "Hmm, that page went for a walk." Fraunces 700 32px cream · "The page you're looking for might have been adopted by another URL." DM Sans 16px mid colour
- Two buttons: "Go home →" (clay) · "Browse animals" (outline cream)
- Subtle ambient animation: the 🐾 emoji gently bouncing

---

## PHASE 3 — SHELTER ADMIN DASHBOARD

---

### TASK 3.1 🤖 — Shelter Dashboard Overview
**File:** `shelter-dashboard.html`
**Priority:** HIGH

**Claude build instructions:**
- Completely different visual language from the user-facing app: **professional, data-focused, still on-brand but more utilitarian**
- Left sidebar (260px, charcoal bg): PawSwipe logo + "Shelter Portal" label in small amber text · Shelter name + city · Navigation items with icons:
  - 📊 Dashboard (active)
  - 🐾 Animals
  - 📋 Applications  
  - 💬 Messages
  - 📈 Analytics
  - ⚙️ Settings
  - Divider
  - 🏥 BC SPCA Vancouver (shelter identity, bold)
  - 🚪 Sign out
- **Main content (right of sidebar):**
  - Top bar: "Good morning, Vancouver Branch 👋" · Date · "Add animal +" button (amber)
  - **KPI tiles row (4 across):**
    - "Animals available" — 12 (large Fraunces number) + green ↑ trend
    - "New applications" — 7 (amber, unread badge) + "3 need response" subtext in clay
    - "Active conversations" — 5 (rain colour) + "2 unread"
    - "Adoptions this month" — 4 (sage) + "↑ 2 vs last month"
  - **"Applications needing attention" table:**
    - Columns: Animal · Applicant · Submitted · Status · Action
    - 5 rows of realistic data using real animal names (Linus & Chester, Snickers, etc.)
    - Status pills: "New" (amber), "Reviewing" (rain), "Approved" (sage), "Rejected" (outline mid)
    - Action buttons per row: "Review →" or "Message" depending on status
  - **"Your listings" quick table:**
    - Columns: Photo · Name · Species · Days listed · Applications · Status · Edit
    - 6 rows of animals, real names where possible
    - Status: "Available" (sage), "Pending" (amber), "On Hold" (clay)
  - **"Recent messages" panel (right sidebar within main):**
    - 3 most recent conversations, compact format
    - Unread count highlighted
    - "View all →" link

---

### TASK 3.2 🤖 — Add/Edit Animal Listing Form (Shelter)
**File:** `shelter-add-animal.html`
**Priority:** HIGH

**Claude build instructions:**
- 2-column layout (form left, live preview card right — preview updates as you type)
- **Form sections (left, accordion-style, each expandable):**
  - **Section 1 — Basic Info:**
    - Animal name (text input)
    - Species (large toggle cards: Dog / Cat / Rabbit / Bird / Small Animal)
    - Breed primary (searchable select — long list, type to filter)
    - Breed secondary / Mix (optional)
    - Sex: Male / Female / Unknown pills
    - Age (number input + "years" label, or select: Baby / Young / Adult / Senior)
    - Size: Small / Medium / Large / X-Large pills
    - Colour (text)
    - Coat type (text, optional)
  - **Section 2 — Photos & Media:**
    - Drag-and-drop upload zone (dashed border, amber dashed, paw icon centre, "Drop photos here or click to browse")
    - Shows thumbnail grid of uploaded photos (4×N)
    - "Set as primary" button on hover of each thumb
    - Max 10 photos note
    - Video URL field (YouTube/Vimeo, optional)
  - **Section 3 — Personality & Traits:**
    - Energy level: Low / Medium / High pills
    - Training: Untrained / Basic / Well-trained pills
    - "Good with dogs?" Yes / No / Unknown
    - "Good with cats?" Yes / No / Unknown  
    - "Good with children?" Yes / No / Depends pills
    - "Good with seniors?" Yes / No toggle
    - "Apartment friendly?" Yes / No / With exercise
    - "Needs yard?" Yes / No / Preferred
    - Special needs toggle — if yes: text field "Describe"
    - "Urgent / needs home quickly" toggle
    - "Bonded with another animal?" toggle — if yes: link to another animal in system
  - **Section 4 — Description:**
    - Rich textarea (markdown supported) with character counter
    - "Write [Name]'s story — help adopters connect emotionally. Include personality, favourite things, and what kind of home they'd thrive in. (min 100 characters)"
    - Example prompt shown in placeholder
  - **Section 5 — Status & Visibility:**
    - Status: Draft / Available / Pending / On Hold / Adopted — radio group
    - "Mark as urgent" toggle (shows flame badge on card)
    - Published date (auto-filled, editable)
- **Live preview card (right, sticky):**
  - Shows the animal card as it will appear to adopters, updating in real-time as form is filled
  - "Desktop preview" / "Mobile preview" toggle
  - Small, medium, full-size preview toggle
- **Bottom action bar:** "Save draft" (ghost) · "Preview listing" (outline) · "Publish listing →" (clay full)

---

### TASK 3.3 🤖 — Application Review Screen (Shelter)
**File:** `shelter-application-review.html`
**Priority:** HIGH

**Claude build instructions:**
- 3-column layout: application list left (280px) · application detail centre · applicant history right (240px)
- **Application list (left):**
  - "7 Applications" header with filter: All / New / Reviewing / Decided
  - Each item: Applicant name · Animal name · "3 days ago" · Status pill
  - Selected item: clay left border + blush bg
- **Application detail (centre):**
  - Header: "[Applicant Name] → [Animal Name]" with status pill and action buttons: "Approve ✓" (sage) "Reject ✗" (outline clay) "Request more info →" (outline)
  - Submitted date, time
  - **Answer sections displayed as readable cards (not form UI):**
    - "About them": name, location, phone, housing info
    - "Their home": housing type, yard, alone time, where pet sleeps
    - "Their experience": experience level, other pets, previous pets
    - "Why [Animal Name]?": their written answer (displayed in a quote block, Fraunces italic)
    - "What they're hoping for": their written answer
  - **Compatibility assessment (auto-generated based on profile vs animal needs):**
    - "🟢 Housing match: Apartment-friendly animal, applicant has apartment"
    - "🟢 Experience: Experienced owner for a social animal"
    - "🔴 Other pets: Applicant has cats — this dog is not good with cats"
    - "🟡 Activity: High-energy dog, applicant is moderately active"
  - **Shelter notes (internal):**
    - Text area: "Add internal notes — only visible to your team"
    - Previous notes shown as a log with timestamps
  - **Decision area:**
    - If approving: "Next step" dropdown: "Invite to meet & greet / Request home visit / Proceed to adoption agreement"
    - Message to applicant (pre-filled template, editable): "Hi [Name], we've reviewed your application for [Animal] and we'd love to invite you to a meet and greet..."
    - Send + decide button
- **Applicant history (right panel):**
  - Other animals this person has applied for (if any)
  - Account created date
  - Profile completeness
  - "View full profile" link (admin)

---

## PHASE 4 — TRANSACTIONAL EMAILS

---

### TASK 4.1 🤖 — Email Templates (HTML)
**File:** `email-templates.html`
**Priority:** MEDIUM

**Claude build instructions:**
- Single file showing all 5 email templates rendered side by side, with a picker at top
- All emails: max-width 600px, inline CSS only (email client compatible), cream background, minimal — NOT full web app aesthetic (simpler for email rendering)
- Use PawSwipe wordmark as text (no images) at top of each

**Template 1 — Match notification (to shelter):**
- Subject line shown: "🐾 New match: [Applicant name] is interested in [Animal name]"
- Body: "[Name] just liked [Animal]'s profile on PawSwipe Vancouver. Here's a quick summary of their household: [3 bullet points from profile]. View their full interest and start a conversation →" [CTA button clay]

**Template 2 — Match confirmation (to adopter):**
- Subject: "You matched with [Animal name]! 🎉"
- Body: Warm, celebratory. "Great news — [Shelter] has received your interest in [Animal]. They'll be in touch soon. In the meantime, you can message them directly." [Message button] + "View [Animal]'s full profile →"

**Template 3 — Application received (to adopter):**
- Subject: "Application submitted for [Animal name] ✓"
- Confirmation of submission, shelter name, expected response time (3–5 business days), what happens next (3 steps listed), "Questions? Reply to this email or message us in the app →"

**Template 4 — Application decision — Approved:**
- Subject: "🎉 Great news about [Animal name]!"
- Warm congratulations, shelter's personalised message quoted, next steps (meet & greet details), "Reply to confirm your appointment →"

**Template 5 — Application decision — Not approved:**
- Subject: "Update on your application for [Animal name]"
- Compassionate, no shame. "Thank you for your interest in [Animal]. After careful consideration, [Shelter] has decided to proceed with another applicant at this time. This doesn't reflect on you as a future pet owner — it simply means another match may be waiting. Keep swiping — we'll help you find the right one. →"

---

## PHASE 5 — WHAT CLAUDE CANNOT BUILD (Human tasks)

---

### TASK 5.1 👤 — Petfinder API Integration (code setup)
**What:** Write the actual Next.js API route that calls Petfinder and syncs animals to Supabase
**Why human:** Requires live API credentials, environment variables, and a running Next.js project
**Instructions:**
- Create `/app/api/sync-animals/route.ts`
- Fetch token: POST to `https://api.petfinder.com/v2/oauth2/token` with client_id, client_secret, grant_type=client_credentials
- Fetch animals: GET `https://api.petfinder.com/v2/animals?location=Vancouver,BC&distance=75&country=CA&limit=100&status=adoptable`
- Upsert to Supabase `animals` table using `external_id` as conflict key
- Schedule via Vercel Cron: `vercel.json` → `{ "crons": [{ "path": "/api/sync-animals", "schedule": "0 */6 * * *" }] }`

---

### TASK 5.2 👤 — Supabase Auth Configuration
**What:** Enable Google OAuth + Email auth in Supabase dashboard
**Why human:** Requires Google Cloud Console credentials
**Instructions:**
- Supabase dashboard → Authentication → Providers
- Enable Email (magic link + password)
- Enable Google: create OAuth credentials at console.cloud.google.com, paste client ID + secret into Supabase
- Set redirect URL: `https://pawswipe.ca/auth/callback`
- Create `/app/auth/callback/route.ts` in Next.js to handle OAuth redirect

---

### TASK 5.3 👤 — Domain & DNS
**What:** Register pawswipe.ca, connect to Vercel
**Why human:** Requires payment + registrar access
**Instructions:**
- Register at namecheap.com or hover.com (Canadian registrar)
- In Vercel: Settings → Domains → Add domain → pawswipe.ca
- In registrar DNS: Add CNAME record → points to cname.vercel-dns.com
- Also add: www CNAME → cname.vercel-dns.com
- SSL auto-provisioned by Vercel

---

### TASK 5.4 👤 — Shelter Partnership Outreach
**What:** Email/call real shelters to propose data partnership
**Why human:** Relationship-based
**Draft pitch (Claude wrote this, human sends):**
> "Hi [Name], I'm building PawSwipe Vancouver — a swipe-based adoption discovery platform focused on the Lower Mainland. We currently feature [Shelter] on our platform and link directly to your Petfinder listings. We'd love to offer you a free shelter dashboard so your team can manage listings, review applications, and message adopters — all in one place. This is free for shelters, always. Can we schedule a 20-minute call? — [Your name]"
- Priority order: VOKRA (most tech-forward) → LAPS → RAPS → BC SPCA (requires institutional approval, longer lead time)

---

### TASK 5.5 👤 — Legal Documents
**What:** Privacy Policy, Terms of Service
**Why human:** Must be signed legal documents, jurisdiction-specific
**Instructions:**
- Use termsfeed.com or iubenda.com to generate Canadian-law PIPEDA-compliant Privacy Policy
- Must disclose: personal data collected (name, email, housing info, pet preferences), Petfinder integration, Supabase storage, no sale of data, deletion request process
- Terms of Service must include: no guarantee of adoption, shelter responsibility disclaimer, acceptable use, account termination

---

### TASK 5.6 👤 — Resend Email Setup
**What:** Transactional email delivery service
**Instructions:**
- Create account at resend.com
- Add and verify domain: mail.pawswipe.ca
- Get API key → add to `.env.local` as `RESEND_API_KEY`
- Install: `npm install resend`
- Wire to application/match events in Supabase Edge Functions

---

### TASK 5.7 👤 — PostHog Analytics
**What:** User behaviour tracking (swipes, matches, application starts/completions)
**Instructions:**
- Create account at posthog.com (free up to 1M events/month)
- Add to Next.js: `npm install posthog-js`
- Key events to track: `animal_swiped_right`, `animal_swiped_left`, `match_created`, `application_started`, `application_completed`, `message_sent`, `shelter_profile_viewed`
- Create funnel: Swipe → Match → Application → Approval

---

## BUILD SEQUENCE — RECOMMENDED ORDER FOR CLAUDE

When ready to build, do these in order. Each references the task above.

```
Sprint 1 (Build now):
  1. TASK 1.1 — Design System & Component Library
  2. TASK 1.2 — Logo & Brand Assets
  3. TASK 2.1 — Swipe Discovery Screen ← highest impact
  4. TASK 2.2 — Onboarding Flow

Sprint 2:
  5. TASK 2.3 — Animal Detail Page
  6. TASK 2.4 — Shelter Directory
  7. TASK 2.7 — Matches Screen
  8. TASK 2.8 — Messaging Screen

Sprint 3:
  9. TASK 2.9  — Application Form
  10. TASK 3.1 — Shelter Dashboard
  11. TASK 3.2 — Add Animal Form
  12. TASK 3.3 — Application Review

Sprint 4:
  13. TASK 2.5 — Individual Shelter Page
  14. TASK 2.6 — User Profile Page
  15. TASK 4.1 — Email Templates
  16. TASK 2.10 — 404 & Error Pages
```

---

## FILES TO BE PRODUCED (complete list)

| # | File | Task | Builder | Status |
|---|---|---|---|---|
| 1 | pawswipe-landing.html | — | 🤖 | ✅ Done |
| 2 | pawswipe-vancouver.html | — | 🤖 | ✅ Done |
| 3 | pawswipe-build-guide.md | — | 🤖 | ✅ Done |
| 4 | pawswipe-tasks.md | — | 🤖 | ✅ This file |
| 5 | design-system.html | 1.1 | 🤖 | ⬜ Todo |
| 6 | pawswipe-logo.svg | 1.2 | 🤖 | ⬜ Todo |
| 7 | pawswipe-og-image.html | 1.2 | 🤖 | ⬜ Todo |
| 8 | app-swipe-screen.html | 2.1 | 🤖 | ⬜ Todo |
| 9 | app-onboarding.html | 2.2 | 🤖 | ⬜ Todo |
| 10 | animal-detail.html | 2.3 | 🤖 | ⬜ Todo |
| 11 | shelters-directory.html | 2.4 | 🤖 | ⬜ Todo |
| 12 | shelter-profile-bcspca.html | 2.5 | 🤖 | ⬜ Todo |
| 13 | app-profile.html | 2.6 | 🤖 | ⬜ Todo |
| 14 | app-matches.html | 2.7 | 🤖 | ⬜ Todo |
| 15 | app-messages.html | 2.8 | 🤖 | ⬜ Todo |
| 16 | app-application.html | 2.9 | 🤖 | ⬜ Todo |
| 17 | 404.html | 2.10 | 🤖 | ⬜ Todo |
| 18 | shelter-dashboard.html | 3.1 | 🤖 | ⬜ Todo |
| 19 | shelter-add-animal.html | 3.2 | 🤖 | ⬜ Todo |
| 20 | shelter-application-review.html | 3.3 | 🤖 | ⬜ Todo |
| 21 | email-templates.html | 4.1 | 🤖 | ⬜ Todo |
| 22 | Next.js project + Supabase schema | 5.1–5.2 | 👤 | ⬜ Todo |
| 23 | Domain + DNS | 5.3 | 👤 | ⬜ Todo |
| 24 | Shelter outreach | 5.4 | 👤 | ⬜ Todo |
| 25 | Legal docs | 5.5 | 👤 | ⬜ Todo |
| 26 | Resend + PostHog setup | 5.6–5.7 | 👤 | ⬜ Todo |

---

*Say "build sprint 1" or name a specific task and I'll start immediately.*
