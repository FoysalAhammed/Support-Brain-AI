import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/charts";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  trend = "flat",
  hint,
  icon,
  spark,
  className,
}: {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "flat";
  hint?: string;
  icon?: ReactNode;
  spark?: number[];
  className?: string;
}) {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const positive =
    trend === "flat" ? "text-muted-foreground" : trend === "up" ? "text-success" : "text-destructive";

  return (
    <Card className={cn("flex flex-col gap-3 p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon && <span className="text-primary [&_svg]:size-4">{icon}</span>}
          <span>{label}</span>
        </div>
        {change !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-semibold tabular-nums",
              positive,
            )}
          >
            <TrendIcon className="size-3" />
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {spark && spark.length > 1 && (
          <Sparkline
            values={spark}
            positive={trend !== "down"}
            className="h-8 w-20 opacity-80"
          />
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
