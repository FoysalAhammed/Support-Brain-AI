import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BookOpen,
  MessagesSquare,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { AiStatusBadge } from "@/components/ui/status-badge";
import { AreaChart, DonutChart, Legend, HorizontalBars } from "@/components/charts";
import { analyticsService } from "@/services/analytics";
import { conversationService } from "@/services/conversations";
import { knowledgeService } from "@/services/knowledge";
import { formatNumber, initials, relativeTime } from "@/lib/utils";
import type { Metric } from "@/types/analytics";

export const metadata: Metadata = { title: "Overview" };

function metricValue(metric: Metric) {
  if (metric.unit === "percent") return `${metric.value}%`;
  if (metric.unit === "seconds") return `${metric.value}s`;
  if (metric.value >= 1_000_000) return formatNumber(metric.value);
  return formatNumber(metric.value);
}

export default async function DashboardOverviewPage() {
  const [overview, conversations, sources, stats] = await Promise.all([
    analyticsService.getOverview("30d"),
    conversationService.list(),
    knowledgeService.listSources("org_northwind"),
    knowledgeService.getStats(),
  ]);

  const recent = conversations.slice(0, 5);
  const knowledgeUsage = overview.knowledgeUsage.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="How your AI agent is performing across every channel."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/dashboard/analytics">View analytics</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/knowledge">
                <BookOpen />
                Knowledge Base
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Conversations"
          value={formatNumber(12482)}
          change={12.4}
          trend="up"
          hint="vs. previous 30 days"
          icon={<MessagesSquare />}
          spark={[420, 512, 468, 590, 640, 612, 720, 764]}
        />
        <StatCard
          label="AI Resolution Rate"
          value="87.4%"
          change={3.1}
          trend="up"
          hint="resolved without a human"
          icon={<Sparkles />}
          spark={[78, 80, 82, 81, 84, 85, 86, 87.4]}
        />
        <StatCard
          label="Avg. Response Time"
          value="1.8s"
          change={-8.6}
          trend="down"
          hint="first AI response"
          icon={<Timer />}
          spark={[2.9, 2.6, 2.4, 2.3, 2.1, 2.0, 1.9, 1.8]}
        />
        <StatCard
          label="Human Handoff Rate"
          value="12.6%"
          change={-4.2}
          trend="down"
          hint="escalated to an agent"
          icon={<Users />}
          spark={[19, 18, 17, 16, 15, 14, 13, 12.6]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="text-sm font-semibold">Conversations</p>
              <p className="text-xs text-muted-foreground">Daily volume, last 7 days</p>
            </div>
            <Badge variant="success">+12.4%</Badge>
          </div>
          <div className="p-5">
            <AreaChart data={overview.conversationsOverTime} />
          </div>
        </Card>

        <Card>
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">Channel distribution</p>
            <p className="text-xs text-muted-foreground">Where customers reach out</p>
          </div>
          <div className="flex flex-col items-center gap-5 p-5">
            <DonutChart
              data={overview.channelUsage}
              centerLabel="conversations"
              centerValue={formatNumber(
                overview.channelUsage.reduce((sum, item) => sum + item.value, 0),
              )}
            />
            <Legend data={overview.channelUsage} className="w-full" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">AI vs human</p>
            <Badge variant="accent">87.4% AI</Badge>
          </div>
          <div className="flex flex-col items-center gap-5 p-5">
            <DonutChart data={overview.aiVsHuman} size={160} thickness={16} centerValue="87%" centerLabel="resolved by AI" />
            <Legend data={overview.aiVsHuman} className="w-full" />
          </div>
        </Card>

        <Card>
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">Top knowledge topics</p>
            <p className="text-xs text-muted-foreground">Retrievals by source page</p>
          </div>
          <div className="p-5">
            <HorizontalBars data={knowledgeUsage} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">Knowledge health</p>
            <Link
              href="/dashboard/knowledge"
              className="text-xs font-medium text-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="space-y-4 p-5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold tabular-nums">{stats.sources}</p>
                <p className="text-[0.7rem] text-muted-foreground">Sources</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold tabular-nums">
                  {formatNumber(stats.chunks)}
                </p>
                <p className="text-[0.7rem] text-muted-foreground">Chunks</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-semibold tabular-nums">{stats.ready}</p>
                <p className="text-[0.7rem] text-muted-foreground">Ready</p>
              </div>
            </div>
            <div className="space-y-3">
              {sources.map((source) => (
                <div key={source.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium">{source.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {source.coverage}%
                    </span>
                  </div>
                  <Progress value={source.coverage} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">Recent conversations</p>
            <Link
              href="/dashboard/inbox"
              className="text-xs font-medium text-primary hover:underline"
            >
              Open inbox
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((conversation) => (
              <li key={conversation.id}>
                <Link
                  href={`/dashboard/inbox/${conversation.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="size-9">
                    <AvatarFallback>{initials(conversation.customer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {conversation.customer.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {conversation.subject}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <AiStatusBadge handler={conversation.handler} />
                    <span className="text-[0.7rem] text-muted-foreground">
                      {relativeTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">Knowledge sources</p>
            <Link
              href="/dashboard/knowledge"
              className="text-xs font-medium text-primary hover:underline"
            >
              Add knowledge
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {sources.map((source) => (
              <li key={source.id}>
                <Link
                  href={`/dashboard/knowledge/${source.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Bot className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{source.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatNumber(source.chunks)} chunks ·{" "}
                      {source.lastSyncedAt
                        ? `synced ${relativeTime(source.lastSyncedAt)}`
                        : "processing"}
                    </p>
                  </div>
                  <StatusBadge status={source.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="flex flex-col items-start justify-between gap-4 border-primary/25 bg-primary-soft/40 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessagesSquare className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Your AI agent is live</p>
            <p className="text-xs text-muted-foreground">
              Answering customers across website chat and email.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/agent">
            Configure AI Agent
            <ArrowRight />
          </Link>
        </Button>
      </Card>
    </div>
  );
}
