/**
 * Internal "API route" stand-in.
 *
 * The frontend only ever calls these functions — never a provider directly.
 * Live listings only: if the active provider fails, we surface the error
 * instead of silently swapping in mock data. The Discover UI shows a clear
 * retry state.
 */
import { getAdoptionProvider } from "@/lib/providers/adoptionProvider";
import type { Pet } from "@/lib/types";

export async function GET_pets(): Promise<{ pets: Pet[]; source: string; syncedAt: string; error?: string }> {
  const provider = getAdoptionProvider();
  const raw = await provider.listPets();
  // Dedupe by id (live feeds occasionally return duplicate records)
  const seen = new Set<string>();
  const pets: Pet[] = [];
  for (const p of raw) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    pets.push(p);
  }
  return { pets, source: provider.id, syncedAt: new Date().toISOString() };
}

export async function GET_pet(id: string): Promise<Pet | undefined> {
  const provider = getAdoptionProvider();
  return provider.getPet(id);
}
