import type { Pet, Shelter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { normalizePet, looksLikeNonPetRecord } from "./normalizePet";
import { normalizeShelter } from "./normalizeShelter";

/**
 * RescueGroups.org provider — talks to the `rescuegroups` edge function.
 *
 * SECURITY: The original PawSwipe HTML prototype embedded the RescueGroups
 * API key in the frontend. This app routes every call through a Lovable
 * Cloud edge function that reads RESCUEGROUPS_API_KEY from server env. The
 * key is never sent to the browser and never logged.
 */

export interface RGFilters {
  species?: string[];
  ageGroups?: string[];
  sizes?: string[];
  goodWithKids?: boolean;
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
  limit?: number;
}

async function callEdge(action: "list" | "get" | "status", body?: any, id?: string) {
  const params = new URLSearchParams();
  params.set("action", action);
  if (id) params.set("id", id);

  const { data, error } = await supabase.functions.invoke(`rescuegroups?${params.toString()}`, {
    method: action === "list" ? "POST" : "GET",
    body: action === "list" ? body : undefined,
  });
  if (error) throw new Error(error.message);
  if (!data?.ok) throw new Error(data?.error ?? "RescueGroups request failed");
  return data;
}

export const rescueGroupsProvider = {
  id: "rescuegroups" as const,
  label: "RescueGroups.org",
  async listPets(filters: RGFilters = {}): Promise<Pet[]> {
    const data = await callEdge("list", filters);
    return (data.animals ?? [])
      .filter((raw: any) => !looksLikeNonPetRecord(raw))
      .map((raw: any) => normalizePet(raw, "rescuegroups"));
  },
  async getPet(id: string): Promise<Pet | undefined> {
    const sourcePetId = id.startsWith("rescuegroups-") ? id.replace("rescuegroups-", "") : id;
    const data = await callEdge("get", undefined, sourcePetId);
    return data.animal ? normalizePet(data.animal, "rescuegroups") : undefined;
  },
  async listShelters(): Promise<Shelter[]> {
    // Derive shelters from the pet listing payload (RescueGroups returns
    // org fields embedded in each animal record). Avoids a second API call.
    try {
      const pets = await this.listPets({ limit: 60 });
      const seen = new Map<string, Shelter>();
      for (const p of pets) {
        if (seen.has(p.shelterId)) continue;
        const orgId = p.shelterId.replace("rescuegroups-org-", "");
        const s = normalizeShelter({
          id: `org-${orgId}`, // becomes `rescuegroups-org-${orgId}` to match pet.shelterId
          name: p.shelterName,
          city: p.locationCity,
          website: p.sourceUrl,
          description: `Partner rescue listing ${p.shelterName} on RescueGroups. Confirm details and adoption process directly with the shelter.`,
          adoptionProcess: [
            "Browse the shelter's official listing",
            "Submit the shelter's application or contact form",
            "Coordinate a meet-and-greet",
            "Finalize adoption with the shelter",
          ],
          responseTime: "Varies by shelter",
        }, "rescuegroups");
        s.petsAvailable = 0; // recomputed below
        seen.set(p.shelterId, s);
      }
      // recompute petsAvailable counts
      for (const p of pets) {
        const s = seen.get(p.shelterId);
        if (s) s.petsAvailable += 1;
      }
      return Array.from(seen.values());
    } catch {
      return [];
    }
  },
  async getShelter(id: string): Promise<Shelter | undefined> {
    const shelters = await this.listShelters();
    return shelters.find((s) => s.id === id);
  },
  async status(): Promise<{ ok: boolean; message: string }> {
    try {
      await callEdge("status");
      return { ok: true, message: "RescueGroups edge function is reachable and key is configured." };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "Not configured" };
    }
  },
};
