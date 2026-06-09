import { Heart, X, Info, MapPin, ShieldCheck, Send, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import type { Pet } from "@/lib/types";
import { PetArt } from "./PetArt";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";

interface Props {
  pet: Pet;
  stackOffset?: number; // 0 top, 1 behind, 2 further behind
  onPass?: () => void;
  onSave?: () => void;
  swipeClass?: "" | "swipe-left" | "swipe-right";
  isTop?: boolean;
}

export function SwipeCard({ pet, stackOffset = 0, onPass, onSave, swipeClass = "", isTop = true }: Props) {
  const scale = 1 - stackOffset * 0.05;
  const translateY = stackOffset * 18;
  const opacity = 1 - stackOffset * 0.15;
  return (
    <div
      className={`absolute inset-0 ${swipeClass}`}
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        zIndex: 10 - stackOffset,
        transition: swipeClass ? undefined : "transform 0.4s var(--transition-smooth), opacity 0.4s var(--transition-smooth)",
        pointerEvents: isTop ? "auto" : "none",
      }}
    >
      <article
        className="relative h-full w-full bg-grad-card rounded-3xl shadow-float overflow-hidden border border-border/60 flex flex-col"
        aria-label={`${pet.name}, ${pet.breed}, ${pet.age}, in ${pet.locationCity}`}
      >
        <div className="relative flex-1 overflow-hidden">
          <PetArt species={pet.species} name={pet.name} variant={pet.name.length} photoUrl={pet.images?.[0]} className="absolute inset-0" rounded="rounded-none" />
          {/* gradient bottom — fades art into info panel */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
          {/* top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            <StatusBadge status={pet.status} className="bg-background/90 backdrop-blur shadow-soft" />
            <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground shadow-soft">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {pet.locationCity} · {pet.distanceKm}km
            </span>
          </div>
        </div>

        {/* info panel */}
        <div className="bg-background p-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-semibold leading-tight truncate">
                {pet.name}
                <span className="ml-2 align-middle text-base font-normal text-muted-foreground">
                  {pet.age}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {pet.breed} · {pet.gender === "male" ? "Male" : "Female"} · {pet.size}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span className="truncate max-w-[12rem]">{pet.shelterName}</span>
            </span>
            <SourceBadge source={pet.source ?? "mock"} />
          </div>
          {pet.source === "rescuegroups" && (
            <p className="mt-1.5 text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Globe className="h-3 w-3" /> Confirm availability with the shelter
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pet.personalityTags.map((t) => (
              <span key={t} className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* action bar */}
        {isTop && (
          <div className="grid grid-cols-4 gap-2 border-t border-border bg-background p-3">
            <button
              onClick={onPass}
              aria-label="Pass"
              className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
              Pass
            </button>
            <Link
              to={`/pets/${pet.id}`}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border py-2.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Info className="h-5 w-5" />
              View profile
            </Link>
            <Link
              to={`/apply/${pet.id}`}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-secondary py-2.5 text-xs font-medium text-secondary-foreground hover:opacity-90"
            >
              <Send className="h-5 w-5" />
              Interest
            </Link>
            <button
              onClick={onSave}
              aria-label="Save pet"
              className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-grad-accent py-2.5 text-xs font-semibold text-accent-foreground shadow-soft hover:opacity-95"
            >
              <Heart className="h-5 w-5" />
              Save
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
