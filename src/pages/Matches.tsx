import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Heart, Send, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedPets } from "@/hooks/useSavedPets";
import { GET_pets } from "@/lib/api/pets";
import { listSavedPetSnapshots, type SavedPetRow } from "@/lib/api/savedPets";
import { PetArt } from "@/components/pet/PetArt";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import type { DataSource, Pet } from "@/lib/types";

interface MatchView {
  id: string;
  name: string;
  breed?: string;
  city?: string;
  source: DataSource;
  sourceUrl?: string;
  shelterName?: string;
  imageUrl?: string;
  bio?: string;
  status?: Pet["status"];
  /** True when we have a live `Pet` record (Apply / View profile work). */
  isLive: boolean;
}

const Matches = () => {
  const { ids, remove } = useSavedPets();
  const [view, setView] = useState<MatchView[]>([]);
  const [loading, setLoading] = useState(true);
  const [persisted, setPersisted] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      let snapshots: SavedPetRow[] = [];
      try {
        snapshots = await listSavedPetSnapshots();
        if (active) setPersisted(true);
      } catch {
        if (active) setPersisted(false);
      }

      let livePets: Pet[] = [];
      try {
        const res = await GET_pets();
        livePets = res.pets;
      } catch {
        /* live feed unavailable — fall back to snapshots/local ids */
      }
      if (!active) return;

      const livePetById = new Map(livePets.map((p) => [p.id, p]));
      const snapshotById = new Map(snapshots.map((s) => [s.pet_id, s]));
      const allIds = Array.from(new Set([...snapshots.map((s) => s.pet_id), ...ids]));

      const merged: MatchView[] = allIds.map((id) => {
        const live = livePetById.get(id);
        if (live) {
          return {
            id: live.id,
            name: live.name,
            breed: live.breed,
            city: live.locationCity,
            source: (live.source ?? "mock") as DataSource,
            sourceUrl: live.sourceUrl,
            shelterName: live.shelterName,
            imageUrl: live.images?.[0],
            bio: live.bio,
            status: live.status,
            isLive: true,
          };
        }
        const snap = snapshotById.get(id);
        return {
          id,
          name: snap?.pet_name ?? "Saved pet",
          city: undefined,
          source: ((snap?.source as DataSource) ?? "mock"),
          sourceUrl: snap?.source_url ?? undefined,
          shelterName: snap?.shelter_name ?? undefined,
          imageUrl: snap?.image_url ?? undefined,
          isLive: false,
        };
      });

      setView(merged);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [ids]);

  return (
    <AppShell>
      <div className="container max-w-5xl py-8 md:py-12">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">Your matches</p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold tracking-tight">Saved pets</h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Your saved pets are a starting point. Shelters confirm availability and make the final adoption decision based on what's best for each animal.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm text-primary">
            <Heart className="h-4 w-4 fill-current" /> {view.length} saved
          </span>
        </div>

        {!persisted && !loading && (
          <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-xs text-muted-foreground inline-flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
            <span>Saved offline — we'll sync your matches when the database is reachable again.</span>
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
          </div>
        ) : view.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-grad-card p-12 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold">No matches yet</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Start swiping to build a shortlist of adoptable pets near Vancouver. Your matches now persist between visits.
            </p>
            <Button asChild className="mt-5 rounded-full bg-grad-primary"><Link to="/discover">Discover pets</Link></Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {view.map((pet) => (
              <article key={pet.id} className="rounded-3xl border border-border bg-grad-card shadow-card overflow-hidden">
                {pet.isLive ? (
                  <Link to={`/pets/${pet.id}`} aria-label={`View ${pet.name}`}>
                    <PetArt species={"dog"} name={pet.name} variant={pet.name.length} photoUrl={pet.imageUrl} className="aspect-[4/3]" rounded="rounded-none" />
                  </Link>
                ) : (
                  <PetArt species={"dog"} name={pet.name} variant={pet.name.length} photoUrl={pet.imageUrl} className="aspect-[4/3]" rounded="rounded-none" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {pet.isLive ? (
                        <Link to={`/pets/${pet.id}`} className="block">
                          <h3 className="font-display text-lg font-semibold truncate hover:text-primary">{pet.name}</h3>
                        </Link>
                      ) : (
                        <h3 className="font-display text-lg font-semibold truncate">{pet.name}</h3>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {[pet.breed, pet.city].filter(Boolean).join(" · ") || pet.shelterName || "Saved pet"}
                      </p>
                    </div>
                    {pet.status && <StatusBadge status={pet.status} />}
                  </div>
                  <div className="mt-2"><SourceBadge source={pet.source} /></div>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {pet.bio || (pet.isLive ? "Confirm details with the shelter." : "This listing is no longer in the live feed. Open the official shelter listing for the latest status.")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pet.isLive ? (
                      <>
                        <Button asChild size="sm" className="rounded-full bg-grad-primary">
                          <Link to={`/apply/${pet.id}`}><Send className="mr-1 h-3.5 w-3.5" /> Start interest note</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="rounded-full">
                          <Link to={`/pets/${pet.id}`}>View profile</Link>
                        </Button>
                      </>
                    ) : pet.sourceUrl ? (
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <a href={pet.sourceUrl} target="_blank" rel="noreferrer">View official listing</a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Confirm with shelter</span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-muted-foreground hover:text-destructive ml-auto"
                      onClick={() => remove(pet.id)}
                      aria-label={`Remove ${pet.name} from matches`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Matches;
