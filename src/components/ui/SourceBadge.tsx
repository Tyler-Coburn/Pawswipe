import { Database, Globe, Building2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DataSource } from "@/lib/types";

const MAP: Record<DataSource, { label: string; Icon: typeof Database; cls: string }> = {
  mock: { label: "Demo listing", Icon: Sparkles, cls: "bg-muted text-muted-foreground" },
  rescuegroups: { label: "Synced · RescueGroups", Icon: Globe, cls: "bg-info/15 text-info" },
  petfinder: { label: "Synced · Petfinder", Icon: Globe, cls: "bg-info/15 text-info" },
  "shelter-direct": { label: "Shelter direct", Icon: Building2, cls: "bg-primary-soft text-primary" },
};

export function SourceBadge({ source, className }: { source?: DataSource; className?: string }) {
  const cfg = MAP[source ?? "mock"];
  const Icon = cfg.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
        cfg.cls,
        className,
      )}
    >
      <Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
}
