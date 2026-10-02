"use client";

import type { ElementType } from "react";
import {
  Bike,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/conversation";

type Tone = "default" | "neutral" | "accent" | "success" | "warning" | "danger";

export const ORDER_STATUSES: OrderStatus[] = [
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
];

export const orderStatusMeta: Record<
  OrderStatus,
  { label: string; tone: Tone; icon: ElementType; dot: string }
> = {
  processing: { label: "Processing", tone: "default", icon: ClipboardList, dot: "bg-primary" },
  packed: { label: "Packed", tone: "accent", icon: PackageCheck, dot: "bg-accent" },
  shipped: { label: "Shipped", tone: "default", icon: Truck, dot: "bg-primary" },
  out_for_delivery: { label: "Out for delivery", tone: "warning", icon: Bike, dot: "bg-warning" },
  delivered: { label: "Delivered", tone: "success", icon: CheckCircle2, dot: "bg-success" },
  cancelled: { label: "Cancelled", tone: "danger", icon: XCircle, dot: "bg-destructive" },
  refunded: { label: "Refunded", tone: "neutral", icon: RotateCcw, dot: "bg-muted-foreground" },
};

export function OrderStatusBadge({
  status,
  className,
  withLabel = true,
}: {
  status: OrderStatus;
  className?: string;
  withLabel?: boolean;
}) {
  const meta = orderStatusMeta[status];
  const Icon = meta.icon;
  return (
    <Badge variant={meta.tone} className={cn("shrink-0", className)} title={meta.label}>
      <Icon className="size-3" />
      {withLabel ? meta.label : <span className="sr-only">{meta.label}</span>}
    </Badge>
  );
}
