import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Heart, PawPrint, RotateCcw, ShieldCheck, Sliders, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { SwipeCard } from "@/components/pet/SwipeCard";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { useSavedPets } from "@/hooks/useSavedPets";
import { usePreferences } from "@/hooks/usePreferences";
import { GET_pets } from "@/lib/api/pets";
import type { Pet, Species, EnergyLevel, Size, LowerMainlandCity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LOWER_MAINLAND_CITIES: LowerMainlandCity[] = [
  "Vancouver", "North Vancouver", "Burnaby", "Richmond", "Surrey",
  "Coquitlam", "New Westminster", "Langley", "Delta", "Mission",
];

interface Filters {
  species: Species[];
  sizes: Size[];
  energy: EnergyLevel[];
  cities: LowerMainlandCity[];
  lowerMainlandOnly: boolean;
  maxDistance: number;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  goodWithKids: boolean;
}

const Discover = () => {
  const { prefs } = usePreferences();
  const [filters, setFilters] = useState<Filters>({
    species: prefs.species,
    sizes: prefs.sizes,
    energy: prefs.energy,
    cities: [],
    lowerMainlandOnly: true,
    maxDistance: prefs.travelKm || 50,
    goodWithDogs: false,
    goodWithCats: false,
    goodWithKids: false,
  });

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncedAt, setSyncedAt] = useState<string>("");
  const [sourceId, setSourceId] = useState<string>("rescuegroups");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await GET_pets();
      setPets(res.pets);
      setSyncedAt(res.syncedAt);
      setSourceId(res.source);
    } catch (e: any) {
      setError(e?.message ?? "Could not load live listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    return pets.filter((p) => {
      if (filters.species.length && !filters.species.includes(p.species)) return false;
      if (filters.sizes.length && !filters.sizes.includes(p.size)) return false;
      if (filters.energy.length && !filters.energy.includes(p.energyLevel)) return false;
      if (filters.cities.length && !filters.cities.includes(p.locationCity)) return false;
      if (filters.lowerMainlandOnly && !LOWER_MAINLAND_CITIES.includes(p.locationCity)) return false;
      if (p.distanceKm > filters.maxDistance) return false;
      if (filters.goodWithDogs && !p.goodWithDogs) return false;
      if (filters.goodWithCats && !p.goodWithCats) return false;
      if (filters.goodWithKids && !p.goodWithKids) return false;
      return true;
    });
  }, [filters, pets]);

  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState<"" | "swipe-left" | "swipe-right">("");
  const { add, has } = useSavedPets();

  const visible = filtered.slice(index, index + 3);
  const current: Pet | undefined = visible[0];

  const advance = (dir: "swipe-left" | "swipe-right", action: () => void) => {
    if (!current) return;
    setExiting(dir);
    setTimeout(() => {
      action();
      setExiting("");
      setIndex((i) => i + 1);
    }, 380);
  };

  const handlePass = () => advance("swipe-left", () => {
    toast(`Passed on ${current?.name}`);
  });
  const handleSave = () => advance("swipe-right", () => {
    if (current) {
      add(current);
      toast.success(`Saved ${current.name}`, { description: "Visit your matches to start an interest note." });
    }
  });

  const reset = () => setIndex(0);
  const noMore = !current;

  return (
    <AppShell hideFooter>
      <div className="container max-w-2xl py-6 md:py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Discover</h1>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Finding pets near you…"
                : error
                  ? "Live listings unavailable"
                  : `${Math.max(0, filtered.length - index)} ${filtered.length - index === 1 ? "pet" : "pets"} · within ${filters.maxDistance}km`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={reset} aria-label="Reset deck">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <FiltersSheet filters={filters} setFilters={setFilters} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <SourceBadge source={sourceId as any} />
          {syncedAt && <span>· Last synced {timeAgo(syncedAt)}</span>}
        </div>


        {/* deck */}
        <div className="relative mx-auto mt-6 w-full" style={{ height: "min(72vh, 640px)" }}>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : noMore ? (
            <EmptyDeck onReset={reset} reason={filtered.length === 0 ? "no-matches" : "seen-all"} />

          ) : (
            visible.map((p, i) => (
              <SwipeCard
                key={p.id}
                pet={p}
                stackOffset={i}
                isTop={i === 0}
                swipeClass={i === 0 ? exiting : ""}
                onPass={handlePass}
                onSave={handleSave}
              />
            ))
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-grad-card p-4 shadow-soft">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="text-sm">
            <p className="font-medium text-foreground">A thoughtful adoption reminder</p>
            <p className="mt-0.5 text-muted-foreground">
              PawSwipe helps you discover adoptable pets. Shelters confirm availability, fit, and next steps — they make the final call based on what's best for the animal.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

function EmptyDeck({ onReset, reason }: { onReset: () => void; reason: "no-matches" | "seen-all" }) {
  const isNoMatches = reason === "no-matches";
  return (
    <div className="absolute inset-0 rounded-3xl border border-dashed border-border bg-grad-card grid place-items-center p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary">
          <PawPrint className="h-7 w-7" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold">
          {isNoMatches ? "No pets match these filters" : "You've seen them all"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isNoMatches
            ? "Try widening your distance, choosing more species, or turning off Lower Mainland only."
            : "Reshuffle the deck or check back soon — shelters add new animals every week."}
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" onClick={onReset} className="rounded-full">
            <RotateCcw className="mr-1 h-4 w-4" /> Reshuffle
          </Button>
          <Button asChild className="rounded-full bg-grad-primary">
            <Link to="/matches"><Heart className="mr-1 h-4 w-4" /> My matches</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="absolute inset-0 rounded-3xl border border-border bg-grad-card grid place-items-center p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary animate-pulse">
          <PawPrint className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-lg font-semibold">Finding adoptable pets near Vancouver…</h2>
        <p className="mt-1 text-xs text-muted-foreground">Pulling fresh listings from local shelter and rescue adoption feeds.</p>
        <div className="mt-5 space-y-2">
          <Skeleton className="h-3 w-3/4 mx-auto rounded-full" />
          <Skeleton className="h-3 w-1/2 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="absolute inset-0 rounded-3xl border border-warning/30 bg-warning/5 grid place-items-center p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-warning/15 text-warning">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold">We couldn't load listings</h2>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        <Button onClick={onRetry} className="mt-4 rounded-full bg-grad-primary">
          <RotateCcw className="mr-1 h-4 w-4" /> Try again
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">Live listings only — please retry in a moment.</p>
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function FiltersSheet({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const toggle = <K extends keyof Filters>(key: K, val: Filters[K] extends Array<infer U> ? U : never) => {
    const arr = filters[key] as unknown as string[];
    const next = arr.includes(val as unknown as string)
      ? arr.filter((v) => v !== (val as unknown as string))
      : [...arr, val as unknown as string];
    setFilters({ ...filters, [key]: next as unknown as Filters[K] });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Sliders className="mr-1.5 h-4 w-4" /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Refine your discover feed</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-7">
          <FilterGroup title="Species">
            {(["dog", "cat", "rabbit", "small"] as Species[]).map((s) => (
              <Chip key={s} active={filters.species.includes(s)} onClick={() => toggle("species", s)}>
                {s === "small" ? "Small animals" : s.charAt(0).toUpperCase() + s.slice(1)}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup title="Size">
            {(["small", "medium", "large"] as Size[]).map((s) => (
              <Chip key={s} active={filters.sizes.includes(s)} onClick={() => toggle("sizes", s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup title="Energy level">
            {(["low", "medium", "high"] as EnergyLevel[]).map((s) => (
              <Chip key={s} active={filters.energy.includes(s)} onClick={() => toggle("energy", s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup title="Lower Mainland cities">
            {LOWER_MAINLAND_CITIES.map((c) => (
              <Chip key={c} active={filters.cities.includes(c)} onClick={() => toggle("cities", c)}>
                {c}
              </Chip>
            ))}
          </FilterGroup>
          <label className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 cursor-pointer hover:bg-muted">
            <Checkbox
              checked={filters.lowerMainlandOnly}
              onCheckedChange={(v) => setFilters({ ...filters, lowerMainlandOnly: !!v })}
            />
            <span className="text-sm">
              Lower Mainland only
              <span className="block text-xs text-muted-foreground">Uncheck to include broader BC listings.</span>
            </span>
          </label>
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Max distance</Label>
              <span className="text-sm text-muted-foreground">{filters.maxDistance} km</span>
            </div>
            <Slider
              value={[filters.maxDistance]}
              min={5}
              max={100}
              step={5}
              onValueChange={([v]) => setFilters({ ...filters, maxDistance: v })}
              className="mt-3"
            />
          </div>
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Compatibility</Label>
            {[
              { k: "goodWithDogs" as const, l: "Good with dogs" },
              { k: "goodWithCats" as const, l: "Good with cats" },
              { k: "goodWithKids" as const, l: "Good with kids" },
            ].map(({ k, l }) => (
              <label key={k} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 cursor-pointer hover:bg-muted">
                <Checkbox checked={filters[k]} onCheckedChange={(v) => setFilters({ ...filters, [k]: !!v })} />
                <span className="text-sm">{l}</span>
              </label>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-center text-muted-foreground"
            onClick={() =>
              setFilters({
                species: [], sizes: [], energy: [], cities: [], lowerMainlandOnly: true,
                maxDistance: 50, goodWithDogs: false, goodWithCats: false, goodWithKids: false,
              })
            }
          >
            <X className="mr-1 h-4 w-4" /> Reset filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium">{title}</Label>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-card text-foreground/80 hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

export default Discover;
