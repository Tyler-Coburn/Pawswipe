import { Link } from "react-router-dom";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import type { Shelter } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ShelterCard({ shelter }: { shelter: Shelter }) {
  return (
    <Link
      to={`/shelters/${shelter.id}`}
      className="group block rounded-3xl border border-border/70 bg-grad-card shadow-card hover:shadow-float transition-all duration-300 overflow-hidden"
    >
      <div className={cn("h-24 bg-gradient-to-br", shelter.accent)}>
        <div className="h-full w-full p-4 flex items-end justify-between">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-background shadow-soft">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground/80">
            {shelter.source === "rescuegroups" || shelter.source === "petfinder"
              ? "External listing"
              : shelter.source === "shelter-direct"
                ? "Listed shelter"
                : "Local rescue"}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
          {shelter.name}
        </h3>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {shelter.location} · {shelter.city}
        </p>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{shelter.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{shelter.petsAvailable}</span> pets available
          </span>
          <span className="inline-flex items-center gap-1 text-primary font-medium">
            View profile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
