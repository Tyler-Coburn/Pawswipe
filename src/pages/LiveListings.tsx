import { ExternalLink, Info } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const LiveListings = () => {
  const widgetUrl = import.meta.env.VITE_PETFINDER_WIDGET_URL as string | undefined;

  return (
    <AppShell>
      <div className="container max-w-5xl py-8 md:py-12">
        <p className="text-sm font-medium uppercase tracking-wider text-info">Live data</p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold tracking-tight">
          Live adoptable pet listings
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          These listings come from the Petfinder Custom Pet List widget. Embedded results
          are sourced externally — final adoption availability, fit, and next steps are
          confirmed by the shelter that posted each pet.
        </p>

        {widgetUrl ? (
          <div className="mt-8 rounded-3xl border border-border bg-grad-card p-2 shadow-soft overflow-hidden">
            <iframe
              src={widgetUrl}
              title="Petfinder adoptable pets"
              className="w-full rounded-2xl"
              style={{ minHeight: "78vh", border: 0 }}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-grad-card p-8">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Info className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold">Petfinder widget not configured</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">VITE_PETFINDER_WIDGET_URL</code>{" "}
                  to your Petfinder Custom Pet List embed URL and reload the app.
                </p>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-foreground/85">
                  <li>Create a Custom Pet List on petfinder.com (foundation account).</li>
                  <li>Open the embed code and copy the iframe <strong>src</strong> URL.</li>
                  <li>Add it to your <code className="rounded bg-muted px-1 text-xs">.env</code> as <code className="rounded bg-muted px-1 text-xs">VITE_PETFINDER_WIDGET_URL</code>.</li>
                </ol>
                <a
                  href="https://www.petfinder.com/foundation/widget/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Petfinder widget docs <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground max-w-2xl">
          PawSwipe does not control Petfinder's listing content. Please confirm availability
          and adoption requirements directly with the shelter listed on each pet.
        </p>
      </div>
    </AppShell>
  );
};

export default LiveListings;
