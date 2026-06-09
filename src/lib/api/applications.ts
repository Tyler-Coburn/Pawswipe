/**
 * Persistent PawSwipe interest notes ("adoption applications").
 *
 * - INSERT only from the browser; raw rows are not readable client-side so
 *   applicant PII (email, phone, reason) stays private.
 * - The demo shelter dashboard reads through a SECURITY DEFINER RPC that
 *   returns redacted fields only (initials + city + status + pet name).
 */
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import type { Pet } from "@/lib/types";

export interface ApplicationFormInput {
  applicantName: string;
  email: string;
  phone: string;
  city: string;
  housingType: string;
  rentOrOwn: string;
  landlordPermission: boolean;
  currentPets: string;
  childrenInHome: string;
  petExperience: string;
  reason: string;
  preferredContact: string;
  availability: string;
  consent: boolean;
}

export interface ApplicationSubmitResult {
  ok: boolean;
  id?: string;
  persisted: boolean;
  error?: string;
}

export async function submitApplication(
  pet: Pet,
  form: ApplicationFormInput,
): Promise<ApplicationSubmitResult> {
  const sessionId = getSessionId();
  const { data: auth } = await supabase.auth.getSession();
  const uid = auth.session?.user?.id ?? null;
  const isSynced = pet.source !== "shelter-direct";
  try {
    const { data, error } = await supabase
      .from("adoption_applications")
      .insert({
        user_id: uid,
        session_id: sessionId,
        pet_id: pet.id,
        source: pet.source ?? "mock",
        source_pet_id: pet.sourcePetId ?? null,
        source_url: pet.sourceUrl ?? null,
        shelter_id: pet.shelterId,
        shelter_name: pet.shelterName,
        pet_name: pet.name,
        applicant_name: form.applicantName,
        email: form.email,
        phone: form.phone || null,
        city: form.city || null,
        housing_type: form.housingType || null,
        rent_or_own: form.rentOrOwn || null,
        landlord_permission: form.landlordPermission,
        current_pets: form.currentPets || null,
        children_in_home: form.childrenInHome || null,
        pet_experience: form.petExperience || null,
        reason: form.reason || null,
        preferred_contact: form.preferredContact || null,
        availability: form.availability || null,
        consent: form.consent,
        status: "new",
        is_synced_listing: isSynced,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { ok: true, id: data?.id, persisted: true };
  } catch (e: any) {
    return {
      ok: false,
      persisted: false,
      error: e?.message ?? "Could not save your interest note. Please try again.",
    };
  }
}


export interface RedactedApplication {
  id: string;
  applicant_initials: string;
  city: string | null;
  pet_name: string | null;
  shelter_name: string | null;
  status: string;
  is_synced_listing: boolean;
  created_at: string;
}

export async function listRecentApplicationsRedacted(
  limit = 10,
): Promise<RedactedApplication[]> {
  const { data, error } = await supabase.rpc("list_recent_applications_redacted", { _limit: limit });
  if (error) throw error;
  return (data ?? []) as RedactedApplication[];
}

export async function getApplicationsHealth(): Promise<{ total: number; lastSubmittedAt: string | null }> {
  const { data, error } = await supabase.rpc("adoption_applications_health");
  if (error) throw error;
  const row = (data ?? [])[0] as { total: number | string; last_submitted_at: string | null } | undefined;
  return {
    total: row ? Number(row.total) : 0,
    lastSubmittedAt: row?.last_submitted_at ?? null,
  };
}
