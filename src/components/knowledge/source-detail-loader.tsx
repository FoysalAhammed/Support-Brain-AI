"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { SourceDetailView } from "@/components/knowledge/source-detail-view";
import { crawlerService } from "@/services/crawler";
import { knowledgeService } from "@/services/knowledge";
import type { CrawlJob } from "@/types/crawler";
import type {
  ExtractedSection,
  KnowledgeActivity,
  KnowledgeSource,
} from "@/types/knowledge";

interface Loaded {
  source: KnowledgeSource;
  job: CrawlJob;
  sections: ExtractedSection[];
  activity: KnowledgeActivity[];
}

export function SourceDetailLoader({ sourceId }: { sourceId: string }) {
  const [state, setState] = React.useState<
    { status: "loading" } | { status: "missing" } | { status: "ready"; data: Loaded }
  >({ status: "loading" });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const [source, details, activity] = await Promise.all([
        knowledgeService.getSource(sourceId),
        crawlerService.getSourceDetails(sourceId),
        knowledgeService.getActivity(sourceId),
      ]);
      if (!mounted) return;
      if (!source || !details) {
        setState({ status: "missing" });
        return;
      }
      setState({
        status: "ready",
        data: {
          source,
          job: details.job,
          sections: crawlerService.contentSections(details.job, sourceId),
          activity,
        },
      });
    })();
    return () => {
      mounted = false;
    };
  }, [sourceId]);

  if (state.status === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <EmptyState
        icon={<BookOpen />}
        title="Source not found"
        description="This knowledge source may have been removed, or it was created in a previous session."
        action={
          <Button asChild>
            <Link href="/dashboard/knowledge">Back to Knowledge Base</Link>
          </Button>
        }
      />
    );
  }

  return (
    <SourceDetailView
      source={state.data.source}
      job={state.data.job}
      sections={state.data.sections}
      activity={state.data.activity}
    />
  );
}
