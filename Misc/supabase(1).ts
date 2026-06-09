// ============================================================
// lib/supabase.ts — Supabase client + typed query helpers
// Drop into your Next.js project at src/lib/supabase.ts
// Requires: npm install @supabase/supabase-js @supabase/ssr
// ============================================================
import { createBrowserClient } from '@supabase/ssr';

// ---- Minimal row types (extend as needed, or generate with `supabase gen types`) ----
export type Animal = {
  id: string;
  shelter_id: string;
  name: string;
  species: 'dog' | 'cat' | 'rabbit' | 'other';
  breed: string | null;
  age_months: number | null;
  size: 'small' | 'medium' | 'large' | 'xlarge' | null;
  sex: string | null;
  energy: 'low' | 'moderate' | 'high';
  bio: string | null;
  photos: string[];
  external_url: string | null;
  status: 'available' | 'pending' | 'adopted' | 'hidden';
  bonded_with: string | null;
};

export type Shelter = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  hours: string | null;
  description: string | null;
  lat: number | null;
  lng: number | null;
};

// ---- Browser client (client components) ----
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================
// QUERY HELPERS
// ============================================================

/** Animals the current user has NOT yet swiped on — the swipe deck. */
export async function getSwipeDeck(profileId: string, limit = 20): Promise<Animal[]> {
  const { data: swiped } = await supabase
    .from('swipes')
    .select('animal_id')
    .eq('profile_id', profileId);

  const swipedIds = (swiped ?? []).map((s) => s.animal_id);

  let q = supabase
    .from('animals')
    .select('*')
    .eq('status', 'available')
    .limit(limit);

  if (swipedIds.length) {
    q = q.not('id', 'in', `(${swipedIds.join(',')})`);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Animal[];
}

/** Record a swipe. A 'like' is surfaced to the shelter via the matches view. */
export async function recordSwipe(
  profileId: string,
  animalId: string,
  direction: 'like' | 'pass'
) {
  const { error } = await supabase
    .from('swipes')
    .upsert(
      { profile_id: profileId, animal_id: animalId, direction },
      { onConflict: 'profile_id,animal_id' }
    );
  if (error) throw error;
}

/** A user's liked animals (their "matches" list). */
export async function getMatches(profileId: string): Promise<Animal[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select('animal:animals(*)')
    .eq('profile_id', profileId)
    .eq('direction', 'like');
  if (error) throw error;
  // @ts-expect-error nested select shape
  return (data ?? []).map((r) => r.animal) as Animal[];
}

/** Public shelter directory. */
export async function getShelters(): Promise<Shelter[]> {
  const { data, error } = await supabase.from('shelters').select('*').order('name');
  if (error) throw error;
  return (data ?? []) as Shelter[];
}

/** Submit an adoption application. */
export async function submitApplication(
  profileId: string,
  animalId: string,
  answers: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from('applications')
    .upsert(
      { profile_id: profileId, animal_id: animalId, answers, status: 'submitted' },
      { onConflict: 'profile_id,animal_id' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
