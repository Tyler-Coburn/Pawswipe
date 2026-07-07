import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Send, Phone, Mail, CalendarClock, Building2, Syringe, Stethoscope, Users, Dog, Cat, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { PetArt } from "@/components/pet/PetArt";
import { GET_pet } from "@/lib/api/pets";
import { GET_shelter } from "@/lib/api/shelters";
import { useSavedPets } from "@/hooks/useSavedPets";
import { cn } from "@/lib/utils";
import type { Pet, Shelter } from "@/lib/types";

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { has, toggle } = useSavedPets();
  const [pet, setPet] = useState<Pet | undefined>();
  const [shelter, setShelter] = useState<Shelter | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) { setLoading(false); return; }
      const p = await GET_pet(id);
      if (!active) return;
      setPet(p);
      setLoading(false);
      if (p?.shelterId) {
        try {
          const s = await GET_shelter(p.shelterId);
          if (active) setShelter(s);
        } catch { /* shelter optional */ }
      }
    })();
    return () => { active = false; };
  }, [id]);

  const saved = pet ? has(pet.id) : false;

  if (loading) {
    return (
      <AppShell>
        <div className="container max-w-5xl py-10"><Skeleton className="h-[60vh] w-full rounded-3xl" /></div>
      </AppShell>
    );
  }

  if (!pet) {
    return (
      <AppShell>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl">Pet not found</h1>
          <Button asChild className="mt-4 rounded-full"><Link to="/discover">Back to discover</Link></Button>
        </div>
      </AppShell>
    );
  }

  // shelter is loaded asynchronously above
  const daysSinceUpdate = Math.floor((Date.now() - new Date(pet.lastUpdated).getTime()) / 86400000);
  const stale = daysSinceUpdate > 30;

  const Fact = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="rounded-2xl border border-border bg-grad-card p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );

  return (
    <AppShell>
      <div className="container max-w-5xl py-6 md:py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-full mb-4 -ml-2">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>

        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
          {/* Gallery */}
          <div>
            <PetArt species={pet.species} name={pet.name} variant={1} photoUrl={pet.images?.[0]} className="aspect-square shadow-card" />
            {pet.images && pet.images.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {pet.images.slice(1, 4).map((url, i) => (
                  <PetArt key={i} species={pet.species} name={pet.name} variant={i + 2} photoUrl={url} className="aspect-square" rounded="rounded-2xl" />
                ))}
              </div>
            )}
            {(!pet.images || pet.images.length <= 1) && (
              <p className="mt-3 text-xs text-muted-foreground">
                Only one photo available — the shelter may share more during a meet-and-greet.
              </p>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={pet.status} />
                  <SourceBadge source={pet.source ?? "mock"} />
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {pet.locationCity}{pet.distanceKm ? ` · ${pet.distanceKm}km` : ""}
                  </span>
                </div>
                <h1 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight break-words">{pet.name}</h1>
                <p className="mt-1 text-muted-foreground break-words">
                  {pet.breed} · {pet.age} · {pet.gender === "male" ? "Male" : pet.gender === "female" ? "Female" : "Sex not listed"} · {pet.size}
                </p>
              </div>
              <button
                onClick={() => toggle(pet)}
                aria-label={saved ? "Unsave" : "Save"}
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full border shrink-0 transition-colors",
                  saved ? "bg-accent text-accent-foreground border-accent" : "bg-background text-muted-foreground border-border hover:text-accent",
                )}
              >
                <Heart className={cn("h-5 w-5", saved && "fill-current")} />
              </button>
            </div>

            <Link
              to={`/shelters/${pet.shelterId}`}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-grad-card p-3 hover:bg-muted transition-colors"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Building2 className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{pet.shelterName}</p>
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-primary" /> Local shelter or rescue — confirm details directly
                </p>
              </div>
              <span className="text-xs text-primary font-medium">View →</span>
            </Link>

            {(pet.sourceUrl || pet.lastSyncedAt) && (
              <div className="mt-4 rounded-2xl border border-border bg-grad-card p-3 text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                {pet.lastSyncedAt && <span>Synced {Math.max(0, Math.floor((Date.now() - new Date(pet.lastSyncedAt).getTime()) / 3600000))}h ago</span>}
                {pet.lastUpdatedAt && <span>Shelter last updated {Math.max(0, Math.floor((Date.now() - new Date(pet.lastUpdatedAt).getTime()) / 86400000))}d ago</span>}
                {pet.sourceUrl && (
                  <a href={pet.sourceUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 font-medium text-primary hover:underline">
                    View original listing <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            {stale && (
              <div className="mt-3 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-sm text-foreground">
                This listing was last updated {daysSinceUpdate} days ago. Confirm availability and adoption requirements directly with the shelter — details may have changed.
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {pet.personalityTags.map((t) => (
                <span key={t} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">{t}</span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="lg" className="rounded-full bg-grad-primary px-6 shadow-soft">
                <Link to={`/apply/${pet.id}`}><Send className="mr-1.5 h-4 w-4" /> Start interest note</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-5"
                onClick={() => toggle(pet)}
              >
                <Heart className={cn("mr-1.5 h-4 w-4", saved && "fill-current text-accent")} />
                {saved ? "Saved" : "Save pet"}
              </Button>
              {pet.sourceUrl && (
                <Button asChild size="lg" variant="ghost" className="rounded-full px-5">
                  <a href={pet.sourceUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-1.5 h-4 w-4" /> View official listing
                  </a>
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <h2 className="font-display text-xl font-semibold">About {pet.name}</h2>
            <p className="mt-2 text-foreground/85 leading-relaxed whitespace-pre-line">
              {pet.bio || `The shelter hasn't shared a written bio for ${pet.name} yet. Reach out to learn more about personality and routine.`}
            </p>

            {pet.idealHome && (
              <>
                <h3 className="font-display text-lg font-semibold mt-6">Ideal home</h3>
                <p className="mt-1 text-foreground/85">{pet.idealHome}</p>
              </>
            )}
          </div>
        </div>

        {/* Facts */}
        <div className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-4">
          <Fact label="Energy" value={`${pet.energyLevel[0].toUpperCase()}${pet.energyLevel.slice(1)}`} />
          <Fact label="Size" value={pet.weightKg ? `${pet.size} · ${pet.weightKg} kg` : pet.size} />
          <Fact label="Adoption fee" value={pet.adoptionFee > 0 ? `$${pet.adoptionFee}` : "Ask shelter"} />
          <Fact label="Last updated" value={`${daysSinceUpdate}d ago`} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Compat ok={pet.goodWithDogs} label="Good with dogs" Icon={Dog} />
          <Compat ok={pet.goodWithCats} label="Good with cats" Icon={Cat} />
          <Compat ok={pet.goodWithKids} label="Good with kids" Icon={Users} />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-3xl border border-border bg-grad-card p-6">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" /> Medical
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Syringe className="h-4 w-4 text-primary" /> Vaccinated: <strong>{pet.vaccinated ? "Yes" : "Confirm with shelter"}</strong></li>
              <li className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Spayed/neutered: <strong>{pet.spayedNeutered ? "Yes" : "Confirm with shelter"}</strong></li>
              {pet.medicalNotes && <li className="text-muted-foreground">{pet.medicalNotes}</li>}
            </ul>
          </section>
          <section className="rounded-3xl border border-border bg-grad-card p-6">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" /> Meet-and-greet
            </h3>
            <p className="mt-3 text-sm text-foreground/85">{pet.meetAndGreet}</p>
            {shelter && (shelter.phone || shelter.email) && (
              <div className="mt-4 space-y-1.5 text-sm">
                {shelter.phone && <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {shelter.phone}</p>}
                {shelter.email && <p className="inline-flex items-center gap-2 break-all"><Mail className="h-4 w-4 text-muted-foreground shrink-0" /> {shelter.email}</p>}
              </div>
            )}
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground max-w-xl mx-auto">
          Listings may change quickly. Confirm with the shelter — they make the final adoption decision based on what's best for the animal. PawSwipe does not sell pets.
        </p>
      </div>
    </AppShell>
  );
};

function Compat({ ok, label, Icon }: { ok: boolean; label: string; Icon: typeof Dog }) {
  return (
    <div className={cn(
      "rounded-2xl border p-4 flex items-center gap-3",
      ok ? "border-success/30 bg-success/5" : "border-border bg-muted/40",
    )}>
      <span className={cn(
        "grid h-9 w-9 place-items-center rounded-xl",
        ok ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
      )}>
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{ok ? "Yes" : "Confirm with shelter"}</p>
      </div>
    </div>
  );
}

export default PetDetail;
