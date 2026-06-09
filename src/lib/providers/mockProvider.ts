import type { Pet, Shelter } from "@/lib/types";
import { PETS, SHELTERS } from "@/lib/mockData";

const SYNC_TS = new Date().toISOString();

function tagPet(p: Pet): Pet {
  return {
    ...p,
    source: "mock",
    sourcePetId: p.id,
    sourceUrl: undefined,
    lastSyncedAt: SYNC_TS,
    lastUpdatedAt: p.lastUpdated,
    isAvailable: p.status === "available",
  };
}

function tagShelter(s: Shelter): Shelter {
  return {
    ...s,
    source: "mock",
    sourceShelterId: s.id,
    sourceUrl: s.website ? `https://${s.website}` : undefined,
    lastSyncedAt: SYNC_TS,
  };
}

export const mockProvider = {
  id: "mock" as const,
  label: "Mock / demo listings",
  async listPets(): Promise<Pet[]> {
    return PETS.map(tagPet);
  },
  async getPet(id: string): Promise<Pet | undefined> {
    const p = PETS.find((x) => x.id === id);
    return p ? tagPet(p) : undefined;
  },
  async listShelters(): Promise<Shelter[]> {
    return SHELTERS.map(tagShelter);
  },
  async getShelter(id: string): Promise<Shelter | undefined> {
    const s = SHELTERS.find((x) => x.id === id);
    return s ? tagShelter(s) : undefined;
  },
  status() {
    return { ok: true, message: "Mock provider always available." };
  },
};
