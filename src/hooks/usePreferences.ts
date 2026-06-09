import { useCallback, useEffect, useState } from "react";
import type { AdopterPreferences } from "@/lib/types";

const KEY = "pawswipe:prefs";

export const defaultPrefs: AdopterPreferences = {
  city: undefined,
  species: [],
  sizes: [],
  ageGroups: [],
  energy: [],
  hasOtherPets: "",
  hasKids: false,
  housing: "",
  travelKm: 30,
  timeline: "",
};

export function usePreferences() {
  const [prefs, setPrefs] = useState<AdopterPreferences>(defaultPrefs);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...defaultPrefs, ...JSON.parse(raw) });
    } catch { /* noop */ }
  }, []);

  const save = useCallback((p: AdopterPreferences) => {
    setPrefs(p);
    localStorage.setItem(KEY, JSON.stringify(p));
  }, []);

  const update = useCallback((patch: Partial<AdopterPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { prefs, save, update };
}
