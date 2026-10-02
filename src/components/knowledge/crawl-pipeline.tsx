"use client";

import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { CrawlStageState } from "@/types/crawler";

export function CrawlPipeline({
  stages,
  className,
}: {
  stages: CrawlStageState[];
  className?: string;
}) {
  return (
    <ol className={cn("space-y-1", className)}>
      {stages.map((stage, index) => {
        const done = stage.status === "completed";
        const active = stage.status === "processing";
        const failed = stage.status === "failed";
        const Icon = done ? CheckCircle2 : failed ? XCircle : active ? Loader2 : Circle;
        const last = index === stages.length - 1;

        return (
          <li key={stage.stage} className="relative flex gap-3 pb-1">
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[1.17rem] top-8 h-[calc(100%-0.5rem)] w-px",
                  done ? "bg-primary/40" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card [&_svg]:size-4",
                done && "border-primary/30 bg-primary-soft text-primary",
                active && "border-primary/40 text-primary",
                failed && "border-destructive/30 bg-destructive-soft text-destructive",
                !done && !active && !failed && "border-border text-muted-foreground/60",
              )}
            >
              <Icon className={cn(active && "animate-spin")} />
            </span>

            <div className="min-w-0 flex-1 rounded-lg px-2 py-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !done && !active && "text-muted-foreground",
                  )}
                >
                  {stage.label}
                </span>
                {done && stage.detail ? (
                  <span className="font-mono text-[0.7rem] text-muted-foreground">
                    {stage.detail}
                  </span>
                ) : active ? (
                  <span className="text-xs font-medium text-primary">
                    {stage.progress}%
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">{stage.description}</p>
              {active && <Progress value={stage.progress} className="mt-2 h-1.5" />}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
