import type { Pet, Shelter } from "@/lib/types";
import { normalizePet } from "./normalizePet";
import { normalizeShelter } from "./normalizeShelter";

/**
 * Petfinder API provider (native).
 *
 * PETFINDER_CLIENT_ID / PETFINDER_CLIENT_SECRET are server-only secrets.
 * Use a Lovable Cloud edge function as the proxy at /api/proxy/petfinder.
 *
 * For an embedded live listings page that does NOT require server work,
 * see VITE_PETFINDER_WIDGET_URL and the /live-listings page.
 */
const ENDPOINT = "/api/proxy/petfinder";

function hasCreds() {
  return false; // see rescueGroupsProvider — secrets live server-side
}

export const petfinderProvider = {
  id: "petfinder" as const,
  label: "Petfinder API",
  async listPets(): Promise<Pet[]> {
    if (!hasCreds()) return [];
    const r = await fetch(`${ENDPOINT}/pets`);
    if (!r.ok) throw new Error(`Petfinder error ${r.status}`);
    const data = await r.json();
    return (data.animals ?? []).map((raw: any) => normalizePet(raw, "petfinder"));
  },
  async getPet(id: string): Promise<Pet | undefined> {
    if (!hasCreds()) return undefined;
    const r = await fetch(`${ENDPOINT}/pets/${encodeURIComponent(id)}`);
    if (!r.ok) return undefined;
    return normalizePet(await r.json(), "petfinder");
  },
  async listShelters(): Promise<Shelter[]> {
    if (!hasCreds()) return [];
    const r = await fetch(`${ENDPOINT}/organizations`);
    if (!r.ok) throw new Error(`Petfinder error ${r.status}`);
    const data = await r.json();
    return (data.organizations ?? []).map((raw: any) => normalizeShelter(raw, "petfinder"));
  },
  async getShelter(id: string): Promise<Shelter | undefined> {
    if (!hasCreds()) return undefined;
    const r = await fetch(`${ENDPOINT}/organizations/${encodeURIComponent(id)}`);
    if (!r.ok) return undefined;
    return normalizeShelter(await r.json(), "petfinder");
  },
  status() {
    return hasCreds()
      ? { ok: true, message: "Petfinder credentials detected." }
      : { ok: false, message: "PETFINDER_CLIENT_ID/SECRET not configured (server-only)." };
  },
};
