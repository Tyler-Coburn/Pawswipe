/**
 * Profile + per-user stats for signed-in PawSwipe users.
 *
 * Reads from `public.profiles` (RLS: own row only) and the
 * `my_profile_stats` SECURITY DEFINER RPC for counts.
 */
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  display_name: string | null;
  preferred_city: string | null;
  preferred_species: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export async function getMyProfile(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, preferred_city, preferred_species, bio, created_at, updated_at")
    .eq("id", uid)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile) ?? null;
}

export async function updateMyProfile(patch: Partial<Pick<Profile, "display_name" | "preferred_city" | "preferred_species" | "bio">>): Promise<Profile> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) throw new Error("Not signed in");
  // Upsert in case the trigger row was deleted/never created.
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: uid, ...patch }, { onConflict: "id" })
    .select("id, display_name, preferred_city, preferred_species, bio, created_at, updated_at")
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function getMyStats(): Promise<{ savedCount: number; applicationCount: number }> {
  const { data, error } = await supabase.rpc("my_profile_stats");
  if (error) throw error;
  const row = (data ?? [])[0] as { saved_count: number | string; application_count: number | string } | undefined;
  return {
    savedCount: row ? Number(row.saved_count) : 0,
    applicationCount: row ? Number(row.application_count) : 0,
  };
}
