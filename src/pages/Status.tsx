import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import {
  PawPrint,
  Globe,
  Database,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const Status = () => {
  return (
    <AppShell>
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80">
            <PawPrint className="h-3.5 w-3.5 text-primary" />
            Platform status
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            How PawSwipe works today.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            We are transparent about what is live, what is preview, and what is coming next.
          </p>
        </div>

        <div className="mt-14 max-w-4xl mx-auto space-y-5">
          {[
            {
              icon: Globe,
              status: "live",
              title: "Live adoption listings",
              body: "Pet listings are synced in real time from RescueGroups, a trusted shelter data platform. Availability and details may change quickly as shelters update their records.",
            },
            {
              icon: Database,
              status: "live",
              title: "Saved pets & interest notes",
              body: "You can save pets and submit adoption interest notes. If you create an account, your saved pets and notes persist across devices. Anonymous visitors can still browse and save during their session.",
            },
            {
              icon: ShieldCheck,
              status: "preview",
              title: "Shelter dashboard",
              body: "The shelter dashboard is a preview of what future shelter accounts will look like. It currently shows redacted, read-only data for demo purposes. Rescues will be able to review interest notes and manage listings once onboarded.",
            },
            {
              icon: AlertCircle,
              status: "future",
              title: "Petfinder integration",
              body: "A future Petfinder widget or API integration is planned as an optional expansion to surface even more adoptable pets across the Lower Mainland.",
            },
          ].map(({ icon: Icon, status, title, body }) => (
            <div
              key={title}
              className="rounded-3xl border border-border bg-grad-card p-6 md:p-8 shadow-soft flex gap-5 items-start"
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                  status === "live"
                    ? "bg-success/15 text-success"
                    : status === "preview"
                      ? "bg-warning/15 text-warning"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      status === "live"
                        ? "bg-success/15 text-success"
                        : status === "preview"
                          ? "bg-warning/15 text-warning"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-4xl mx-auto rounded-3xl border border-border bg-background p-8 md:p-10 shadow-soft">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Privacy & responsibility</h2>
          <ul className="mt-5 space-y-3">
            {[
              "We do not sell your data.",
              "Interest notes are stored privately and are not yet delivered to shelters — they're saved for when shelter accounts go live.",
              "We do not process payments or sell pets.",
              "Shelters confirm availability and make all final adoption decisions.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-success shrink-0" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/data-health"
              className="inline-flex items-center gap-2 rounded-full bg-grad-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 transition-opacity"
            >
              View data health
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              About PawSwipe
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Status;
