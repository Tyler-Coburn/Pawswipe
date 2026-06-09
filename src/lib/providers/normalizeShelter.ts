import type { Shelter, DataSource, LowerMainlandCity, Species } from "@/lib/types";

export function normalizeShelter(raw: Record<string, any>, source: DataSource): Shelter {
  const now = new Date().toISOString();
  return {
    id: `${source}-${raw.id ?? cryptoId()}`,
    name: raw.name ?? "Partner shelter",
    location: raw.location ?? raw.address ?? "",
    city: (raw.city as LowerMainlandCity) ?? "Vancouver",
    verified: !!raw.verified,
    description: raw.description ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    website: raw.website ?? raw.url ?? "",
    hours: raw.hours ?? "",
    adoptionProcess: raw.adoptionProcess ?? [],
    animalTypes: (raw.animalTypes as Species[]) ?? [],
    responseTime: raw.responseTime ?? "",
    petsAvailable: Number(raw.petsAvailable ?? 0),
    accent: raw.accent ?? "from-primary/15 to-primary/5",
    createdAt: raw.createdAt ?? now,
    source,
    sourceShelterId: raw.sourceShelterId ?? String(raw.id ?? ""),
    sourceUrl: raw.sourceUrl ?? raw.website,
    lastSyncedAt: now,
  };
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10);
}
