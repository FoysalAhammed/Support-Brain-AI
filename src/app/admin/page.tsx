import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Building2, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AreaChart, BarChart, DonutChart, Legend } from "@/components/charts";
import { analyticsService } from "@/services/analytics";
import { formatNumber } from "@/lib/utils";
import type { Metric } from "@/types/analytics";

export const metadata: Metadata = { title: "Platform Overview" };

function metricValue(metric: Metric) {
  if (metric.unit === "percent") return `${metric.value}%`;
  if (metric.value >= 1_000_000) return formatNumber(metric.value);
  return formatNumber(metric.value);
}

export default async function AdminOverviewPage() {
  const [overview, organizations] = await Promise.all([
    analyticsService.getAdminOverview(),
    analyticsService.listOrganizations(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Overview"
        description="Tenant health, usage and system status across SupportBrain AI."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/organizations">
              <Building2 />
              Organizations
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {overview.metrics.map((metric) => (
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">AI usage by day</p>
            <p className="text-xs text-muted-foreground">Messages processed platform-wide</p>
          </div>
          <div className="p-5">
            <AreaChart data={overview.usageByDay} color="var(--chart-3)" />
          </div>
        </Card>

        <Card>
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">Plan distribution</p>
          </div>
          <div className="flex flex-col items-center gap-5 p-5">
            <DonutChart
              data={overview.planDistribution}
              size={160}
              thickness={16}
              centerValue={formatNumber(organizations.length)}
              centerLabel="tenants"
            />
            <Legend data={overview.planDistribution} className="w-full" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">New signups</p>
            <p className="text-xs text-muted-foreground">Organizations per week</p>
          </div>
          <div className="p-5">
            <BarChart data={overview.signups} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Activity className="size-4 text-primary" />
            <p className="text-sm font-semibold">System health</p>
          </div>
          <ul className="divide-y divide-border">
            {overview.systemHealth.map((service) => (
              <li
                key={service.service}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{service.service}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.uptime}% uptime · {service.latencyMs} ms
                  </p>
                </div>
                <StatusBadge status={service.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-sm font-semibold">Recent organizations</p>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/organizations">View all</Link>
          </Button>
        </div>
        <ul className="divide-y divide-border">
          {organizations.slice(0, 6).map((organization) => (
            <li key={organization.id}>
              <Link
                href={`/admin/organizations/${organization.id}`}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Building2 className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{organization.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {organization.industry} · {organization.country}
                  </p>
                </div>
                <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" />
                    {organization.activeUserCount}
                  </span>
                  <span className="tabular-nums">
                    {formatNumber(organization.conversationCount)} conv.
                  </span>
                </div>
                <Badge variant="default" className="capitalize">
                  {organization.plan}
                </Badge>
                <StatusBadge status={organization.status} />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex items-center gap-3 border-primary/25 bg-primary-soft/40 p-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">Platform administration</p>
          <p className="text-xs text-muted-foreground">
            Manage tenants, subscriptions and platform health from the admin console.
          </p>
        </div>
      </Card>
    </div>
  );
}
