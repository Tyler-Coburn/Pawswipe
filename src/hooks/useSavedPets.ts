import { useCallback, useEffect, useRef, useState } from "react";
import { listSavedPetIds, savePet, unsavePet } from "@/lib/api/savedPets";
import { supabase } from "@/integrations/supabase/client";
import type { Pet } from "@/lib/types";

const KEY = "pawswipe:saved";

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* quota */
  }
}

/**
 * Saved-pets shortlist. Backed by `public.saved_pets` in Lovable Cloud,
 * keyed off auth.uid() when signed in, or an anonymous session id otherwise.
 * Falls back to localStorage when the database is unreachable.
 *
 * Reloads automatically when the auth state changes (sign-in / sign-out)
 * so Matches and the heart buttons reflect the right account immediately.
 */
export function useSavedPets() {
  const [ids, setIds] = useState<string[]>(() => readLocal());
  const lastPet = useRef<Map<string, Pet>>(new Map());

  const refresh = useCallback(async () => {
    const res = await listSavedPetIds();
    setIds(res.ids);
  }, []);

  useEffect(() => {
    void refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const cachePet = useCallback((pet: Pet) => {
    lastPet.current.set(pet.id, pet);
  }, []);

  const add = useCallback((idOrPet: string | Pet) => {
    const id = typeof idOrPet === "string" ? idOrPet : idOrPet.id;
    const pet = typeof idOrPet === "string" ? lastPet.current.get(idOrPet) : idOrPet;
    setIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeLocal(next);
      return next;
    });
    if (pet) void savePet(pet);
  }, []);

  const remove = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      writeLocal(next);
      return next;
    });
    void unsavePet(id);
  }, []);

  const toggle = useCallback((idOrPet: string | Pet) => {
    const id = typeof idOrPet === "string" ? idOrPet : idOrPet.id;
    if (ids.includes(id)) remove(id);
    else add(idOrPet);
  }, [ids, add, remove]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, add, remove, has, cachePet };
}
