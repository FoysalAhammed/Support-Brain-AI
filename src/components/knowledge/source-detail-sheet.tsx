"use client";

import * as React from "react";
import {
  Database,
  Facebook,
  FileText,
  Globe,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { crawlerService } from "@/services/crawler";
import { formatNumber, relativeTime } from "@/lib/utils";
import type { CrawlJob } from "@/types/crawler";
import type { KnowledgeSource } from "@/types/knowledge";
import { CrawlPipeline } from "./crawl-pipeline";
import { KnowledgeTestPanel } from "./knowledge-test-panel";

export function SourceDetailSheet({
  source,
  job: providedJob,
  open,
  onOpenChange,
}: {
  source: KnowledgeSource | null;
  job?: CrawlJob;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [job, setJob] = React.useState<CrawlJob | null>(providedJob ?? null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open || !source) return;
    if (providedJob) {
      setJob(providedJob);
      return;
    }
    let mounted = true;
    setLoading(true);
    crawlerService.getSourceDetails(source.id).then((details) => {
      if (!mounted) return;
      setJob(details?.job ?? null);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [open, source, providedJob]);

  const sections = React.useMemo(
    () => (job && source ? crawlerService.contentSections(job, source.id) : []),
    [job, source],
  );

  const Icon = source?.type === "facebook" ? Facebook : source?.type === "document" ? FileText : Globe;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-xl gap-0 p-0">
        <SheetHeader className="p-5">
          <div className="flex items-center gap-2 pr-8">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate">{source?.name}</SheetTitle>
              <SheetDescription className="truncate">
                {source?.type === "facebook" ? "Facebook Page" : source?.type}
                {source?.domain ? ` · ${source.domain}` : ""}
              </SheetDescription>
            </div>
            {source && <StatusBadge status={source.status} />}
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {loading || !job || !source ? (
            <div className="space-y-4">
              <Spinner className="text-primary" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-56 w-full" />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric label="Pages" value={formatNumber(source.pages || job.pagesTotal)} />
                <Metric label="Content blocks" value={formatNumber(source.contentBlocks)} />
                <Metric label="Chunks" value={formatNumber(source.chunks)} />
                <Metric label="Embeddings" value={formatNumber(source.embeddings)} />
              </div>

              <div className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Knowledge coverage</span>
                  <span className="font-medium tabular-nums">{source.coverage}%</span>
                </div>
                <Progress value={source.coverage} className="mt-2 h-1.5" />
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-success" />
                    Index {job.embedding.indexName}
                  </span>
                  <span>{job.embedding.dimensions}d vectors</span>
                  <span>
                    {source.lastSyncedAt
                      ? `Synced ${relativeTime(source.lastSyncedAt)}`
                      : "Never synced"}
                  </span>
                </div>
              </div>

              <Tabs defaultValue="pipeline">
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="chunks">
                    <Layers />
                    Chunks
                  </TabsTrigger>
                  <TabsTrigger value="test">
                    <Sparkles />
                    Test knowledge
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pipeline">
                  <CrawlPipeline stages={job.stages} />
                </TabsContent>

                <TabsContent value="content">
                  <ul className="space-y-3">
                    {sections.map((section) => (
                      <li
                        key={section.id}
                        className="rounded-lg border border-border bg-card p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{section.heading}</span>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {section.words} words
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {section.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="chunks">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral">
                        <Database className="size-3" />
                        {formatNumber(job.embedding.total)} vectors
                      </Badge>
                      <Badge variant={job.embedding.indexStatus === "ready" ? "success" : "warning"}>
                        Index {job.embedding.indexStatus}
                      </Badge>
                    </div>
                    <ul className="space-y-2">
                      {job.chunks.slice(0, 8).map((chunk) => (
                        <li
                          key={chunk.id}
                          className="rounded-lg border border-border bg-card p-3"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">
                              #{chunk.index} · {chunk.pageTitle}
                            </span>
                            <span className="tabular-nums">{chunk.tokens} tokens</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs">{chunk.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="test">
                  <KnowledgeTestPanel job={job} sourceId={source.id} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
