import { useEffect, useState } from "react";
import { AlertTriangle, Building2, Eye, Flame, Heart, Inbox, MoreHorizontal, Pencil, Send, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PETS, SHELTERS } from "@/lib/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { listRecentApplicationsRedacted, type RedactedApplication } from "@/lib/api/applications";
import { cn } from "@/lib/utils";

const shelter = SHELTERS[0];
const pets = PETS.filter((p) => p.shelterId === shelter.id).concat(PETS.slice(0, 3));

const apps = [
  { id: "a1", name: "Sarah Chen", petId: "p-mochi", date: "2 days ago", status: "new" as const, contact: "sarah.c@example.com" },
  { id: "a2", name: "Daniel Park", petId: "p-otis", date: "3 days ago", status: "reviewing" as const, contact: "d.park@example.com" },
  { id: "a3", name: "Priya Singh", petId: "p-luna", date: "5 days ago", status: "contacted" as const, contact: "(604) 555-0177" },
  { id: "a4", name: "Marc Tremblay", petId: "p-bear", date: "1 week ago", status: "meet-greet" as const, contact: "marc.t@example.com" },
  { id: "a5", name: "Hannah Lee", petId: "p-ruby", date: "9 days ago", status: "approved" as const, contact: "hannah.l@example.com" },
];

const statusStyles: Record<string, string> = {
  new: "bg-success/15 text-success",
  reviewing: "bg-info/15 text-info",
  contacted: "bg-primary-soft text-primary",
  "meet-greet": "bg-warning/15 text-warning",
  approved: "bg-accent/15 text-accent",
  "not-selected": "bg-muted text-muted-foreground",
};
const statusLabel: Record<string, string> = {
  new: "New", reviewing: "Reviewing", contacted: "Contacted",
  "meet-greet": "Meet & greet", approved: "Approved", "not-selected": "Not selected",
};

