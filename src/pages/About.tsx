import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PawPrint, Heart, MapPin, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <AppShell>
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80">
            <PawPrint className="h-3.5 w-3.5 text-primary" />
            Our mission
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Helping Vancouver find adoptable pets responsibly.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            PawSwipe is an independent Vancouver and Lower Mainland adoption discovery platform. We help people find adoptable pets listed by local shelters and rescues — because every pet deserves a home, and every adopter deserves clarity. PawSwipe does not sell pets and is not officially affiliated with any shelter.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            {
              icon: MapPin,
              title: "Local first",
              body: "Built for Vancouver, Burnaby, Richmond, the North Shore, and beyond. We surface pets whose shelter is within reach so meet-and-greets stay easy.",
            },
            {
              icon: ShieldCheck,
              title: "Shelter-confirmed",
              body: "Every listing is synced from a local shelter or rescue adoption feed. Shelters confirm availability and make all final adoption decisions. No marketplaces, no brokers.",
            },
            {
              icon: Heart,
              title: "Adoption-only",
              body: "PawSwipe does not sell pets. We are an introduction platform — interest notes are introductions, not guaranteed applications. The shelter's own process always applies.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-3xl border border-border bg-grad-card p-6 shadow-soft text-center"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto rounded-3xl border border-border bg-background p-8 md:p-10 shadow-soft">
          <h2 className="font-display text-2xl font-semibold tracking-tight">What we believe</h2>
          <ul className="mt-5 space-y-4">
            {[
              "Adoption is a commitment, not a transaction.",
              "Shelters know their animals best — we help adopters listen.",
              "Transparency builds trust: clear bios, medical notes, and availability.",
              "Local communities thrive when pets find stable, loving homes.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-success shrink-0" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 max-w-3xl mx-auto rounded-3xl border border-border bg-accent-soft p-8 md:p-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">For shelters</h2>
          <p className="mt-3 text-muted-foreground">
            PawSwipe helps local adopters discover pets from your shelter or rescue listings. We do not replace your official application process — we simply help interested adopters find you. In the future, shelter accounts will allow you to manage listings and review interest notes directly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-grad-primary shadow-soft hover:opacity-95 px-6">
              <Link to="/shelters">
                Browse shelters
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <Link to="/status">Platform status</Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default About;
