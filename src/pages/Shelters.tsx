import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { SHELTERS } from "@/lib/mockData";
import { ShelterCard } from "@/components/shelter/ShelterCard";
import { cn } from "@/lib/utils";

const cities = ["All", "Vancouver", "North Vancouver", "Burnaby", "Richmond", "Coquitlam"];

const Shelters = () => {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");

  const filtered = useMemo(() =>
    SHELTERS.filter((s) =>
      (city === "All" || s.city === city) &&
      (q === "" || s.name.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase())),
    ), [q, city]);

  return (
    <AppShell>
      <div className="container max-w-6xl py-8 md:py-12">
        <p className="text-sm font-medium uppercase tracking-wider text-info">Local rescues</p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold tracking-tight">Shelter directory</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Shelters and rescues listed across Vancouver and the Lower Mainland. PawSwipe is an independent discovery platform — no official partnerships implied. Confirm details with each shelter directly.
        </p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 rounded-full" placeholder="Search shelters" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors",
                  city === c ? "border-primary bg-primary-soft text-primary" : "border-border bg-card hover:border-primary/40",
                )}
              >{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => <ShelterCard key={s.id} shelter={s} />)}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">No shelters match that search.</p>
        )}
      </div>
    </AppShell>
  );
};

export default Shelters;
