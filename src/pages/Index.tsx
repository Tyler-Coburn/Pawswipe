import { Link } from "react-router-dom";
import {
  PawPrint,
  Heart,
  Compass,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cat,
  Dog,
  Rabbit,
  Send,
  Activity,
  Ban,
  Bookmark,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { PETS, SHELTERS } from "@/lib/mockData";
import { PetGridCard } from "@/components/pet/PetGridCard";
import { ShelterCard } from "@/components/shelter/ShelterCard";
import { PetArt } from "@/components/pet/PetArt";

const cities = [
  "Vancouver", "North Vancouver", "Burnaby", "Richmond",
  "Surrey", "Coquitlam", "New Westminster", "Langley", "Delta", "Mission",
];

const Index = () => {
  const featured = PETS.filter((p) => p.status === "available").slice(0, 6);
  const shelters = SHELTERS.slice(0, 3);
  const previewPets = PETS.slice(0, 3);

  return (
    <AppShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-40 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="container relative grid gap-12 py-16 md:py-24 md:grid-cols-2 md:items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Built for Vancouver & the Lower Mainland
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-balance">
              Find your next best friend, <span className="text-primary">one swipe</span> at a time.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground text-balance">
              PawSwipe helps people in Vancouver and the Lower Mainland discover adoptable pets from local shelters and rescue adoption feeds — through a simple, thoughtful swipe experience.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-grad-primary shadow-soft hover:opacity-95 px-6">
                <Link to="/discover">
                  <Compass className="mr-2 h-4 w-4" />
                  Start discovering
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link to="/shelters">
                  Browse local shelters
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Shelter-confirmed adoption</span>
              <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-accent" /> No pet sales</span>
              <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-info" /> Live adoption feeds</span>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[9/19] rounded-[3rem] border border-border bg-background shadow-float p-3 animate-float-soft">
              <div className="absolute left-1/2 top-3 -translate-x-1/2 h-5 w-28 rounded-full bg-foreground/85 z-10" />
              <div className="relative h-full w-full rounded-[2.4rem] bg-warm overflow-hidden">
                <div className="absolute inset-0 p-4 pt-10">
                  {previewPets.map((p, i) => (
                    <div
                      key={p.id}
                      className="absolute inset-x-4 top-10"
                      style={{
                        height: "70%",
                        transform: `translateY(${i * 12}px) rotate(${(i - 1) * 4}deg) scale(${1 - i * 0.04})`,
                        zIndex: 10 - i,
                      }}
                    >
                      <div className="h-full w-full rounded-3xl shadow-card overflow-hidden bg-card border border-border/60 flex flex-col">
                        <PetArt species={p.species} name={p.name} variant={i} className="flex-1" rounded="rounded-none" />
                        <div className="p-3">
                          <p className="font-display text-sm font-semibold">{p.name} · {p.age}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{p.breed} · {p.locationCity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* fake bottom action bar */}
                  <div className="absolute inset-x-6 bottom-6 grid grid-cols-3 gap-2">
                    <div className="grid h-12 place-items-center rounded-2xl border border-border bg-background text-muted-foreground">
                      <PawPrint className="h-5 w-5" />
                    </div>
                    <div className="grid h-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                      <Send className="h-5 w-5" />
                    </div>
                    <div className="grid h-12 place-items-center rounded-2xl bg-grad-accent text-accent-foreground shadow-soft">
                      <Heart className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* floating tag */}
            <div className="absolute -left-6 top-12 hidden md:flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 shadow-card animate-fade-up">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-primary">
                <Heart className="h-3.5 w-3.5" />
              </span>
              <div className="text-xs">
                <p className="font-semibold">Saved Mochi</p>
                <p className="text-muted-foreground">Pacific Coast SPCA</p>
              </div>
            </div>
            <div className="absolute -right-4 bottom-20 hidden md:flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 shadow-card animate-fade-up">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <div className="text-xs">
                <p className="font-semibold">Interest sent</p>
                <p className="text-muted-foreground">Replies in 2 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="container pb-8 pt-2">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-soft">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { Icon: Activity, label: "Live adoption feed" },
              { Icon: Ban, label: "No pet sales" },
              { Icon: ShieldCheck, label: "Shelter-confirmed adoption" },
              { Icon: Bookmark, label: "Saved pets with account" },
              { Icon: MapPin, label: "Vancouver / Lower Mainland" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-primary shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">How it works</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Five quiet steps between you and your new best friend.
          </h2>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-5">
          {[
            { t: "Set your preferences", d: "Tell us about your home, lifestyle, and what you're looking for." },
            { t: "Swipe through local pets", d: "Discover adoptable animals listed by Lower Mainland shelters and rescues." },
            { t: "Save your matches", d: "Build a shortlist of pets that feel right for your home." },
            { t: "Send an interest note", d: "Share a thoughtful adoption interest message — it's an introduction, not a guaranteed application." },
            { t: "Connect with the shelter", d: "The shelter confirms availability and reviews next steps — they always make the final call." },
          ].map((s, i) => (
            <li key={s.t} className="rounded-3xl border border-border bg-grad-card p-5 shadow-soft">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft font-display text-primary">{i + 1}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FEATURED PETS */}
      <section className="container py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">Available now</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Pets looking for a home this week.
            </h2>
          </div>
          <Button asChild variant="ghost" className="rounded-full hidden sm:inline-flex">
            <Link to="/discover">See all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <PetGridCard key={p.id} pet={p} />)}
        </div>
      </section>

      {/* SHELTERS */}
      <section className="container py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-info">Local shelters</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Shelters and rescues across the Lower Mainland.
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Every listing on PawSwipe is synced from a local shelter or rescue adoption feed. Browse organizations near you and learn how each one approaches adoption. PawSwipe is an independent discovery platform — no official partnerships are implied.
            </p>
          </div>
          <Button asChild variant="ghost" className="rounded-full hidden sm:inline-flex">
            <Link to="/shelters">All shelters <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {shelters.map((s) => <ShelterCard key={s.id} shelter={s} />)}
        </div>
      </section>

      {/* FOR SHELTERS */}
      <section className="container py-12">
        <div className="rounded-3xl border border-border bg-grad-card p-8 md:p-12 shadow-soft">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">For shelters</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              A discovery channel for local rescue listings.
            </h2>
            <p className="mt-3 text-muted-foreground">
              PawSwipe helps local adopters discover pets from your shelter or rescue listings. We do not sell pets, and shelters make all final adoption decisions. Interest notes sent through PawSwipe are introductions — they are not a replacement for your official shelter application unless you choose to use PawSwipe directly. In the future, shelter accounts will let rescues manage listings and review interest notes in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-full px-5">
                <Link to="/shelter-dashboard">Preview dashboard</Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full px-5">
                <Link to="/about">Learn more <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { Icon: PawPrint, t: "We do not sell pets", d: "PawSwipe is an introduction platform, not a marketplace." },
              { Icon: Users, t: "Shelters decide", d: "Final adoption decisions are always made by the shelter, based on what's best for the animal." },
              { Icon: CheckCircle2, t: "Future shelter accounts", d: "Rescues will soon be able to manage listings and review interest notes directly." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-border bg-background p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-display text-sm font-semibold">{t}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL */}
      <section className="container py-12">
        <div className="rounded-3xl bg-grad-card border border-border p-8 md:p-12 shadow-soft">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">Hyper-local by design</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
                Find pets near your neighbourhood.
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Filter by distance from Vancouver, Burnaby, Richmond, the North Shore, and beyond. We surface animals whose shelter is within reach, so meet-and-greets stay easy.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {cities.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-background border border-border px-3 py-1 text-xs font-medium text-foreground/80">
                    <MapPin className="h-3 w-3 text-primary" />{c}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[Dog, Cat, Rabbit].map((Icon, i) => (
                <div key={i} className="aspect-square rounded-3xl bg-warm border border-border grid place-items-center shadow-soft">
                  <Icon className="h-10 w-10 text-foreground/70" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="container py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Trust & safety</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Built around responsible adoption.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { Icon: ShieldCheck, t: "Live adoption feeds", d: "Listings sync from shelter and rescue adoption feeds, so availability stays fresh." },
            { Icon: Heart, t: "Adoption-first", d: "No marketplaces, no checkouts, no pet sales. Just thoughtful introductions." },
            { Icon: CheckCircle2, t: "Clear pet details", d: "Bios, compatibility notes, and last-updated dates upfront — confirm specifics with the shelter." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-3xl border border-border bg-background p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-border bg-accent-soft p-6 md:p-8">
          <p className="font-display text-lg text-foreground">
            Adoption is a commitment. PawSwipe helps you discover pets, but final adoption decisions are made by each shelter — based on what's best for the animal.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-grad-primary p-10 md:p-14 text-primary-foreground shadow-float">
          <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Ready to meet your match?
            </h2>
            <p className="mt-3 text-primary-foreground/85">
              Set your preferences in under two minutes and start discovering adoptable pets near you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 px-6">
                <Link to="/onboarding">Set my preferences</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 px-6">
                <Link to="/discover">Skip to discover</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Index;
