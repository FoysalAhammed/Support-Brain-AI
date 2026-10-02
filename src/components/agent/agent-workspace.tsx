"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Brain,
  Check,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { agentService } from "@/services/agents";
import { knowledgeService } from "@/services/knowledge";
import { agentLanguages, agentModelOptions } from "@/data/mock-agent";
import { cn, formatNumber } from "@/lib/utils";
import type {
  AgentReply,
  AgentTone,
  AIAgent,
  ResponseLength,
} from "@/types/agent";
import type { KnowledgeSource } from "@/types/knowledge";

const tones: AgentTone[] = ["professional", "friendly", "concise", "enthusiastic"];
const lengths: ResponseLength[] = ["short", "balanced", "detailed"];

interface Turn {
  id: string;
  role: "user" | "agent";
  content: string;
  reply?: AgentReply;
}

export function AgentWorkspace() {
  const [agent, setAgent] = React.useState<AIAgent | null>(null);
  const [sources, setSources] = React.useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([agentService.getAgent(), knowledgeService.listSources("org_northwind")]).then(
      ([loadedAgent, loadedSources]) => {
        if (!mounted) return;
        setAgent(loadedAgent);
        setSources(loadedSources);
        setLoading(false);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  const patch = (values: Partial<AIAgent>) => {
    setAgent((current) => (current ? { ...current, ...values } : current));
    setDirty(true);
  };

  const save = async () => {
    if (!agent) return;
    setSaving(true);
    const updated = await agentService.updateAgent(agent);
    setAgent(updated);
    setSaving(false);
    setDirty(false);
    toast.success("Agent settings saved");
  };

  const toggleSource = async (sourceId: string, enabled: boolean) => {
    const updated = await agentService.toggleKnowledge(sourceId, enabled);
    setAgent(updated);
  };

  if (loading || !agent) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <Spinner className="text-primary" />
        Loading agent…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-2xl">
            {agent.avatarEmoji}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {agent.name}
              </h1>
              <Badge variant={agent.status === "active" ? "success" : "warning"}>
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    agent.status === "active" ? "bg-success" : "bg-warning",
                  )}
                />
                {agent.status === "active" ? "Active" : agent.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure how your AI agent answers customers.
            </p>
          </div>
        </div>
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? <Spinner /> : <Check />}
          Save changes
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle icon={<User />} title="Identity" description="How the agent introduces itself." />
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent name</Label>
                  <Input
                    id="agent-name"
                    value={agent.name}
                    onChange={(event) => patch({ name: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agent-avatar">Avatar</Label>
                  <Input
                    id="agent-avatar"
                    value={agent.avatarEmoji}
                    maxLength={2}
                    onChange={(event) => patch({ avatarEmoji: event.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-greeting">Greeting</Label>
                <Input
                  id="agent-greeting"
                  value={agent.greeting}
                  onChange={(event) => patch({ greeting: event.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle
              icon={<Brain />}
              title="Instructions"
              description="System prompt the agent follows on every answer."
            />
            <Textarea
              className="mt-4 min-h-32"
              value={agent.instructions}
              onChange={(event) => patch({ instructions: event.target.value })}
            />
          </Card>

          <Card className="p-5">
            <SectionTitle
              icon={<Sparkles />}
              title="Behaviour"
              description="Tone, length, language and escalation rules."
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={agent.tone} onValueChange={(value) => patch({ tone: value as AgentTone })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone} className="capitalize">
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Response length</Label>
                <Select
                  value={agent.responseLength}
                  onValueChange={(value) => patch({ responseLength: value as ResponseLength })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map((length) => (
                      <SelectItem key={length} value={length} className="capitalize">
                        {length}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={agent.language} onValueChange={(value) => patch({ language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {agentLanguages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confidence">Confidence threshold</Label>
                  <span className="text-sm font-medium tabular-nums">
                    {agent.confidenceThreshold}%
                  </span>
                </div>
                <input
                  id="confidence"
                  type="range"
                  min={40}
                  max={95}
                  value={agent.confidenceThreshold}
                  onChange={(event) =>
                    patch({ confidenceThreshold: Number(event.target.value) })
                  }
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
                />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Human handoff</p>
                <p className="text-xs text-muted-foreground">
                  Escalate to a person when confidence drops below the threshold.
                </p>
              </div>
              <Switch
                checked={agent.handoffEnabled}
                onCheckedChange={(checked) => patch({ handoffEnabled: checked })}
              />
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="fallback">Fallback message</Label>
              <Input
                id="fallback"
                value={agent.fallbackMessage}
                onChange={(event) => patch({ fallbackMessage: event.target.value })}
              />
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle
              icon={<BookOpen />}
              title="Knowledge"
              description="Knowledge sources this agent can answer from."
            />
            <ul className="mt-4 space-y-2">
              {sources.map((source) => {
                const enabled = agent.knowledgeSourceIds.includes(source.id);
                return (
                  <li
                    key={source.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{source.name}</p>
                      <p className="truncate text-xs capitalize text-muted-foreground">
                        {source.type} · {formatNumber(source.chunks)} chunks
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => toggleSource(source.id, checked)}
                    />
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="p-5">
            <SectionTitle
              icon={<Brain />}
              title="Model"
              description="Which language model powers this agent."
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {agentModelOptions.map((option) => {
                const selected = agent.model === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => patch({ model: option.id })}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      selected
                        ? "border-primary/40 bg-primary-soft"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{option.name}</span>
                      {option.badge && <Badge variant="accent">{option.badge}</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="xl:sticky xl:top-20 xl:self-start">
          <AgentPlayground agent={agent} />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary [&_svg]:size-4">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function AgentPlayground({ agent }: { agent: AIAgent }) {
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns, thinking]);

  const ask = async (value: string) => {
    const question = value.trim();
    if (!question || thinking) return;
    setInput("");
    setTurns((current) => [
      ...current,
      { id: `u_${Date.now()}`, role: "user", content: question },
    ]);
    setThinking(true);
    const reply = await agentService.testAgent(question);
    setTurns((current) => [
      ...current,
      { id: `a_${Date.now()}`, role: "agent", content: reply.content, reply },
    ]);
    setThinking(false);
  };

  return (
    <Card className="flex h-[38rem] flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Agent Playground</p>
            <p className="text-xs text-muted-foreground">Test answers before going live</p>
          </div>
        </div>
        <Badge variant="accent">
          <Sparkles className="size-3" />
          {agentModelOptions.find((model) => model.id === agent.model)?.name}
        </Badge>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-5">
        {turns.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="size-6" />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground">
              Ask a question to see how the agent answers using your connected
              knowledge.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {["What services do you provide?", "What is your return policy?"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => ask(suggestion)}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {turns.map((turn) =>
          turn.role === "user" ? (
            <div key={turn.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                {turn.content}
              </div>
            </div>
          ) : (
            <div key={turn.id} className="flex gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm">
                {agent.avatarEmoji}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-3.5 py-2.5 text-sm">
                  {turn.content}
                </div>
                {turn.reply && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={turn.reply.confidence >= 70 ? "success" : "warning"}>
                      {turn.reply.confidence}% confidence
                    </Badge>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="size-3" />
                      {turn.reply.retrieved.length} sources
                    </span>
                    <span>{turn.reply.latencyMs} ms</span>
                  </div>
                )}
                {turn.reply && turn.reply.retrieved.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {turn.reply.retrieved.map((source) => (
                      <span
                        key={source.id}
                        className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground"
                      >
                        {source.name} · {source.score.toFixed(2)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}

        {thinking && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-3.5" />
            Retrieving knowledge…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {agent.confidenceThreshold > 0 && (
        <div className="border-t border-border px-5 py-2 text-[0.7rem] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3" />
            Handoff below {agent.confidenceThreshold}% confidence
          </span>
        </div>
      )}

      <form
        className="flex items-center gap-2 border-t border-border p-3"
        onSubmit={(event) => {
          event.preventDefault();
          ask(input);
        }}
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask the agent a question…"
          aria-label="Playground message"
        />
        <Button type="submit" size="icon" disabled={thinking || !input.trim()} aria-label="Send">
          <Send />
        </Button>
      </form>
    </Card>
  );
}
