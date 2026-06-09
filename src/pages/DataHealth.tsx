import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Database, Lock, RefreshCw, ShieldCheck, User } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { getDataMode } from "@/lib/providers/adoptionProvider";
import { GET_pets } from "@/lib/api/pets";
import { GET_shelters } from "@/lib/api/shelters";
import { GET_providerStatuses, GET_syncLog, POST_sync, type SyncLogEntry } from "@/lib/api/sync";
import { supabase } from "@/integrations/supabase/client";
import { getApplicationsHealth } from "@/lib/api/applications";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

type ProviderStatus = { id: string; label: string; ok: boolean; message: string };

interface DbHealth {
  savedPetsOk: boolean;
  applicationsOk: boolean;
  applicationsTotal: number;
  lastSubmittedAt: string | null;
  message: string;
}

const DataHealth = () => {
  const { user, loading: authLoading } = useAuth();
  const [petCount, setPetCount] = useState<number | null>(null);
  const [shelterCount, setShelterCount] = useState<number | null>(null);
  const [syncedAt, setSyncedAt] = useState<string>("—");
  const [stale, setStale] = useState(0);
  const [log, setLog] = useState<SyncLogEntry[]>(GET_syncLog());
  const [busy, setBusy] = useState(false);
  const [statuses, setStatuses] = useState<ProviderStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [db, setDb] = useState<DbHealth | null>(null);
  const mode = getDataMode();

  const load = async () => {
    setError(null);
    try {
      const [p, s, st] = await Promise.all([GET_pets(), GET_shelters(), GET_providerStatuses()]);
      setPetCount(p.pets.length);
      setShelterCount(s.shelters.length);
      setSyncedAt(p.syncedAt);
      setStatuses(st);
      setUsingFallback(p.source !== mode);
      const now = Date.now();
      setStale(p.pets.filter((x) => now - new Date(x.lastUpdatedAt ?? x.lastUpdated).getTime() > 30 * 86400000).length);
    } catch (e: any) {
      setError(e?.message ?? "Unable to fetch data");
    }

    // Database reachability checks
    const dbState: DbHealth = { savedPetsOk: false, applicationsOk: false, applicationsTotal: 0, lastSubmittedAt: null, message: "" };
    try {
      const { error: spErr } = await supabase.from("saved_pets").select("id", { count: "exact", head: true }).limit(1);
      dbState.savedPetsOk = !spErr;
    } catch { /* offline */ }
    try {
      const h = await getApplicationsHealth();
      dbState.applicationsOk = true;
      dbState.applicationsTotal = h.total;
      dbState.lastSubmittedAt = h.lastSubmittedAt;
    } catch (e: any) {
      dbState.message = e?.message ?? "";
    }
    setDb(dbState);
  };

  useEffect(() => { void load(); }, []);


  const runSync = async () => {
    setBusy(true);
    const next = await POST_sync();
    setLog(next);
    await load();
    setBusy(false);
  };

  return (
    <AppShell>
      <div className="container max-w-5xl py-8 md:py-12">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-info">Operations</p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold tracking-tight">Data health</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              How PawSwipe is sourcing listings right now. Mock data keeps the demo
              working even when external providers are not configured.
            </p>
          </div>
          <Button onClick={runSync} disabled={busy} className="rounded-full bg-grad-primary">
            <RefreshCw className={cn("mr-1.5 h-4 w-4", busy && "animate-spin")} /> Run sync
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Active data mode" value={mode} />
          <Stat label="Pets loaded" value={petCount ?? "…"} />
          <Stat label="Shelters loaded" value={shelterCount ?? "…"} />
          <Stat label="Last sync" value={timeAgo(syncedAt)} />
        </div>

        {(error || usingFallback) && (
          <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm">
            <p className="font-medium inline-flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Live listings unavailable</p>
            <p className="mt-1 text-muted-foreground">{error ?? `The ${mode} provider didn't return data. Check the edge function and API key configuration.`}</p>
          </div>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Database</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className={cn("rounded-2xl border p-4", db?.savedPetsOk ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5")}>
              <div className="flex items-center gap-2">
                {db?.savedPetsOk ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                <p className="font-medium">saved_pets table</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {db?.savedPetsOk ? "Reachable — Matches persist across sessions." : "Unreachable — Matches falls back to local browser storage."}
              </p>
            </div>
            <div className={cn("rounded-2xl border p-4", db?.applicationsOk ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5")}>
              <div className="flex items-center gap-2">
                {db?.applicationsOk ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                <p className="font-medium">adoption_applications table</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {db?.applicationsOk
                  ? `${db.applicationsTotal} interest note${db.applicationsTotal === 1 ? "" : "s"} stored${db.lastSubmittedAt ? ` · last ${timeAgo(db.lastSubmittedAt)}` : ""}.`
                  : (db?.message || "Unreachable — Apply form will show a retry error if the DB is down.")}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">Storage fallback</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Saved pets are mirrored to localStorage so the Matches page stays usable when the database is unreachable.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Auth & access control</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className={cn("rounded-2xl border p-4", user ? "border-success/30 bg-success/5" : "border-border bg-muted/30")}>
              <div className="flex items-center gap-2">
                {user ? <User className="h-4 w-4 text-success" /> : <User className="h-4 w-4 text-muted-foreground" />}
                <p className="font-medium">Auth status</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {authLoading
                  ? "Checking session…"
                  : user
                    ? `Signed in as ${user.email}. Saved pets & interest notes are bound to your account.`
                    : "Anonymous session — saved pets are kept per browser. Sign in to sync across devices."}
              </p>
            </div>
            <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <p className="font-medium">Saved pets RLS</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {user
                  ? "auth.uid() scope: only your saved pets are readable."
                  : "Anonymous scope: only rows without an owner are readable."}
              </p>
            </div>
            <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-success" />
                <p className="font-medium">Applications RLS</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Insert-only for clients. Raw applicant PII is never readable client-side; the shelter dashboard reads through a redacted RPC (initials only).
              </p>
            </div>
          </div>
          <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <p>Auth provider: <strong className="text-foreground">{user ? ((user.app_metadata?.provider as string) === "google" ? "Google" : "Email & password") : "—"}</strong></p>
            <p>User id present: <strong className="text-foreground">{user ? "yes" : "no"}</strong></p>
            <p>Saved pets mode: <strong className="text-foreground">{user ? "authenticated user" : "anonymous session"}</strong></p>
            <p>Application read mode: <strong className="text-foreground">submitter-only</strong></p>
          </div>
        </section>




        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Security posture</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <p className="font-medium">Legacy demo tables removed</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                <code>user_profiles</code> and <code>application_notes</code> have been dropped.
                <code className="ml-1">profiles</code> (auth-bound) is the active user table.
              </p>
            </div>
            <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-success" />
                <p className="font-medium">sync_logs locked down</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Public writes/reads revoked. Only server-side edge functions (service_role) can append entries.
              </p>
            </div>
            <div className="rounded-2xl border border-info/30 bg-info/5 p-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-info" />
                <p className="font-medium">Advisory linter notes (intentional)</p>
              </div>
              <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground space-y-1">
                <li><code>sync_logs</code> has RLS enabled with no policies — by design; only service_role writes.</li>
                <li>Dashboard RPCs (<code>list_recent_applications_redacted</code>, <code>adoption_applications_health</code>, <code>my_profile_stats</code>) are SECURITY DEFINER and callable only by signed-in users. Returns redacted data only.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Providers</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {statuses.map((s) => (
              <div key={s.id} className={cn("rounded-2xl border p-4", s.ok ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5")}>
                <div className="flex items-center gap-2">
                  {s.ok ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                  <p className="font-medium">{s.label}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.message}</p>
              </div>
            ))}
            <PetfinderWidgetStatus />
          </div>
        </section>

        {stale > 0 && (
          <div className="mt-6 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm">
            <p className="font-medium inline-flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> {stale} listings haven't been updated in 30+ days</p>
            <p className="mt-1 text-muted-foreground">Surface a "verify with shelter" notice on these in Discover.</p>
          </div>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Sync log</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">When</th>
                  <th className="px-4 py-2">Provider</th>
                  <th className="px-4 py-2">Result</th>
                  <th className="px-4 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {log.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No syncs yet — click <strong>Run sync</strong> to record one.</td></tr>
                ) : log.map((l, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-2 text-muted-foreground">{timeAgo(l.ts)}</td>
                    <td className="px-4 py-2">{l.provider}</td>
                    <td className="px-4 py-2">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        l.result === "ok" ? "bg-success/15 text-success" : l.result === "error" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground",
                      )}>{l.result}</span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{l.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-8 text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5" /> PawSwipe never calls third-party APIs from the browser. Secret keys live in server-side env vars.
        </p>
      </div>
    </AppShell>
  );
};

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-grad-card p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold capitalize">{value}</p>
    </div>
  );
}

function PetfinderWidgetStatus() {
  const url = import.meta.env.VITE_PETFINDER_WIDGET_URL as string | undefined;
  const ok = !!url;
  return (
    <div className={cn("rounded-2xl border p-4", ok ? "border-success/30 bg-success/5" : "border-border bg-muted/30")}>
      <div className="flex items-center gap-2">
        {ok ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        <p className="font-medium">Petfinder widget</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {ok ? "Embed URL configured — /live-listings will render the widget." : "Not configured. Set VITE_PETFINDER_WIDGET_URL to enable /live-listings."}
      </p>
    </div>
  );
}

function timeAgo(iso?: string) {
  if (!iso || iso === "—") return "—";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default DataHealth;
