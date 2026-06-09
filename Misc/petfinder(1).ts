// ============================================================
// lib/petfinder.ts — Petfinder API v2 integration
// Optional: pull live listings to supplement seed data.
// Register at https://www.petfinder.com/developers/ for keys.
// Set PETFINDER_KEY and PETFINDER_SECRET in .env.local
// ============================================================

const BASE = 'https://api.petfinder.com/v2';

let cachedToken: { value: string; expires: number } | null = null;

/** OAuth client-credentials token, cached until ~1 min before expiry. */
async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.value;

  const res = await fetch(`${BASE}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.PETFINDER_KEY!,
      client_secret: process.env.PETFINDER_SECRET!,
    }),
  });
  if (!res.ok) throw new Error(`Petfinder auth failed: ${res.status}`);
  const json = await res.json();
  cachedToken = {
    value: json.access_token,
    expires: Date.now() + (json.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export type PetfinderAnimal = {
  id: number;
  name: string;
  species: string;
  breeds: { primary: string | null };
  age: string;
  size: string;
  gender: string;
  description: string | null;
  photos: { full: string }[];
  url: string;
  contact: { address: { city: string | null; state: string | null } };
};

/** Search adoptable animals near Vancouver. */
export async function searchAnimals(opts: {
  type?: 'dog' | 'cat' | 'rabbit';
  location?: string; // e.g. 'Vancouver, BC' — Petfinder accepts CA postal/city
  limit?: number;
} = {}): Promise<PetfinderAnimal[]> {
  const token = await getToken();
  const params = new URLSearchParams({
    location: opts.location ?? 'Vancouver, BC',
    distance: '100',
    status: 'adoptable',
    limit: String(opts.limit ?? 20),
  });
  if (opts.type) params.set('type', opts.type);

  const res = await fetch(`${BASE}/animals?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 }, // cache 1h in Next.js
  });
  if (!res.ok) throw new Error(`Petfinder search failed: ${res.status}`);
  const json = await res.json();
  return json.animals as PetfinderAnimal[];
}

/** Map a Petfinder record onto your animals table shape for upserting. */
export function toAnimalRow(p: PetfinderAnimal, shelterId: string) {
  return {
    shelter_id: shelterId,
    name: p.name,
    species: (p.species?.toLowerCase() as 'dog' | 'cat') ?? 'other',
    breed: p.breeds?.primary ?? null,
    size: (p.size?.toLowerCase() as 'small' | 'medium' | 'large') ?? null,
    sex: p.gender?.toLowerCase() ?? null,
    bio: p.description ?? null,
    photos: (p.photos ?? []).map((ph) => ph.full),
    external_url: p.url,
    status: 'available' as const,
  };
}
