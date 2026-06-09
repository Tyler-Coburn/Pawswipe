import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, PauseCircle, Heart } from "lucide-react";
import type { PetStatus } from "@/lib/types";

interface Props {
  status: PetStatus;
  className?: string;
}

const map: Record<PetStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  available: { label: "Available", cls: "bg-success/10 text-success", Icon: CheckCircle2 },
  pending: { label: "Application pending", cls: "bg-warning/15 text-warning", Icon: Clock },
  "on-hold": { label: "On hold", cls: "bg-info/15 text-info", Icon: PauseCircle },
  adopted: { label: "Adopted", cls: "bg-accent/15 text-accent", Icon: Heart },
};

export function StatusBadge({ status, className }: Props) {
  const { label, cls, Icon } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        cls,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
