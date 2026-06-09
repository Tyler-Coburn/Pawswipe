import { Cat, Dog, Rabbit, PawPrint } from "lucide-react";
import type { Species } from "@/lib/types";
import { speciesGradient } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Props {
  species: Species;
  name: string;
  variant?: number;
  className?: string;
  rounded?: string;
  /** Real photo URL — when provided and looks like an http(s) URL, renders the photo. */
  photoUrl?: string;
}

export function isHttpUrl(s: string | undefined) {
  return !!s && /^https?:\/\//.test(s);
}

/**
 * Renders a real pet photo when available, otherwise a soft branded
 * illustration tile per pet.
 */
export function PetArt({ species, name, variant = 0, className, rounded = "rounded-3xl", photoUrl }: Props) {
  const Icon = species === "dog" ? Dog : species === "cat" ? Cat : species === "rabbit" ? Rabbit : PawPrint;
  const initial = name.charAt(0).toUpperCase();

  if (isHttpUrl(photoUrl)) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", rounded, className)}>
        <img
          src={photoUrl}
          alt={`Photo of ${name}, available for adoption`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover [object-position:center_30%]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        speciesGradient[species],
        rounded,
        className,
      )}
      aria-label={`${name} portrait illustration`}
    >
      <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/40 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white/70 shadow-soft backdrop-blur-sm">
          <Icon className="h-20 w-20 text-foreground/75" strokeWidth={1.4} />
          <span className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-foreground text-background font-display text-lg">
            {initial}
          </span>
        </div>
      </div>
      <PawPrint className="absolute right-4 top-4 h-5 w-5 text-foreground/30" style={{ transform: `rotate(${(variant * 23) % 45}deg)` }} />
      <PawPrint className="absolute left-5 bottom-6 h-4 w-4 text-foreground/25" style={{ transform: `rotate(${(variant * 17 + 30) % 60}deg)` }} />
    </div>
  );
}
