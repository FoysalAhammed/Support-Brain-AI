"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/layout/stat-card";
import { AreaChart, BarChart, DonutChart, HorizontalBars, Legend } from "@/components/charts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { analyticsService } from "@/services/analytics";
import { cn, formatNumber } from "@/lib/utils";
import type { AnalyticsOverview, DateRangeKey, Metric } from "@/types/analytics";

const ranges: { key: DateRangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
];

function metricValue(metric: Metric) {
  if (metric.unit === "percent") return `${metric.value}%`;
  if (metric.unit === "seconds") return `${metric.value}s`;
  if (metric.id === "csat") return `${metric.value} / 5`;
  return formatNumber(metric.value);
}

export function AnalyticsView() {
  const [range, setRange] = React.useState<DateRangeKey>("30d");
  const [data, setData] = React.useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    analyticsService.getOverview(range).then((result) => {
      if (!mounted) return;
      setData(result);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Performance across conversations, channels and knowledge.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {ranges.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setRange(item.key)}
              aria-pressed={range === item.key}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                range === item.key
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {data.metrics.map((metric) => (
              <StatCard
                key={metric.id}
                label={metric.label}
                value={metricValue(metric)}
                change={metric.change}
                trend={metric.trend}
                hint={metric.hint}
                spark={metric.spark}
              />
            ))}
          </div>

          <Card>
            <div className="border-b border-border px-5 py-4">
              <p className="text-sm font-semibold">Conversations over time</p>
              <p className="text-xs text-muted-foreground">
                Volume for the selected range
              </p>
            </div>
            <div className="p-5">
              <AreaChart data={data.conversationsOverTime} showSecondary />
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold">AI vs human resolution</p>
              </div>
              <div className="flex flex-col items-center gap-5 p-5">
                <DonutChart data={data.aiVsHuman} size={160} thickness={16} />
                <Legend data={data.aiVsHuman} className="w-full" />
              </div>
            </Card>

            <Card>
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold">Channel usage</p>
              </div>
              <div className="space-y-4 p-5">
                <HorizontalBars data={data.channelUsage} />
              </div>
            </Card>

            <Card>
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold">Customer satisfaction</p>
              </div>
              <div className="flex flex-col items-center gap-5 p-5">
                <DonutChart
                  data={data.satisfaction}
                  size={160}
                  thickness={16}
                  centerValue="4.7"
                  centerLabel="avg rating"
                />
                <Legend data={data.satisfaction} className="w-full" />
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold">Response time</p>
                <p className="text-xs text-muted-foreground">Seconds to first AI reply</p>
              </div>
              <div className="p-5">
                <BarChart data={data.responseTime} color="var(--chart-2)" />
              </div>
            </Card>

            <Card>
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold">Knowledge usage</p>
                <p className="text-xs text-muted-foreground">Retrievals by source page</p>
              </div>
              <div className="p-5">
                <HorizontalBars data={data.knowledgeUsage} color="var(--chart-3)" />
              </div>
            </Card>
          </div>

          <Card>
            <div className="border-b border-border px-5 py-4">
              <p className="text-sm font-semibold">Top questions</p>
              <p className="text-xs text-muted-foreground">
                Most common customer questions and AI resolution
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="text-right">Asked</TableHead>
                  <TableHead className="text-right">AI resolved</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topQuestions.map((question) => (
                  <TableRow key={question.question}>
                    <TableCell className="font-medium">{question.question}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(question.count)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(question.resolved)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {Math.round((question.resolved / question.count) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}
