
-- Public-beta security cleanup
-- Drop legacy demo tables that are no longer used by the app.
-- user_profiles is replaced by public.profiles (auth-bound).
-- application_notes was demo scaffolding never wired into the client.
DROP TABLE IF EXISTS public.application_notes;
DROP TABLE IF EXISTS public.user_profiles;

-- Lock down sync_logs: no client writes/reads. Only edge functions
-- (service_role) may write. Keep RLS enabled with no permissive policies.
REVOKE ALL ON public.sync_logs FROM anon, authenticated;
GRANT ALL ON public.sync_logs TO service_role;
DROP POLICY IF EXISTS "sync_logs read all" ON public.sync_logs;
DROP POLICY IF EXISTS "sync_logs insert any (demo)" ON public.sync_logs;
-- RLS stays enabled; with no policies, anon/authenticated get nothing.
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
