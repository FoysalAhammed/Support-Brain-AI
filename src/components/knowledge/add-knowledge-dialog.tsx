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
  Server,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { crawlerService } from "@/services/crawler";
import { knowledgeService } from "@/services/knowledge";
import { cn, formatNumber } from "@/lib/utils";
import { sourceTypeMeta } from "@/lib/source-meta";
import type { CrawlJob, DatabaseConfig } from "@/types/crawler";
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
  {
    value: "document",
    label: "Document",
    hint: "Upload PDFs, manuals and policy documents",
    placeholder: "",
    Icon: FileText,
  },
  {
    value: "database",
    label: "Database",
    hint: "Connect a read-only database for RAG",
    placeholder: "",
    Icon: Database,
  },
];

const enginePorts: Record<DatabaseConfig["engine"], string> = {
  postgresql: "5432",
  mysql: "3306",
  mongodb: "27017",
  supabase: "5432",
};

const defaultDb: DatabaseConfig = {
  engine: "postgresql",
  host: "db.northwind.internal",
  port: "5432",
  database: "northwind",
  username: "readonly",
  password: "",
  ssl: true,
};

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
  const [files, setFiles] = React.useState<{ name: string; sizeKb: number }[]>([]);
  const [db, setDb] = React.useState<DatabaseConfig>(defaultDb);
  const [dbTested, setDbTested] = React.useState(false);
  const [dbTables, setDbTables] = React.useState<{ name: string; rows: number }[]>([]);
  const [testing, setTesting] = React.useState(false);
  const [step, setStep] = React.useState<Step>("form");
  const [job, setJob] = React.useState<CrawlJob | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState("pages");
  const [saving, setSaving] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setType("website");
      setUrl("");
      setFiles([]);
      setDb(defaultDb);
      setDbTested(false);
      setDbTables([]);
      setTesting(false);
      setStep("form");
      setJob(null);
      setError(null);
      setTab("pages");
      setSaving(false);
    }
  }, [open]);

  const detection = React.useMemo(() => {
    if (type === "website" || type === "facebook") {
      return url.trim() ? crawlerService.detectSource(url) : null;
    }
    if (type === "document") {
      return files.length ? crawlerService.detectDocument(files) : null;
    }
    return dbTested ? crawlerService.detectDatabase(db) : null;
  }, [type, url, files, db, dbTested]);

  const active = sourceTypes.find((item) => item.value === type) ?? sourceTypes[0];
  const jobMeta = job ? sourceTypeMeta[job.type] : sourceTypeMeta.website;

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next = Array.from(list).map((file) => ({
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
    }));
    setFiles((current) => [...current, ...next]);
  };

  const updateDb = (patch: Partial<DatabaseConfig>) => {
    setDb((current) => ({ ...current, ...patch }));
    setDbTested(false);
  };

  const testConnection = async () => {
    setTesting(true);
    const result = await crawlerService.testDatabase(db);
    setTesting(false);
    if (result.ok) {
      setDbTested(true);
      setDbTables(result.tables);
      toast.success(result.message);
    } else {
      setDbTested(false);
      setDbTables([]);
      toast.error(result.message);
    }
  };

  const handleStart = async () => {
    if (!detection?.valid) return;
    setError(null);
    setStep("processing");
    try {
      const result =
        type === "website" || type === "facebook"
          ? await crawlerService.runCrawl(url, setJob)
          : await crawlerService.runJob(detection, setJob);
      setJob(result);
      setSaving(true);
      const source = await knowledgeService.createSource({
        name: result.sourceName,
        type: result.type,
        url: result.url || undefined,
        domain: result.domain,
        pages: result.pagesTotal,
        contentBlocks: result.contentBlocks,
        chunks: result.embedding.total,
        organizationId,
        engine: type === "database" ? db.engine : undefined,
        host: type === "database" ? db.host : undefined,
        tables: type === "database" ? result.pagesTotal : undefined,
        rows: type === "database" ? result.contentBlocks : undefined,
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
            Connect a website, Facebook Page, document or database. SupportBrain collects
            the content, chunks it, generates embeddings and indexes it for AI answers.
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-5">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
                      setError(null);
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
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
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

            {(type === "website" || type === "facebook") && (
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
            )}

            {type === "document" && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    addFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    addFiles(event.dataTransfer.files);
                  }}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Upload className="size-5" />
                  </span>
                  <span className="text-sm font-medium">
                    Click to upload or drop documents here
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX or TXT — mock ingestion, nothing is uploaded
                  </span>
                </button>

                {files.length > 0 && (
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
                      >
                        <FileText className="size-4 shrink-0 text-primary" />
                        <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {formatNumber(file.sizeKb)} KB
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={() =>
                            setFiles((current) =>
                              current.filter((_, itemIndex) => itemIndex !== index),
                            )
                          }
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {type === "database" && (
              <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Server className="size-4 text-primary" />
                  Read-only database connection
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Engine</Label>
                    <Select
                      value={db.engine}
                      onValueChange={(value) => {
                        const engine = value as DatabaseConfig["engine"];
                        updateDb({ engine, port: enginePorts[engine] });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="mongodb">MongoDB</SelectItem>
                        <SelectItem value="supabase">Supabase Postgres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-[1fr_5rem] gap-3">
                    <div className="space-y-2">
                      <Label>Host</Label>
                      <Input
                        value={db.host}
                        onChange={(event) => updateDb({ host: event.target.value })}
                        placeholder="db.example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input
                        value={db.port}
                        onChange={(event) => updateDb({ port: event.target.value })}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Database name</Label>
                    <Input
                      value={db.database}
                      onChange={(event) => updateDb({ database: event.target.value })}
                      placeholder="northwind"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={db.username}
                      onChange={(event) => updateDb({ username: event.target.value })}
                      placeholder="readonly"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={db.password}
                      onChange={(event) => updateDb({ password: event.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Credentials are used in this demo only for a simulated read-only
                  connection. In production they are stored encrypted server-side.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={Boolean(db.ssl)}
                      onCheckedChange={(checked) => updateDb({ ssl: checked })}
                      id="db-ssl"
                    />
                    <Label htmlFor="db-ssl">Require SSL</Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={testConnection}
                    disabled={testing}
                  >
                    {testing ? <Spinner /> : null}
                    {dbTested ? <CheckCircle2 className="text-success" /> : null}
                    {dbTested ? "Connected" : "Test connection"}
                  </Button>
                </div>
                {dbTested && dbTables.length > 0 && (
                  <div className="space-y-1.5 rounded-lg border border-success/30 bg-success-soft/40 p-3">
                    <p className="text-xs font-medium text-success">
                      {dbTables.length} tables discovered
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dbTables.map((table) => (
                        <span
                          key={table.name}
                          className="rounded-full bg-card px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground"
                        >
                          {table.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  {detection.valid ? detection.message : "Not ready"}
                  {detection.valid && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-success">
                        {detection.type === "facebook"
                          ? "Facebook Page detected"
                          : detection.type === "database"
                            ? "Database ready"
                            : detection.type === "document"
                              ? "Document ready"
                              : "Website detected"}
                      </span>
                    </>
                  )}
                </div>

                {detection.valid ? (
                  <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {detection.type === "facebook"
                          ? "Page"
                          : detection.type === "database"
                            ? "Database"
                            : detection.type === "document"
                              ? "Files"
                              : "Domain"}
                      </dt>
                      <dd className="truncate font-medium">{detection.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Source type</dt>
                      <dd className="font-medium capitalize">{detection.type}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {detection.type === "invalid"
                          ? "Items"
                          : sourceTypeMeta[detection.type].pageNoun}{" "}
                        found
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
                    Only publicly available Page content is fetched. No login, access
                    token or credentials are ever required.
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
                    label={sourceTypeMeta[job.type].pageNoun}
                    value={`${job.pagesCrawled}/${job.pagesTotal}`}
                    icon={<FileText />}
                  />
                  <Counter
                    label={sourceTypeMeta[job.type].blockNoun}
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
                    <Badge
                      variant={job.embedding.indexStatus === "ready" ? "success" : "warning"}
                    >
                      {job.embedding.indexStatus === "ready" ? "Ready" : "Building"}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1 font-mono text-[0.7rem] text-muted-foreground">
                    <p className="truncate">{job.embedding.indexName}</p>
                    <p>
                      {job.embedding.dimensions}d ·{" "}
                      {formatNumber(job.embedding.vectorsPerSecond)} vec/s
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
                  {formatNumber(job.embedding.total)} chunks embedded and indexed. Your AI
                  agent can now answer questions from this source.
                </p>
              </div>
              {saving && <Spinner className="text-muted-foreground" />}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <Stat label={jobMeta.pageNoun} value={formatNumber(job.pagesTotal)} />
              <Stat label={jobMeta.blockNoun} value={formatNumber(job.contentBlocks)} />
              <Stat label="Chunks" value={formatNumber(job.embedding.total)} />
              <Stat label="Embeddings" value={formatNumber(job.embedding.total)} />
              <Stat label="Vector index" value="Ready" tone="success" />
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="pages">Discovered {jobMeta.pageNoun.toLowerCase()}</TabsTrigger>
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
                        <span className="truncate text-sm font-medium">{page.title}</span>
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
                    <li key={section.id} className="rounded-lg border border-border bg-card p-3">
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
                      <li key={chunk.id} className="rounded-lg border border-border bg-card p-3">
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
                {type === "facebook"
                  ? "Start collection"
                  : type === "document"
                    ? "Process documents"
                    : type === "database"
                      ? "Start sync"
                      : "Start crawling"}
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
