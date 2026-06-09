-- ============================================================
-- PAWSWIPE VANCOUVER — DATABASE SCHEMA
-- Postgres / Supabase. Run this in the Supabase SQL editor.
-- Order matters: extensions → tables → indexes → RLS → triggers.
-- ============================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
create type animal_species as enum ('dog', 'cat', 'rabbit', 'other');
create type animal_size    as enum ('small', 'medium', 'large', 'xlarge');
create type animal_status  as enum ('available', 'pending', 'adopted', 'hidden');
create type energy_level    as enum ('low', 'moderate', 'high');
create type swipe_direction as enum ('like', 'pass');
create type application_status as enum ('submitted', 'reviewing', 'approved', 'declined', 'withdrawn');
create type member_role     as enum ('adopter', 'shelter_staff', 'admin');

-- ============================================================
-- PROFILES  (1-1 with auth.users)
-- ============================================================
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          member_role not null default 'adopter',
  full_name     text,
  avatar_url    text,
  city          text default 'Vancouver',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Adopter household preferences captured during onboarding
create table adopter_prefs (
  profile_id        uuid primary key references profiles(id) on delete cascade,
  housing           text,            -- 'apartment' | 'house' | 'condo' ...
  has_yard          boolean default false,
  existing_pets     text,            -- free text e.g. '1 cat'
  experience_level  text,            -- 'first_time' | 'some' | 'experienced'
  activity_level    energy_level default 'moderate',
  species_wanted    animal_species[] default '{dog,cat}',
  size_wanted       animal_size[]   default '{small,medium,large}',
  kids_at_home      boolean default false,
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- SHELTERS
-- ============================================================
create table shelters (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text unique not null,
  address       text,
  phone         text,
  email         text,
  website       text,
  hours         text,
  description   text,
  logo_url      text,
  lat           double precision,
  lng           double precision,
  created_at    timestamptz not null default now()
);

-- Link table: which staff profiles manage which shelter
create table shelter_members (
  shelter_id  uuid references shelters(id) on delete cascade,
  profile_id  uuid references profiles(id) on delete cascade,
  primary key (shelter_id, profile_id)
);

-- ============================================================
-- ANIMALS
-- ============================================================
create table animals (
  id            uuid primary key default uuid_generate_v4(),
  shelter_id    uuid not null references shelters(id) on delete cascade,
  name          text not null,
  species       animal_species not null,
  breed         text,
  age_months    int,
  size          animal_size,
  sex           text,                 -- 'male' | 'female'
  energy        energy_level default 'moderate',
  good_with_kids boolean,
  good_with_dogs boolean,
  good_with_cats boolean,
  bio           text,
  photos        text[] default '{}',  -- ordered list of image URLs
  external_url  text,                 -- link to real adoption page
  status        animal_status not null default 'available',
  bonded_with   uuid references animals(id),  -- bonded-pair link (Linus & Chester)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- SWIPES  (the core interaction)
-- ============================================================
create table swipes (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  animal_id   uuid not null references animals(id) on delete cascade,
  direction   swipe_direction not null,
  created_at  timestamptz not null default now(),
  unique (profile_id, animal_id)   -- one swipe per animal per user
);

-- A "match" = a like. Surfaced to shelter staff for the animal's shelter.
create view matches as
  select s.id as swipe_id, s.profile_id, s.animal_id, a.shelter_id, s.created_at
  from swipes s join animals a on a.id = s.animal_id
  where s.direction = 'like';

-- ============================================================
-- APPLICATIONS
-- ============================================================
create table applications (
  id            uuid primary key default uuid_generate_v4(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  animal_id     uuid not null references animals(id) on delete cascade,
  status        application_status not null default 'submitted',
  answers       jsonb not null default '{}',  -- structured form responses
  shelter_note  text,                          -- staff-only note on decision
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (profile_id, animal_id)
);

-- ============================================================
-- MESSAGES  (adopter <-> shelter, threaded by application)
-- ============================================================
create table messages (
  id              uuid primary key default uuid_generate_v4(),
  application_id  uuid not null references applications(id) on delete cascade,
  sender_id       uuid not null references profiles(id) on delete cascade,
  body            text not null,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_animals_shelter   on animals(shelter_id);
create index idx_animals_status     on animals(status);
create index idx_animals_species    on animals(species);
create index idx_swipes_profile     on swipes(profile_id);
create index idx_swipes_animal      on swipes(animal_id);
create index idx_apps_profile       on applications(profile_id);
create index idx_apps_animal        on applications(animal_id);
create index idx_messages_app       on messages(application_id);

-- ============================================================
-- updated_at TRIGGER
-- ============================================================
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger t_profiles_touch   before update on profiles
  for each row execute function touch_updated_at();
create trigger t_animals_touch    before update on animals
  for each row execute function touch_updated_at();
create trigger t_apps_touch       before update on applications
  for each row execute function touch_updated_at();

-- Auto-create a profile row when a new auth user signs up
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger t_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles        enable row level security;
alter table adopter_prefs   enable row level security;
alter table shelters        enable row level security;
alter table shelter_members enable row level security;
alter table animals         enable row level security;
alter table swipes          enable row level security;
alter table applications    enable row level security;
alter table messages        enable row level security;

-- Helper: is the current user staff at a given shelter?
create or replace function is_shelter_staff(target_shelter uuid) returns boolean as $$
  select exists (
    select 1 from shelter_members
    where shelter_id = target_shelter and profile_id = auth.uid()
  );
$$ language sql security definer stable;

-- ---- PROFILES: a user sees/edits only their own ----
create policy "own profile read"   on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

-- ---- ADOPTER PREFS: own only ----
create policy "own prefs all" on adopter_prefs for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---- SHELTERS: public read, staff write ----
create policy "shelters public read" on shelters for select using (true);
create policy "shelters staff write" on shelters for update
  using (is_shelter_staff(id));

-- ---- ANIMALS: public sees available; staff manage their own ----
create policy "animals public read" on animals for select
  using (status = 'available' or is_shelter_staff(shelter_id));
create policy "animals staff insert" on animals for insert
  with check (is_shelter_staff(shelter_id));
create policy "animals staff update" on animals for update
  using (is_shelter_staff(shelter_id));
create policy "animals staff delete" on animals for delete
  using (is_shelter_staff(shelter_id));

-- ---- SWIPES: a user manages only their own ----
create policy "own swipes all" on swipes for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---- APPLICATIONS: adopter sees own; shelter staff see apps to their animals ----
create policy "apps adopter read" on applications for select
  using (auth.uid() = profile_id
         or is_shelter_staff((select shelter_id from animals where id = animal_id)));
create policy "apps adopter insert" on applications for insert
  with check (auth.uid() = profile_id);
create policy "apps adopter update" on applications for update
  using (auth.uid() = profile_id);
create policy "apps staff update" on applications for update
  using (is_shelter_staff((select shelter_id from animals where id = animal_id)));

-- ---- MESSAGES: visible to the two parties on the application ----
create policy "messages read" on messages for select
  using (
    exists (
      select 1 from applications ap
      where ap.id = application_id
        and (ap.profile_id = auth.uid()
             or is_shelter_staff((select shelter_id from animals where id = ap.animal_id)))
    )
  );
create policy "messages insert" on messages for insert
  with check (sender_id = auth.uid());

-- ============================================================
-- DONE. Next: run seed.sql to populate shelters + animals.
-- ============================================================
