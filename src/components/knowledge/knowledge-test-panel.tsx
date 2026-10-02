"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowRight,
  Brain,
  FileText,
  Layers,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { crawlerService } from "@/services/crawler";
import { cn, sleep } from "@/lib/utils";
import type { CrawlJob } from "@/types/crawler";
import type { RagAnswer } from "@/types/knowledge";

const flow = [
  { label: "Customer Question", icon: UserRound },
  { label: "Retrieve Relevant Chunks", icon: Search },
  { label: "Build Context", icon: Layers },
  { label: "AI Response", icon: Sparkles },
];

const suggestions = [
  "What services does this business provide?",
  "How long does delivery take?",
  "What is your return policy?",
];

export function KnowledgeTestPanel({
  job,
  sourceId,
}: {
  job: CrawlJob;
  sourceId?: string;
}) {
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [answer, setAnswer] = React.useState<RagAnswer | null>(null);
  const [step, setStep] = React.useState(0);

  const run = React.useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || loading) return;
      setQuestion(trimmed);
      setLoading(true);
      setAnswer(null);
      setStep(1);
      await sleep(220);
      setStep(2);
      await sleep(320);
      setStep(3);
      await sleep(240);
      setAnswer(crawlerService.askKnowledge(job, trimmed, sourceId));
      setStep(4);
      setLoading(false);
    },
    [job, sourceId, loading],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
        {flow.map((item, index) => {
          const done = answer ? true : loading && index < step;
          const active = loading && index === step - 1;
          const Icon = item.icon;
          const showArrow = index < flow.length - 1;
          return (
            <React.Fragment key={item.label}>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border bg-card px-3 py-2 transition-colors",
                  done && "border-primary/30 bg-primary-soft",
                  active && "border-primary shadow-sm",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    done || active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    done && "text-primary",
                  )}
                >
                  {item.label}
                </span>
              </div>
              {showArrow && (
                <>
                  <ArrowRight className="mx-auto hidden size-4 text-muted-foreground/60 sm:block" />
                  <ArrowDown className="mx-auto size-4 text-muted-foreground/60 sm:hidden" />
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => run(item)}
            disabled={loading}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
          >
            {item}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          run(question);
        }}
      >
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask the knowledge base a question…"
          aria-label="Test question"
        />
        <Button type="submit" disabled={loading || !question.trim()}>
          {loading ? <Spinner /> : <Brain />}
          Ask
        </Button>
      </form>

      {answer && (
        <div className="space-y-4 animate-[fade-up_0.3s_ease-out]">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                <Sparkles className="size-3" />
                Grounded answer
              </Badge>
              <Badge
                variant={
                  answer.confidence >= 85
                    ? "success"
                    : answer.confidence >= 70
                      ? "warning"
                      : "danger"
                }
              >
                {answer.confidence}% confidence
              </Badge>
              <span className="font-mono text-[0.7rem] text-muted-foreground">
                {answer.latencyMs} ms · {job.embedding.dimensions}d
              </span>
            </div>
            <p className="text-sm leading-relaxed">{answer.answer}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Retrieved sources
              </p>
              {answer.retrieved.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                  No passages cleared the relevance threshold.
                </p>
              ) : (
                <ul className="space-y-2">
                  {answer.retrieved.map((chunk) => (
                    <li
                      key={chunk.id}
                      className="rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <FileText className="size-3.5 text-primary" />
                          {chunk.label}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {chunk.score.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${chunk.score * 100}%` }}
                        />
                      </div>
                      <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
                        {chunk.snippet}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Retrieval trace
              </p>
              <ol className="space-y-1.5 rounded-lg border border-border bg-card p-3">
                {answer.stages.map((stage) => (
                  <li key={stage.label} className="flex items-start gap-2 text-xs">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <span className="font-medium">{stage.label}</span>
                      <span className="block text-muted-foreground">
                        {stage.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
