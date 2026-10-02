"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Facebook,
  FileText,
  Globe,
  Layers,
  Link2,
  Plus,
  Radar,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { crawlerService } from "@/services/crawler";
import { knowledgeService } from "@/services/knowledge";
import { cn, formatNumber } from "@/lib/utils";
import type { CrawlJob } from "@/types/crawler";
import type { KnowledgeSource, KnowledgeSourceType } from "@/types/knowledge";
import { CrawlPipeline } from "./crawl-pipeline";
import { KnowledgeTestPanel } from "./knowledge-test-panel";

type Step = "form" | "processing" | "ready";

const sourceTypes: {
  value: KnowledgeSourceType;
  label: string;
  hint: string;
  placeholder: string;
  Icon: React.ElementType;
}[] = [
  {
    value: "website",
    label: "Website",
    hint: "Crawl a public website and every linked page",
    placeholder: "https://example.com",
    Icon: Globe,
  },
  {
    value: "facebook",
    label: "Facebook Page",
    hint: "Fetch the public content of a business Page",
    placeholder: "https://facebook.com/examplebusiness",
    Icon: Facebook,
  },
];

export function AddKnowledgeDialog({
  open,
  onOpenChange,
  organizationId,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  onComplete: (source: KnowledgeSource, job: CrawlJob) => void;
}) {
  const [type, setType] = React.useState<KnowledgeSourceType>("website");
  const [url, setUrl] = React.useState("");
  const [step, setStep] = React.useState<Step>("form");
  const [job, setJob] = React.useState<CrawlJob | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState("pages");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setType("website");
      setUrl("");
      setStep("form");
      setJob(null);
      setError(null);
      setTab("pages");
      setSaving(false);
    }
  }, [open]);

  const detection = url.trim() ? crawlerService.detectSource(url) : null;
  const active = sourceTypes.find((item) => item.value === type) ?? sourceTypes[0];

  const handleStart = async () => {
    if (!detection?.valid) return;
    setError(null);
    setStep("processing");
    try {
      const result = await crawlerService.runCrawl(url, setJob);
      setJob(result);
      setSaving(true);
      const source = await knowledgeService.createSource({
        name: result.sourceName,
        type: result.type,
        url: result.url,
        domain: result.domain,
        pages: result.pagesTotal,
        contentBlocks: result.contentBlocks,
        chunks: result.embedding.total,
        organizationId,
      });
      setSaving(false);
      onComplete(source, result);
      setStep("ready");
      setTab("pages");
    } catch (cause) {
      setSaving(false);
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
      setStep("form");
    }
  };

  const sections = React.useMemo(
    () => (job ? crawlerService.contentSections(job) : []),
    [job],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radar className="size-4 text-primary" />
            Add Knowledge
          </DialogTitle>
          <DialogDescription>
            Connect a website or Facebook Page. SupportBrain crawls it, chunks the
            content, generates embeddings and indexes it for AI answers.
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-5">
            <div className="grid gap-2 sm:grid-cols-2">
              {sourceTypes.map((item) => {
                const Icon = item.Icon;
                const selected = type === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setType(item.value);
                      setUrl("");
                    }}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                      selected
                        ? "border-primary/40 bg-primary-soft"
                        : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {item.hint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge-url">
                {type === "facebook" ? "Facebook Page URL" : "Website URL"}
              </Label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="knowledge-url"
                  value={url}
                  autoFocus
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder={active.placeholder}
                  className="pl-9"
                  inputMode="url"
                />
              </div>
            </div>

            {detection && (
              <div
                className={cn(
                  "space-y-3 rounded-xl border p-4 animate-[fade-up_0.25s_ease-out]",
                  detection.valid
                    ? "border-success/30 bg-success-soft/50"
                    : "border-destructive/30 bg-destructive-soft/50",
                )}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  {detection.valid ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : (
                    <XCircle className="size-4 text-destructive" />
                  )}
                  {detection.valid ? "Valid URL" : "Invalid URL"}
                  {detection.valid && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-success">
                        {detection.type === "facebook"
                          ? "Facebook Page detected"
                          : "Website detected"}
                      </span>
                    </>
                  )}
                </div>

                {detection.valid ? (
                  <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {detection.type === "facebook" ? "Page" : "Domain"}
                      </dt>
                      <dd className="truncate font-medium">{detection.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Source type</dt>
                      <dd className="font-medium capitalize">{detection.type}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {detection.type === "facebook" ? "Sections" : "Pages found"}
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {detection.estimatedPages}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Est. chunks</dt>
                      <dd className="font-medium tabular-nums">
                        ~{formatNumber(detection.estimatedChunks)}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm text-destructive">{detection.message}</p>
                )}

                {detection.valid && detection.type === "facebook" && (
                  <p className="text-xs text-muted-foreground">
                    Only publicly available Page content is fetched. No login,
                    access token or credentials are ever required.
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="size-4" />
                {error}
              </p>
            )}
          </div>
        )}

        {step === "processing" && job && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
              <Spinner className="size-5 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  Collecting knowledge from {job.domain}
                </p>
                <p className="text-xs text-muted-foreground">
                  Simulated pipeline · no backend required
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-primary">
                {job.progress}%
              </span>
            </div>

            <Progress value={job.progress} className="h-1.5" />

            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <CrawlPipeline stages={job.stages} />

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Counter
                    label="Pages"
                    value={`${job.pagesCrawled}/${job.pagesTotal}`}
                    icon={<FileText />}
                  />
                  <Counter
                    label="Content blocks"
                    value={formatNumber(job.contentBlocks)}
                    icon={<Layers />}
                  />
                  <Counter
                    label="Chunks"
                    value={formatNumber(job.embedding.total)}
                    icon={<Layers />}
                  />
                  <Counter
                    label="Embeddings"
                    value={formatNumber(job.embedding.embedded)}
                    icon={<Database />}
                  />
                </div>

                <div className="rounded-xl border border-border bg-card p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vector index</span>
                    <Badge variant={job.embedding.indexStatus === "ready" ? "success" : "warning"}>
                      {job.embedding.indexStatus === "ready" ? "Ready" : "Building"}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1 font-mono text-[0.7rem] text-muted-foreground">
                    <p className="truncate">{job.embedding.indexName}</p>
                    <p>
                      {job.embedding.dimensions}d · {formatNumber(job.embedding.vectorsPerSecond)} vec/s
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "ready" && job && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft/50 p-4">
              <CheckCircle2 className="mt-0.5 size-5 text-success" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Knowledge ready</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(job.embedding.total)} chunks embedded and indexed.
                  Your AI agent can now answer questions from this source.
                </p>
              </div>
              {saving && <Spinner className="text-muted-foreground" />}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <Stat label="Pages" value={formatNumber(job.pagesTotal)} />
              <Stat label="Content blocks" value={formatNumber(job.contentBlocks)} />
              <Stat label="Chunks" value={formatNumber(job.embedding.total)} />
              <Stat label="Embeddings" value={formatNumber(job.embedding.total)} />
              <Stat label="Vector index" value="Ready" tone="success" />
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="pages">Discovered pages</TabsTrigger>
                <TabsTrigger value="content">Content preview</TabsTrigger>
                <TabsTrigger value="chunks">Chunks & embeddings</TabsTrigger>
                <TabsTrigger value="test">
                  <Sparkles />
                  Test knowledge
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pages">
                <div className="grid gap-2 sm:grid-cols-2">
                  {job.discoveredPages.map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                        <span className="truncate text-sm font-medium">
                          {page.title}
                        </span>
                        <span className="truncate font-mono text-[0.7rem] text-muted-foreground">
                          {page.path}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {page.blocks} blocks
                      </span>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="text-muted-foreground">Chunk size</p>
                      <p className="font-medium">512 tokens</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="text-muted-foreground">Overlap</p>
                      <p className="font-medium">64 tokens</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="text-muted-foreground">Embedding model</p>
                      <p className="font-medium">
                        text-embedding · {job.embedding.dimensions}d
                      </p>
                    </div>
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
                <KnowledgeTestPanel job={job} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter>
          {step === "form" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleStart} disabled={!detection?.valid}>
                {type === "facebook" ? "Start collection" : "Start crawling"}
              </Button>
            </>
          )}
          {step === "processing" && (
            <Button variant="outline" disabled>
              <Spinner />
              Processing…
            </Button>
          )}
          {step === "ready" && (
            <Button onClick={() => onOpenChange(false)}>
              <Plus />
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Counter({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="text-primary [&_svg]:size-3.5">{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-lg font-semibold tabular-nums",
          tone === "success" && "text-success",
        )}
      >
        {value}
      </p>
    </div>
  );
}
