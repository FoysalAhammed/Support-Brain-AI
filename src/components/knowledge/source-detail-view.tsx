"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Database,
  Facebook,
  FileText,
  Globe,
  Layers,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrawlPipeline } from "@/components/knowledge/crawl-pipeline";
import { KnowledgeTestPanel } from "@/components/knowledge/knowledge-test-panel";
import { knowledgeService } from "@/services/knowledge";
import { formatNumber, relativeTime, titleCase } from "@/lib/utils";
import type { CrawlJob } from "@/types/crawler";
import type {
  ExtractedSection,
  KnowledgeActivity,
  KnowledgeSource,
} from "@/types/knowledge";

export function SourceDetailView({
  source,
  job,
  sections,
  activity,
}: {
  source: KnowledgeSource;
  job: CrawlJob;
  sections: ExtractedSection[];
  activity: KnowledgeActivity[];
}) {
  const [syncing, setSyncing] = React.useState(false);
  const [syncedAt, setSyncedAt] = React.useState(source.lastSyncedAt);

  const Icon =
    source.type === "facebook" ? Facebook : source.type === "document" ? FileText : Globe;

  const sync = async () => {
    setSyncing(true);
    const result = await knowledgeService.syncSource(source.id);
    setSyncing(false);
    if (result) setSyncedAt(result.lastSyncedAt);
    toast.success("Source synced", { description: `${source.name} is up to date.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Icon className="size-6" />
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {source.name}
              </h1>
              <StatusBadge status={source.status} />
            </div>
            <p className="text-sm capitalize text-muted-foreground">
              {source.type === "facebook" ? "Facebook Page" : source.type}
              {source.domain ? ` · ${source.domain}` : ""}
              {source.url ? ` · ${source.url}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={sync} disabled={syncing}>
            <RefreshCw className={syncing ? "animate-spin" : undefined} />
            Sync
          </Button>
          <Button asChild>
            <Link href="/dashboard/agent">
              <Sparkles />
              Configure AI Agent
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<FileText />} label="Pages" value={formatNumber(job.pagesTotal)} />
        <Metric
          icon={<Layers />}
          label="Content blocks"
          value={formatNumber(source.contentBlocks || job.contentBlocks)}
        />
        <Metric icon={<Layers />} label="Chunks" value={formatNumber(source.chunks)} />
        <Metric
          icon={<Database />}
          label="Embeddings"
          value={formatNumber(source.embeddings)}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="chunks">Chunks</TabsTrigger>
          <TabsTrigger value="rag">
            <Sparkles />
            RAG Test
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Card className="p-5">
              <p className="text-sm font-semibold">Processing pipeline</p>
              <p className="mb-4 text-xs text-muted-foreground">
                How this source was collected and indexed.
              </p>
              <CrawlPipeline stages={job.stages} />
            </Card>

            <div className="space-y-6">
              <Card className="p-5">
                <p className="text-sm font-semibold">Source information</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Type" value={titleCase(source.type)} />
                  <Row label="Status" value={titleCase(source.status)} />
                  <Row label="Domain" value={source.domain ?? "—"} />
                  <Row
                    label="Last synced"
                    value={syncedAt ? relativeTime(syncedAt) : "Never"}
                  />
                  <Row label="Created" value={relativeTime(source.createdAt)} />
                  <Row label="Index" value={job.embedding.indexName} mono />
                </dl>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Knowledge processing</p>
                  <Badge variant={job.embedding.indexStatus === "ready" ? "success" : "warning"}>
                    {job.embedding.indexStatus === "ready" ? "Ready" : job.embedding.indexStatus}
                  </Badge>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Embeddings</span>
                      <span className="tabular-nums">
                        {formatNumber(job.embedding.embedded)} /{" "}
                        {formatNumber(job.embedding.total)}
                      </span>
                    </div>
                    <Progress
                      value={(job.embedding.embedded / Math.max(job.embedding.total, 1)) * 100}
                      className="h-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-lg font-semibold tabular-nums">
                        {job.embedding.dimensions}d
                      </p>
                      <p className="text-[0.7rem] text-muted-foreground">Vector size</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-lg font-semibold tabular-nums">
                        {source.coverage}%
                      </p>
                      <p className="text-[0.7rem] text-muted-foreground">Coverage</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Mock extracted content discovered during crawling. In production this
              is the cleaned text sent to chunking and embedding.
            </p>
            {sections.map((section) => (
              <Card key={section.id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{section.heading}</p>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {section.words} words
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {section.text}
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {job.discoveredPages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                  <span className="truncate text-sm font-medium">{page.title}</span>
                </span>
                <span className="shrink-0 font-mono text-[0.7rem] text-muted-foreground">
                  {page.path}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chunks">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <Card className="p-5">
              <p className="text-sm font-semibold">Chunking strategy</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Chunk size</span>
                  <span className="font-medium">512 tokens</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Overlap</span>
                  <span className="font-medium">64 tokens</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total chunks</span>
                  <span className="font-medium tabular-nums">
                    {formatNumber(job.embedding.total)}
                  </span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-xs">
                {["Original content", "Content cleaning", "Text chunking"].map(
                  (step, index) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-[0.7rem] font-semibold text-primary">
                        {index + 1}
                      </span>
                      {step}
                      {index < 2 && <ArrowRight className="ml-auto size-3.5 text-muted-foreground" />}
                    </div>
                  ),
                )}
              </div>
            </Card>

            <div className="space-y-2">
              {job.chunks.slice(0, 8).map((chunk) => (
                <Card key={chunk.id} className="p-3.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">
                      Chunk #{String(chunk.index).padStart(3, "0")} · {chunk.pageTitle}
                    </span>
                    <span className="tabular-nums">{chunk.tokens} tokens</span>
                  </div>
                  <p className="mt-1.5 text-sm">{chunk.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rag">
          <Card className="p-5">
            <p className="text-sm font-semibold">Test your knowledge</p>
            <p className="mb-4 text-xs text-muted-foreground">
              Ask a question and see how retrieval grounds the AI answer.
            </p>
            <KnowledgeTestPanel job={job} sourceId={source.id} />
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-5">
            <ol className="space-y-4">
              {activity.length === 0 && (
                <li className="text-sm text-muted-foreground">No activity recorded yet.</li>
              )}
              {activity.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Clock className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-sm">{item.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {titleCase(item.kind)} · {relativeTime(item.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary [&_svg]:size-4">
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold tabular-nums">{value}</p>
      </div>
    </Card>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`truncate font-medium ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
