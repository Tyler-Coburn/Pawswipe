
-- =========================================================
-- PawSwipe public-readiness: profiles + tightened RLS
-- =========================================================

-- 1) profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  preferred_city TEXT,
  preferred_species TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles select own" ON public.profiles;
CREATE POLICY "profiles select own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles insert own" ON public.profiles;
CREATE POLICY "profiles insert own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles update own" ON public.profiles;
CREATE POLICY "profiles update own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE TRIGGER profiles_touch_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2) Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3) Tighten saved_pets RLS
--    Authenticated users: only their own rows (user_id = auth.uid()).
--    Anonymous demo users: only rows with user_id IS NULL.
--    (Session-level isolation among anon users requires auth — documented demo limitation.)

-- Backfill: existing rows have user_id NULL — leave for anon fallback compatibility.

DROP POLICY IF EXISTS "saved_pets read all (demo)" ON public.saved_pets;
DROP POLICY IF EXISTS "saved_pets insert any (demo)" ON public.saved_pets;
DROP POLICY IF EXISTS "saved_pets delete any (demo)" ON public.saved_pets;

CREATE POLICY "saved_pets select own or anon"
  ON public.saved_pets FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

CREATE POLICY "saved_pets insert own or anon"
  ON public.saved_pets FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

CREATE POLICY "saved_pets delete own or anon"
  ON public.saved_pets FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

GRANT SELECT, INSERT, DELETE ON public.saved_pets TO authenticated;
-- anon already has access via PostgREST default; ensure it explicitly
GRANT SELECT, INSERT, DELETE ON public.saved_pets TO anon;
GRANT ALL ON public.saved_pets TO service_role;

-- 4) Tighten adoption_applications: insert allowed for both anon & auth,
--    SELECT only for the submitter (when signed in). No raw public reads.

DROP POLICY IF EXISTS "applications insert any" ON public.adoption_applications;

CREATE POLICY "applications insert own or anon"
  ON public.adoption_applications FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

CREATE POLICY "applications select own"
  ON public.adoption_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

GRANT SELECT, INSERT ON public.adoption_applications TO authenticated;
GRANT INSERT ON public.adoption_applications TO anon;
GRANT ALL ON public.adoption_applications TO service_role;

-- 5) Helper: count current user's saved pets + applications (for Profile page)
CREATE OR REPLACE FUNCTION public.my_profile_stats()
RETURNS TABLE(saved_count BIGINT, application_count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.saved_pets WHERE user_id = auth.uid())::BIGINT,
    (SELECT count(*) FROM public.adoption_applications WHERE user_id = auth.uid())::BIGINT
$$;
