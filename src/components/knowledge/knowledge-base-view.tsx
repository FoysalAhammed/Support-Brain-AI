"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Database,
  Facebook,
  FileText,
  Globe,
  Layers,
  Plus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/components/providers/auth-provider";
import { CRAWL_STAGES } from "@/services/crawler";
import { knowledgeService } from "@/services/knowledge";
import { formatNumber, relativeTime } from "@/lib/utils";
import type { CrawlJob } from "@/types/crawler";
import type { KnowledgeSource } from "@/types/knowledge";
import { AddKnowledgeDialog } from "./add-knowledge-dialog";
import { SourceDetailSheet } from "./source-detail-sheet";

export function KnowledgeBaseView() {
  const { organization } = useAuth();
  const [sources, setSources] = React.useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [addOpen, setAddOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<KnowledgeSource | null>(null);
  const [jobs, setJobs] = React.useState<Record<string, CrawlJob>>({});

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    knowledgeService.listSources(organization.id).then((result) => {
      if (!mounted) return;
      setSources(result);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [organization.id]);

  const totals = React.useMemo(
    () => ({
      pages: sources.reduce((sum, source) => sum + source.pages, 0),
      chunks: sources.reduce((sum, source) => sum + source.chunks, 0),
      embeddings: sources.reduce((sum, source) => sum + source.embeddings, 0),
    }),
    [sources],
  );

  const openDetail = (source: KnowledgeSource) => {
    setSelected(source);
    setDetailOpen(true);
  };

  const handleComplete = (source: KnowledgeSource, job: CrawlJob) => {
    setJobs((current) => ({ ...current, [source.id]: job }));
    setSources((current) => [source, ...current]);
    toast.success("Knowledge source ready", {
      description: `${source.name} · ${formatNumber(job.embedding.total)} chunks indexed`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        description="Connect a website or Facebook Page. SupportBrain collects the content, creates embeddings and indexes it so your AI agent answers with your business knowledge."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus />
            Add Knowledge
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium">Ingestion pipeline</span>
          <Badge variant="neutral" className="ml-auto hidden sm:inline-flex">
            Source → Crawl → Chunk → Embed → Index → RAG
          </Badge>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin px-5 py-4">
          {CRAWL_STAGES.map((stage, index) => (
            <React.Fragment key={stage.stage}>
              <span className="shrink-0 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium">
                {stage.label}
              </span>
              {index < CRAWL_STAGES.length - 1 && (
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/60" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sources" value={sources.length} icon={<BookOpen />} hint="Websites, Pages & documents" />
        <StatCard label="Pages indexed" value={formatNumber(totals.pages)} icon={<FileText />} hint="Across all connected sources" />
        <StatCard label="Chunks" value={formatNumber(totals.chunks)} icon={<Layers />} hint="Retrievable passages" />
        <StatCard label="Embeddings" value={formatNumber(totals.embeddings)} icon={<Database />} hint="1536-dimension vectors" />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-52 w-full" />
          ))}
        </div>
      ) : sources.length === 0 ? (
        <EmptyState
          icon={<BookOpen />}
          title="No knowledge sources yet"
          description="Add your first website or Facebook Page to give your AI agent the business knowledge it needs to answer customers."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus />
              Add Knowledge
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sources.map((source) => {
            const Icon =
              source.type === "facebook"
                ? Facebook
                : source.type === "document"
                  ? FileText
                  : Globe;
            return (
              <Card key={source.id} className="flex flex-col gap-4 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{source.name}</p>
                    <p className="truncate text-xs capitalize text-muted-foreground">
                      {source.type === "facebook" ? "Facebook Page" : source.type}
                      {source.domain ? ` · ${source.domain}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={source.status} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Metric label="Pages" value={formatNumber(source.pages)} />
                  <Metric label="Chunks" value={formatNumber(source.chunks)} />
                  <Metric label="Embeddings" value={formatNumber(source.embeddings)} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Coverage</span>
                    <span className="tabular-nums">{source.coverage}%</span>
                  </div>
                  <Progress value={source.coverage} className="h-1.5" />
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">
                    {source.lastSyncedAt
                      ? `Synced ${relativeTime(source.lastSyncedAt)}`
                      : "Processing…"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {source.status === "ready" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetail(source)}
                      >
                        <Sparkles />
                        Test
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/knowledge/${source.id}`}>Open</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddKnowledgeDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        organizationId={organization.id}
        onComplete={handleComplete}
      />

      <SourceDetailSheet
        source={selected}
        job={selected ? jobs[selected.id] : undefined}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <p className="text-[0.7rem] text-muted-foreground">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}