const ShelterDashboard = () => {
  const [pawSwipeNotes, setPawSwipeNotes] = useState<RedactedApplication[] | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await listRecentApplicationsRedacted(12);
        if (active) setPawSwipeNotes(rows);
      } catch (e: any) {
        if (active) setNotesError(e?.message ?? "Could not load PawSwipe interest notes.");
      }
    })();
    return () => { active = false; };
  }, []);

  const stats = [
    { label: "Active listings (demo)", value: pets.length, Icon: Building2, tone: "text-primary bg-primary-soft" },
    { label: "PawSwipe interest notes", value: pawSwipeNotes?.length ?? "…", Icon: Inbox, tone: "text-accent bg-accent-soft" },
    { label: "Saved by adopters (demo)", value: 142, Icon: Heart, tone: "text-info bg-info/10" },
    { label: "Synced external listings", value: pets.length, Icon: Building2, tone: "text-info bg-info/10" },
    { label: "Listings needing update", value: pets.filter((p) => (Date.now() - new Date(p.lastUpdated).getTime()) / 86400000 > 30).length, Icon: AlertTriangle, tone: "text-warning bg-warning/10" },
  ];



  return (
    <AppShell>
      <div className="container max-w-6xl py-8 md:py-12">
        <div className="rounded-2xl border border-dashed border-warning/40 bg-warning/5 p-3 text-xs text-muted-foreground mb-4">
          <strong className="text-foreground">Demo dashboard.</strong> Shelter dashboard data is demo-only until shelter accounts and application tables are connected to Lovable Cloud. See <a className="text-primary hover:underline" href="/docs/schema.md" target="_blank" rel="noreferrer">recommended schema</a>.
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Demo shelter profile
            </span>
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">{shelter.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Shelter dashboard · {shelter.city}</p>
          </div>
          <Button className="rounded-full bg-grad-primary shadow-soft"><Send className="mr-1.5 h-4 w-4" /> Add new pet</Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, Icon, tone }) => (
            <div key={label} className="rounded-3xl border border-border bg-grad-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className={cn("grid h-10 w-10 place-items-center rounded-xl", tone)}>
                  <Icon className="h-5 w-5" />
                </span>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Insights */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-grad-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Flame className="h-4 w-4 text-accent" /> Most saved this week
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {pets.slice(0, 3).map((p, i) => (
                <li key={p.id + i} className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{42 - i * 7} saves</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-grad-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" /> Applications needing review
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">3</p>
            <p className="text-xs text-muted-foreground">New applicants waiting on a first reply.</p>
          </div>
          <div className="rounded-3xl border border-warning/30 bg-warning/10 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-warning" /> Listings needing updates
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {pets
                .filter((p) => (Date.now() - new Date(p.lastUpdated).getTime()) / 86400000 > 30)
                .slice(0, 3)
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{p.name}</span>
                    <span className="text-xs text-warning">stale</span>
                  </li>
                ))}
              {pets.filter((p) => (Date.now() - new Date(p.lastUpdated).getTime()) / 86400000 > 30).length === 0 && (
                <li className="text-xs text-muted-foreground">All listings recently updated.</li>
              )}
            </ul>
          </div>
        </section>


        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Animal listings</h2>
          <div className="mt-3 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Pet</th>
                    <th className="text-left px-3 py-3 font-medium">Species</th>
                    <th className="text-left px-3 py-3 font-medium">Status</th>
                    <th className="text-right px-3 py-3 font-medium">Views</th>
                    <th className="text-right px-3 py-3 font-medium">Saves</th>
                    <th className="text-right px-3 py-3 font-medium">Apps</th>
                    <th className="text-left px-3 py-3 font-medium">Updated</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pets.slice(0, 8).map((p, i) => (
                    <tr key={`${p.id}-${i}`} className="border-t border-border hover:bg-muted/40">
                      <td className="px-5 py-3 font-medium">{p.name} <span className="text-muted-foreground font-normal">· {p.breed}</span></td>
                      <td className="px-3 py-3 capitalize">{p.species}</td>
                      <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-3 py-3 text-right tabular-nums">{120 + i * 37}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{8 + i * 3}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{1 + (i % 4)}</td>
                      <td className="px-3 py-3 text-muted-foreground">{(i + 1)}d ago</td>
                      <td className="px-5 py-3 text-right">
                        <Button size="sm" variant="ghost" className="rounded-full"><Pencil className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Adoption applications</h2>
          <div className="mt-3 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Applicant</th>
                    <th className="text-left px-3 py-3 font-medium">Pet</th>
                    <th className="text-left px-3 py-3 font-medium">Submitted</th>
                    <th className="text-left px-3 py-3 font-medium">Status</th>
                    <th className="text-left px-3 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => {
                    const pet = PETS.find((p) => p.id === a.petId);
                    return (
                      <tr key={a.id} className="border-t border-border hover:bg-muted/40">
                        <td className="px-5 py-3 font-medium">{a.name}</td>
                        <td className="px-3 py-3">{pet?.name ?? "—"}</td>
                        <td className="px-3 py-3 text-muted-foreground">{a.date}</td>
                        <td className="px-3 py-3">
                          <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[a.status])}>
                            {statusLabel[a.status]}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">{a.contact}</td>
                        <td className="px-5 py-3 text-right">
                          <Button size="sm" variant="outline" className="rounded-full"><Eye className="mr-1 h-3.5 w-3.5" /> View</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">PawSwipe interest notes</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Live submissions from the PawSwipe Apply form. These are <strong>interest notes</strong>, not official shelter applications — applicant contact details are kept private until shelter accounts are wired up.
              </p>
            </div>
          </div>
          <div className="mt-3 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Applicant</th>
                    <th className="text-left px-3 py-3 font-medium">Pet</th>
                    <th className="text-left px-3 py-3 font-medium">Shelter</th>
                    <th className="text-left px-3 py-3 font-medium">City</th>
                    <th className="text-left px-3 py-3 font-medium">Source</th>
                    <th className="text-left px-3 py-3 font-medium">Status</th>
                    <th className="text-left px-3 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {pawSwipeNotes === null && !notesError && (
                    <tr><td colSpan={7} className="px-5 py-4"><Skeleton className="h-6 w-full" /></td></tr>
                  )}
                  {notesError && (
                    <tr><td colSpan={7} className="px-5 py-6 text-center text-sm text-muted-foreground">{notesError}</td></tr>
                  )}
                  {pawSwipeNotes && pawSwipeNotes.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-6 text-center text-sm text-muted-foreground">No PawSwipe interest notes yet — submissions from the Apply page show up here.</td></tr>
                  )}
                  {pawSwipeNotes?.map((n) => (
                    <tr key={n.id} className="border-t border-border hover:bg-muted/40">
                      <td className="px-5 py-3 font-medium">{n.applicant_initials}</td>
                      <td className="px-3 py-3">{n.pet_name ?? "—"}</td>
                      <td className="px-3 py-3 text-muted-foreground">{n.shelter_name ?? "—"}</td>
                      <td className="px-3 py-3 text-muted-foreground">{n.city ?? "—"}</td>
                      <td className="px-3 py-3"><SourceBadge source={n.is_synced_listing ? "rescuegroups" : "shelter-direct"} /></td>
                      <td className="px-3 py-3">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[n.status] ?? statusStyles.new)}>
                          {statusLabel[n.status] ?? n.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p className="mt-8 text-xs text-muted-foreground">
          Listings, demo applications, and dashboard stats are placeholder data. PawSwipe interest notes above are live. Final adoption decisions are made by the shelter.
        </p>
      </div>
    </AppShell>
  );
};

export default ShelterDashboard;
