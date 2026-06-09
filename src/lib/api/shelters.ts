import { getAdoptionProvider } from "@/lib/providers/adoptionProvider";
import type { Shelter } from "@/lib/types";

export async function GET_shelters(): Promise<{ shelters: Shelter[]; source: string; syncedAt: string }> {
  const provider = getAdoptionProvider();
  const shelters = await provider.listShelters();
  return { shelters, source: provider.id, syncedAt: new Date().toISOString() };
}

export async function GET_shelter(id: string): Promise<Shelter | undefined> {
  const provider = getAdoptionProvider();
  return provider.getShelter(id);
}
