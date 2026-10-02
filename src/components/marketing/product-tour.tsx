"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  BarChart3,
  Bot,
  Check,
  Database,
  Facebook,
  FileText,
  Globe,
  Inbox,
  Layers,
  Plus,
  Radar,
  Send,
  ShieldAlert,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Counter } from "./anim";

const tabs = [
  { id: "knowledge", label: "Knowledge ingestion", icon: Radar },
  { id: "agent", label: "AI agent", icon: Bot },
  { id: "inbox", label: "Inbox & handoff", icon: Inbox },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

type TabId = (typeof tabs)[number]["id"];

const stages = [
  "Source detection",
  "Crawling website",
  "Content extraction",
  "Content cleaning",
  "Text chunking",
  "Embeddings",
  "Vector indexing",
  "Knowledge ready",
];

const pages = ["Home", "About Us", "Services", "Pricing", "FAQ", "Contact", "Terms", "Privacy"];

export function ProductTour() {
  const [active, setActive] = React.useState<TabId>("knowledge");
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/5">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-destructive/50" />
        <span className="size-2.5 rounded-full bg-warning/50" />
        <span className="size-2.5 rounded-full bg-success/50" />
        <span className="ml-2 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Globe className="size-3" />
          Live example · Northwind Commerce
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-success">
          <span className="size-1.5 rounded-full bg-success" />
          Agent online
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-thin border-b border-border px-3 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              aria-pressed={selected}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                selected
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[22rem] p-5">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {active === "knowledge" && <KnowledgePanel />}
            {active === "agent" && <AgentPanel />}
            {active === "inbox" && <InboxPanel />}
            {active === "analytics" && <AnalyticsPanel />}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PanelHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function KnowledgePanel() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div>
        <PanelHeader
          title="Website → Knowledge Ready"
          subtitle="northwind.com was crawled and indexed in 13 seconds"
        />
        <ol className="space-y-1.5">
          {stages.map((stage) => (
            <li key={stage} className="flex items-center gap-2.5 text-sm">
              <span className="flex size-5 items-center justify-center rounded-full bg-success-soft text-success">
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="text-muted-foreground">{stage}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="Pages" value="28" />
          <MiniStat label="Content blocks" value="1,476" />
          <MiniStat label="Chunks" value="5,604" />
          <MiniStat label="Embeddings" value="5,604" accent="success" />
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium">Discovered pages</span>
            <Badge variant="success">Index ready</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pages.map((page) => (
              <span
                key={page}
                className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[0.7rem] text-muted-foreground"
              >
                {page}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary-soft/40 p-3 text-xs">
          <Sparkles className="size-3.5 text-primary" />
          Your AI agent can now answer from this knowledge.
        </div>
      </div>
    </div>
  );
}

function AgentPanel() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_16rem]">
      <div>
        <PanelHeader
          title="Grounded answers from your knowledge"
          subtitle="Northwind Assistant · SupportBrain Pro"
        />
        <div className="space-y-3 rounded-xl border border-border bg-background p-4">
          <div className="flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
              What is your return policy and how long do I have?
            </p>
          </div>
          <div className="flex gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Sparkles className="size-3.5" />
            </span>
            <div className="space-y-2">
              <p className="rounded-2xl rounded-tl-sm border border-border bg-card px-3 py-2 text-sm">
                You can return unused items within 60 days of delivery for a full
                refund to the original payment method. Northwind Plus members get a
                90-day window, and made-to-order items are final sale.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                <Badge variant="success">95% confidence</Badge>
                <span>1,180 ms</span>
                <span className="rounded-full bg-muted px-2 py-0.5">Refund Policy</span>
                <span className="rounded-full bg-muted px-2 py-0.5">Returns Portal</span>
                <span className="rounded-full bg-muted px-2 py-0.5">Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3 text-xs">
        <p className="font-semibold">Agent configuration</p>
        {[
          ["Tone", "Friendly"],
          ["Response length", "Balanced"],
          ["Confidence threshold", "70%"],
          ["Handoff", "Enabled"],
          ["Model", "SupportBrain Pro"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
        <div className="mt-2 rounded-lg bg-card p-2">
          <p className="text-muted-foreground">Connected knowledge</p>
          <p className="mt-1 flex items-center gap-1.5 font-medium">
            <Globe className="size-3" />
            northwind.com
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-medium">
            <Facebook className="size-3" />
            Northwind on Facebook
          </p>
        </div>
      </div>
    </div>
  );
}

function InboxPanel() {
  return (
    <div>
      <PanelHeader
        title="One inbox across every channel"
        subtitle="AI resolves the routine · your team handles the rest"
      />
      <div className="grid gap-3 sm:grid-cols-[15rem_1fr]">
        <div className="space-y-1 rounded-lg border border-border p-2">
          {[
            { name: "Amelia Novak", tag: "Facebook", state: "AI", text: "Code worked, thanks!" },
            { name: "Daniel Okafor", tag: "Website", state: "AI", text: "Tracking hasn't moved…" },
            { name: "Ravi Patel", tag: "WhatsApp", state: "Human", text: "Send the Q4 price list?" },
            { name: "Sofia Ramirez", tag: "Website", state: "Handoff", text: "Attached photos of the damage" },
          ].map((row) => (
            <div key={row.name} className="rounded-md px-2 py-2 transition-colors hover:bg-muted/60">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium">{row.name}</span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[0.6rem] font-medium",
                    row.state === "Human"
                      ? "bg-primary-soft text-primary"
                      : row.state === "Handoff"
                        ? "bg-warning-soft text-warning"
                        : "bg-accent-soft text-accent",
                  )}
                >
                  {row.state}
                </span>
              </div>
              <p className="truncate text-[0.7rem] text-muted-foreground">{row.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col rounded-lg border border-border">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <span className="text-xs font-medium">Sofia Ramirez</span>
            <Badge variant="danger" className="ml-auto text-[0.65rem]">
              41% confidence
            </Badge>
          </div>
          <div className="flex items-center gap-2 border-b border-warning/30 bg-warning-soft/60 px-3 py-2 text-xs">
            <ShieldAlert className="size-3.5 shrink-0 text-warning" />
            <span className="text-warning">AI confidence low — needs a human</span>
            <Button size="sm" variant="outline" className="ml-auto h-6 px-2 text-[0.65rem]">
              <UserPlus className="size-3" />
              Take over
            </Button>
          </div>
          <div className="flex-1 space-y-2 p-3">
            <p className="max-w-[80%] rounded-2xl rounded-tl-sm border border-border bg-card px-3 py-1.5 text-xs">
              I'm sorry your side table arrived damaged. Let me get a specialist to
              arrange a replacement.
            </p>
            <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-1.5 text-xs text-primary-foreground">
              Human agent joined the conversation.
            </p>
          </div>
          <div className="flex items-center gap-2 border-t border-border p-2">
            <span className="flex-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
              Type your message…
            </span>
            <Send className="size-3.5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const bars = [46, 62, 54, 78, 68, 88, 76];
  return (
    <div>
      <PanelHeader
        title="Know what's working"
        subtitle="Last 30 days across all channels"
      />
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Conversations", to: 12482 },
          { label: "AI resolution", to: 87.4, suffix: "%", decimals: 1 },
          { label: "Avg. response", to: 1.8, suffix: "s", decimals: 1 },
          { label: "Satisfaction", to: 4.7, decimals: 1 },
        ].map((metric) => (
          <div key={metric.label} className="rounded-lg border border-border p-3">
            <p className="text-[0.7rem] text-muted-foreground">{metric.label}</p>
            <p className="mt-0.5 text-lg font-semibold">
              <Counter
                to={metric.to}
                decimals={metric.decimals ?? 0}
                suffix={metric.suffix ?? ""}
              />
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-border p-3">
          <p className="mb-2 text-xs font-medium">Conversations over time</p>
          <div className="flex items-end gap-1.5" style={{ height: 92 }}>
            {bars.map((value, index) => (
              <div
                key={index}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2 rounded-lg border border-border p-3 text-xs">
          <p className="font-medium">Top knowledge topics</p>
          {[
            ["Shipping & Delivery", 86],
            ["Refund Policy", 74],
            ["Membership", 61],
            ["Warranty", 48],
          ].map(([label, value]) => (
            <div key={label as string} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="tabular-nums">{value}%</span>
              </div>
              <div className="h-1 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success";
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[0.7rem] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-lg font-semibold tabular-nums",
          accent === "success" && "text-success",
        )}
      >
        {value}
      </p>
    </div>
  );
}
