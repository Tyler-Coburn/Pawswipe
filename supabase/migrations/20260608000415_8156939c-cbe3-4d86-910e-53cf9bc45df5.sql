
REVOKE EXECUTE ON FUNCTION public.list_recent_applications_redacted(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.adoption_applications_health() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.my_profile_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_recent_applications_redacted(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.adoption_applications_health() TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_profile_stats() TO authenticated;
