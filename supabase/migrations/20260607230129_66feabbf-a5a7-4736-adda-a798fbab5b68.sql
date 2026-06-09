-- updated_at trigger helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ user_profiles ============
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  session_id text UNIQUE NOT NULL,
  display_name text,
  preferred_city text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO anon, authenticated;
GRANT ALL ON public.user_profiles TO service_role;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_profiles read all (demo)" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "user_profiles insert any (demo)" ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "user_profiles update any (demo)" ON public.user_profiles FOR UPDATE USING (true);
CREATE TRIGGER touch_user_profiles BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ saved_pets ============
CREATE TABLE public.saved_pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid,
  pet_id text NOT NULL,
  source text,
  source_pet_id text,
  source_url text,
  pet_name text,
  shelter_id text,
  shelter_name text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, pet_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_pets TO anon, authenticated;
GRANT ALL ON public.saved_pets TO service_role;
ALTER TABLE public.saved_pets ENABLE ROW LEVEL SECURITY;
-- Session-scoped on the client; RLS is permissive in this demo phase. When
-- real auth is added, replace these with auth.uid() = user_id policies.
CREATE POLICY "saved_pets read all (demo)" ON public.saved_pets FOR SELECT USING (true);
CREATE POLICY "saved_pets insert any (demo)" ON public.saved_pets FOR INSERT WITH CHECK (true);
CREATE POLICY "saved_pets delete any (demo)" ON public.saved_pets FOR DELETE USING (true);
CREATE INDEX saved_pets_session_idx ON public.saved_pets(session_id);

-- ============ adoption_applications ============
CREATE TABLE public.adoption_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  user_id uuid,
  pet_id text NOT NULL,
  source text,
  source_pet_id text,
  source_url text,
  shelter_id text,
  shelter_name text,
  pet_name text,
  applicant_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  housing_type text,
  rent_or_own text,
  landlord_permission boolean DEFAULT false,
  current_pets text,
  children_in_home text,
  pet_experience text,
  reason text,
  preferred_contact text,
  availability text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  is_synced_listing boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- INSERT only for anon/authenticated. NO SELECT policy → applicant PII
-- (email, phone, address, reason) is never readable from the client.
GRANT INSERT ON public.adoption_applications TO anon, authenticated;
GRANT ALL ON public.adoption_applications TO service_role;
ALTER TABLE public.adoption_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applications insert any" ON public.adoption_applications FOR INSERT WITH CHECK (true);
CREATE INDEX adoption_applications_created_idx ON public.adoption_applications(created_at DESC);
CREATE TRIGGER touch_adoption_applications BEFORE UPDATE ON public.adoption_applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Redacted view function for the demo shelter dashboard.
-- Returns initials + non-PII metadata only. SECURITY DEFINER bypasses RLS
-- so anon can call it without granting SELECT on the underlying table.
CREATE OR REPLACE FUNCTION public.list_recent_applications_redacted(_limit int DEFAULT 10)
RETURNS TABLE (
  id uuid,
  applicant_initials text,
  city text,
  pet_name text,
  shelter_name text,
  status text,
  is_synced_listing boolean,
  created_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    a.id,
    CASE
      WHEN a.applicant_name IS NULL OR length(trim(a.applicant_name)) = 0 THEN '—'
      ELSE upper(left(trim(a.applicant_name), 1)) || '.'
        || CASE
             WHEN position(' ' in trim(a.applicant_name)) > 0
               THEN upper(substring(trim(a.applicant_name) from position(' ' in trim(a.applicant_name))+1 for 1)) || '.'
             ELSE ''
           END
    END AS applicant_initials,
    a.city,
    a.pet_name,
    a.shelter_name,
    a.status,
    a.is_synced_listing,
    a.created_at
  FROM public.adoption_applications a
  ORDER BY a.created_at DESC
  LIMIT greatest(1, least(_limit, 50))
$$;
GRANT EXECUTE ON FUNCTION public.list_recent_applications_redacted(int) TO anon, authenticated;

-- Public-safe count + last-submission timestamp for Data Health page
CREATE OR REPLACE FUNCTION public.adoption_applications_health()
RETURNS TABLE (total bigint, last_submitted_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::bigint, max(created_at) FROM public.adoption_applications
$$;
GRANT EXECUTE ON FUNCTION public.adoption_applications_health() TO anon, authenticated;

-- ============ application_notes ============
CREATE TABLE public.application_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.adoption_applications(id) ON DELETE CASCADE,
  author_user_id uuid,
  author_session_id text,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.application_notes TO anon, authenticated;
GRANT ALL ON public.application_notes TO service_role;
ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
-- Notes contain shelter-internal commentary; no anon SELECT. Insert open
-- for the demo phase so future shelter UI can post notes; lock down to
-- shelter_members when auth is wired up.
CREATE POLICY "application_notes insert any (demo)" ON public.application_notes FOR INSERT WITH CHECK (true);

-- ============ sync_logs ============
CREATE TABLE public.sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  result text NOT NULL,
  message text,
  pets_count int,
  shelters_count int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.sync_logs TO anon, authenticated;
GRANT ALL ON public.sync_logs TO service_role;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sync_logs read all" ON public.sync_logs FOR SELECT USING (true);
CREATE POLICY "sync_logs insert any (demo)" ON public.sync_logs FOR INSERT WITH CHECK (true);
CREATE INDEX sync_logs_created_idx ON public.sync_logs(created_at DESC);