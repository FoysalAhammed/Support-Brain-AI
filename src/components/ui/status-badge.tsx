import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Loader2,
  PauseCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "default" | "accent" | "success" | "warning" | "danger";

const map: Record<
  string,
  { label: string; variant: Tone; Icon: React.ElementType; spin?: boolean }
> = {
  ready: { label: "Ready", variant: "success", Icon: CheckCircle2 },
  connected: { label: "Connected", variant: "success", Icon: CheckCircle2 },
  active: { label: "Active", variant: "success", Icon: CheckCircle2 },
  operational: { label: "Operational", variant: "success", Icon: CheckCircle2 },
  paid: { label: "Paid", variant: "success", Icon: CheckCircle2 },
  resolved: { label: "Resolved", variant: "success", Icon: CheckCircle2 },
  open: { label: "Open", variant: "default", Icon: CircleDashed },
  trialing: { label: "Trialing", variant: "accent", Icon: RefreshCw },
  queued: { label: "Queued", variant: "neutral", Icon: CircleDashed },
  pending: { label: "Pending", variant: "warning", Icon: CircleDashed },
  invited: { label: "Invited", variant: "warning", Icon: CircleDashed },
  processing: { label: "Processing", variant: "warning", Icon: Loader2, spin: true },
  syncing: { label: "Syncing", variant: "warning", Icon: Loader2, spin: true },
  building: { label: "Building", variant: "warning", Icon: Loader2, spin: true },
  degraded: { label: "Degraded", variant: "warning", Icon: AlertTriangle },
  available: { label: "Available", variant: "neutral", Icon: CircleDashed },
  snoozed: { label: "Snoozed", variant: "neutral", Icon: PauseCircle },
  paused: { label: "Paused", variant: "neutral", Icon: PauseCircle },
  deactivated: { label: "Deactivated", variant: "neutral", Icon: PauseCircle },
  disconnected: { label: "Not connected", variant: "neutral", Icon: XCircle },
  failed: { label: "Failed", variant: "danger", Icon: XCircle },
  suspended: { label: "Suspended", variant: "danger", Icon: XCircle },
  down: { label: "Down", variant: "danger", Icon: XCircle },
  refunded: { label: "Refunded", variant: "neutral", Icon: RefreshCw },
};

export function StatusBadge({
  status,
  className,
  label,
}: {
  status: string;
  className?: string;
  label?: string;
}) {
  const entry = map[status] ?? {
    label: status,
    variant: "neutral" as Tone,
    Icon: CircleDashed,
  };
  const { Icon } = entry;
  return (
    <Badge variant={entry.variant} className={cn("capitalize", className)}>
      <Icon className={cn("size-3", entry.spin && "animate-spin")} />
      {label ?? entry.label}
    </Badge>
  );
}

export function AiStatusBadge({ handler }: { handler: "ai" | "human" }) {
  return handler === "ai" ? (
    <Badge variant="accent">
      <span className="size-1.5 rounded-full bg-accent" />
      AI
    </Badge>
  ) : (
    <Badge variant="default">
      <span className="size-1.5 rounded-full bg-primary" />
      Human
    </Badge>
  );
}
