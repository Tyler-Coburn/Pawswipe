import { Link } from "react-router-dom";
import { Heart, MapPin, ShieldCheck } from "lucide-react";
import type { Pet } from "@/lib/types";
import { PetArt } from "./PetArt";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { useSavedPets } from "@/hooks/useSavedPets";
import { cn } from "@/lib/utils";

export function PetGridCard({ pet }: { pet: Pet }) {
  const { has, toggle } = useSavedPets();
  const saved = has(pet.id);
  return (
    <article className="group bg-grad-card rounded-3xl shadow-card overflow-hidden border border-border/70 hover:shadow-float transition-all duration-300">
      <Link to={`/pets/${pet.id}`} className="block">
        <PetArt species={pet.species} name={pet.name} variant={pet.name.length} photoUrl={pet.images?.[0]} className="aspect-[4/3]" rounded="rounded-none" />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/pets/${pet.id}`}>
              <h3 className="font-display text-lg font-semibold leading-tight truncate group-hover:text-primary transition-colors">
                {pet.name}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground truncate">
              {pet.breed} · {pet.age} · {pet.gender === "male" ? "♂" : "♀"}
            </p>
          </div>
          <button
            aria-label={saved ? "Remove from saved" : "Save pet"}
            onClick={() => toggle(pet)}
            className={cn(
              "shrink-0 grid h-9 w-9 place-items-center rounded-full border transition-colors",
              saved
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-background text-muted-foreground border-border hover:text-accent hover:border-accent",
            )}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-current")} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {pet.locationCity} · {pet.distanceKm}km
          </span>
          <StatusBadge status={pet.status} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{pet.shelterName}</span>
          </span>
          <SourceBadge source={pet.source ?? "mock"} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pet.personalityTags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
