import { mockProvider } from "./mockProvider";
import { rescueGroupsProvider } from "./rescueGroupsProvider";
import { petfinderProvider } from "./petfinderProvider";
import type { Pet, Shelter } from "@/lib/types";

export type ProviderId = "mock" | "rescuegroups" | "petfinder";

export interface AdoptionProvider {
  id: ProviderId;
  label: string;
  listPets: (filters?: any) => Promise<Pet[]>;
  getPet: (id: string) => Promise<Pet | undefined>;
  listShelters: () => Promise<Shelter[]>;
  getShelter: (id: string) => Promise<Shelter | undefined>;
  status: () => Promise<{ ok: boolean; message: string }> | { ok: boolean; message: string };
}

const REGISTRY: Record<ProviderId, AdoptionProvider> = {
  mock: mockProvider as AdoptionProvider,
  rescuegroups: rescueGroupsProvider as AdoptionProvider,
  petfinder: petfinderProvider as AdoptionProvider,
};

export function getDataMode(): ProviderId {
  const raw = (import.meta.env.VITE_DATA_MODE as string | undefined)?.toLowerCase();
  if (raw === "rescuegroups" || raw === "petfinder") return raw;
  return "rescuegroups"; // default — falls back to mock on failure inside callers
}

export function getAdoptionProvider(): AdoptionProvider {
  return REGISTRY[getDataMode()];
}

export function getMockProvider(): AdoptionProvider {
  return mockProvider as AdoptionProvider;
}

export function listProviders(): AdoptionProvider[] {
  return [mockProvider as AdoptionProvider, rescueGroupsProvider as AdoptionProvider, petfinderProvider as AdoptionProvider];
}
