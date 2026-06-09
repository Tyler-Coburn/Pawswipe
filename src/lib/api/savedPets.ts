/**
 * Persistent saved-pets ("Matches") backed by Lovable Cloud.
 *
 * Falls back to localStorage when the database call fails so the app
 * never appears broken to the user. Each row carries a snapshot of the
 * pet (name, shelter, image, source URL) so the Matches page can render
 * even if the underlying listing is no longer in the live feed.
 */
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import type { Pet } from "@/lib/types";

async function getUid(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

const LOCAL_KEY = "pawswipe:saved";

export interface SavedPetRow {
  pet_id: string;
  source: string | null;
  source_pet_id: string | null;
  source_url: string | null;
  pet_name: string | null;
  shelter_id: string | null;
  shelter_name: string | null;
  image_url: string | null;
  created_at: string;
}

function readLocal(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(ids: string[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
  } catch {
    /* quota */
  }
}

export async function listSavedPetIds(): Promise<{ ids: string[]; persisted: boolean }> {
  const uid = await getUid();
  const sessionId = getSessionId();
  try {
    const query = supabase.from("saved_pets").select("pet_id");
    const { data, error } = uid
      ? await query.eq("user_id", uid)
      : await query.is("user_id", null).eq("session_id", sessionId);
    if (error) throw error;
    const ids = (data ?? []).map((r) => r.pet_id);
    const local = readLocal();
    // For signed-in users only auth rows matter; for anon merge with local cache.
    const merged = uid ? Array.from(new Set(ids)) : Array.from(new Set([...ids, ...local]));
    writeLocal(merged);
    return { ids: merged, persisted: true };
  } catch {
    return { ids: readLocal(), persisted: false };
  }
}

export async function savePet(pet: Pet): Promise<{ ok: boolean; persisted: boolean }> {
  const uid = await getUid();
  const sessionId = getSessionId();
  const local = readLocal();
  if (!local.includes(pet.id)) writeLocal([...local, pet.id]);

  try {
    const { error } = await supabase.from("saved_pets").upsert(
      {
        user_id: uid,
        session_id: sessionId,
        pet_id: pet.id,
        source: pet.source ?? "mock",
        source_pet_id: pet.sourcePetId ?? null,
        source_url: pet.sourceUrl ?? null,
        pet_name: pet.name,
        shelter_id: pet.shelterId,
        shelter_name: pet.shelterName,
        image_url: pet.images?.[0] ?? null,
      },
      { onConflict: "session_id,pet_id", ignoreDuplicates: true },
    );
    if (error) throw error;
    return { ok: true, persisted: true };
  } catch {
    return { ok: true, persisted: false };
  }
}

export async function unsavePet(petId: string): Promise<{ ok: boolean; persisted: boolean }> {
  const uid = await getUid();
  const sessionId = getSessionId();
  writeLocal(readLocal().filter((x) => x !== petId));

  try {
    const base = supabase.from("saved_pets").delete().eq("pet_id", petId);
    const { error } = uid
      ? await base.eq("user_id", uid)
      : await base.is("user_id", null).eq("session_id", sessionId);
    if (error) throw error;
    return { ok: true, persisted: true };
  } catch {
    return { ok: true, persisted: false };
  }
}

export async function listSavedPetSnapshots(): Promise<SavedPetRow[]> {
  const uid = await getUid();
  const sessionId = getSessionId();
  const query = supabase
    .from("saved_pets")
    .select("pet_id, source, source_pet_id, source_url, pet_name, shelter_id, shelter_name, image_url, created_at")
    .order("created_at", { ascending: false });
  const { data, error } = uid
    ? await query.eq("user_id", uid)
    : await query.is("user_id", null).eq("session_id", sessionId);
  if (error) throw error;
  return (data ?? []) as SavedPetRow[];
}

