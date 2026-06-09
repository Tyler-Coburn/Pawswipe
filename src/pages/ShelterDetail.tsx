import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Building2, Clock, ExternalLink, Globe, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { PetGridCard } from "@/components/pet/PetGridCard";
import { GET_shelter } from "@/lib/api/shelters";
import { GET_pets } from "@/lib/api/pets";
import type { Pet, Shelter } from "@/lib/types";

const ShelterDetail = () => {
  const { id } = useParams();
  const [shelter, setShelter] = useState<Shelter | undefined>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) { setLoading(false); return; }
      try {
        const [s, p] = await Promise.all([GET_shelter(id), GET_pets()]);
        if (!active) return;
        setShelter(s);
        setPets(p.pets.filter((x) => x.shelterId === id));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <AppShell>
        <div className="container max-w-5xl py-10"><Skeleton className="h-64 w-full rounded-3xl" /></div>
      </AppShell>
    );
  }

  if (!shelter) {
    const isExternal = id?.startsWith("rescuegroups-") || id?.startsWith("petfinder-");
    return (
      <AppShell>
        <div className="container max-w-xl py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Shelter details unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isExternal
              ? "This listing was synced from an external adoption feed. Confirm details through the official listing."
              : "We couldn't find this shelter's profile. It may have been removed or renamed."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/shelters">Browse shelters</Link>
            </Button>
            <Button asChild className="rounded-full bg-grad-primary">
              <Link to="/discover">Back to discover</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const accent = shelter.accent || "from-primary/15 to-primary/5";
  const cityLine = [shelter.location, shelter.city].filter(Boolean).join(" · ") || "Lower Mainland";

  return (
    <AppShell>
      <div className={`bg-gradient-to-br ${accent}`}>
        <div className="container max-w-5xl py-10 md:py-14">
          <div className="flex items-start gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-background shadow-soft">
              <Building2 className="h-7 w-7 text-primary" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {shelter.source === "shelter-direct" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" /> Managed on PawSwipe
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground/80">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Listed on PawSwipe
                  </span>
                )}
                <SourceBadge source={shelter.source ?? "mock"} />
              </div>
              <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight break-words">{shelter.name}</h1>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-foreground/70">
                <MapPin className="h-4 w-4" /> {cityLine}
              </p>
              {shelter.sourceUrl && (
                <a href={shelter.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View official shelter listing <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-display text-xl font-semibold">About</h2>
          <p className="mt-2 text-foreground/85 leading-relaxed">
            {shelter.description || "PawSwipe surfaces this shelter's adoptable pets. Confirm availability and adoption requirements directly with the shelter."}
          </p>

          {shelter.adoptionProcess.length > 0 && (
            <>
              <h2 className="mt-8 font-display text-xl font-semibold">Adoption process</h2>
              <ol className="mt-3 space-y-2">
                {shelter.adoptionProcess.map((s, i) => (
                  <li key={s} className="flex items-start gap-3 rounded-2xl border border-border bg-grad-card p-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">{i + 1}</span>
                    <span className="text-sm">{s}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Available pets ({pets.length})</h2>
            <Button asChild variant="ghost" className="rounded-full"><Link to="/discover">Browse more pets nearby <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {pets.map((p) => <PetGridCard key={p.id} pet={p} />)}
            {pets.length === 0 && (
              <p className="text-sm text-muted-foreground sm:col-span-2">
                No pets from this shelter currently appear in the synced feed. Visit the shelter's official listing for the latest availability.
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-3xl border border-border bg-grad-card p-5 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {shelter.phone && <li className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {shelter.phone}</li>}
              {shelter.email && <li className="inline-flex items-center gap-2 break-all"><Mail className="h-4 w-4 text-muted-foreground shrink-0" /> {shelter.email}</li>}
              {shelter.website && (
                <li className="inline-flex items-center gap-2 break-all">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={shelter.website.startsWith("http") ? shelter.website : `https://${shelter.website}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{shelter.website}</a>
                </li>
              )}
              {shelter.hours && <li className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {shelter.hours}</li>}
              {!shelter.phone && !shelter.email && !shelter.website && !shelter.hours && (
                <li className="text-muted-foreground text-xs">
                  Contact details not available in the synced feed. Open the official shelter listing to confirm.
                </li>
              )}
            </ul>
          </div>
          {shelter.responseTime && (
            <div className="rounded-3xl border border-border bg-grad-card p-5">
              <h3 className="font-display text-lg font-semibold">Response time</h3>
              <p className="mt-1 text-sm text-muted-foreground">{shelter.responseTime}</p>
            </div>
          )}
          <div className="rounded-3xl border border-border bg-accent-soft p-5 text-sm">
            Adoption decisions are made by {shelter.name}. PawSwipe helps you discover adoptable pets — final approval rests with the shelter unless they manage adoptions directly through PawSwipe.
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default ShelterDetail;
