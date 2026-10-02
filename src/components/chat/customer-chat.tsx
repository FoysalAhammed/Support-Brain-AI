"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  Maximize2,
  Mic,
  Minimize2,
  Paperclip,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { LogoMark } from "@/components/brand/logo";
import { knowledgeService } from "@/services/knowledge";
import { cn } from "@/lib/utils";
import type { RagAnswer } from "@/types/knowledge";

interface ChatMessage {
  id: string;
  role: "customer" | "ai" | "agent" | "system";
  content: string;
  sources?: RagAnswer["retrieved"];
  confidence?: number;
  latencyMs?: number;
}

const suggestions = [
  "What services do you provide?",
  "How long does shipping take?",
  "What is your return policy?",
  "Do you ship internationally?",
];

export function CustomerChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hi! I'm the Northwind Assistant. Ask me anything about orders, shipping, returns, warranties or our membership — I answer using the business's own knowledge.",
    },
  ]);
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [handedOff, setHandedOff] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const send = async (value: string) => {
    const question = value.trim();
    if (!question || thinking || handedOff) return;
    setDraft("");
    setMessages((current) => [
      ...current,
      { id: `c_${Date.now()}`, role: "customer", content: question },
    ]);
    setThinking(true);
    const answer = await knowledgeService.ask(question);
    setMessages((current) => [
      ...current,
      {
        id: `a_${Date.now()}`,
        role: "ai",
        content: answer.answer,
        sources: answer.retrieved,
        confidence: answer.confidence,
        latencyMs: answer.latencyMs,
      },
    ]);
    setThinking(false);
  };

  const requestHuman = () => {
    setHandedOff(true);
    setMessages((current) => [
      ...current,
      {
        id: `h_${Date.now()}`,
        role: "system",
        content: "You're now connected with a human support agent.",
      },
      {
        id: `ag_${Date.now()}`,
        role: "agent",
        content:
          "Hi, Sofía from the Northwind team here. I've read your conversation so far and I'm happy to help. What can I do for you?",
      },
    ]);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-3 px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
            <LogoMark className="size-5" />
            Powered by SupportBrain AI
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpanded((value) => !value)}
            aria-label={expanded ? "Exit full screen" : "Full screen"}
          >
            {expanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>
      </header>

      <main
        className={cn(
          "flex w-full flex-1 flex-col",
          expanded ? "max-w-none p-0" : "mx-auto max-w-2xl p-4",
        )}
      >
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden bg-card",
            expanded ? "rounded-none" : "rounded-2xl border border-border shadow-lg",
          )}
        >
          <div className="flex items-center gap-3 border-b border-border p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Northwind Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" />
                {handedOff ? "Human agent joined" : "AI agent · replies instantly"}
              </p>
            </div>
            {!handedOff && (
              <Button variant="outline" size="sm" onClick={requestHuman}>
                <Headphones />
                Talk to a human
              </Button>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}

            {thinking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-3.5 text-primary" />
                Searching business knowledge…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3">
            {!handedOff && messages.length <= 1 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <form
              className="flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                send(draft);
              }}
            >
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(draft);
                  }
                }}
                placeholder={handedOff ? "Reply to the agent…" : "Type your message…"}
                className="min-h-10 flex-1 resize-none"
                rows={1}
                aria-label="Message"
              />
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Attach image">
                  <Paperclip />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Voice input">
                  <Mic />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  disabled={thinking || !draft.trim()}
                  aria-label="Send"
                >
                  <Send />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <p
          className={cn(
            "mt-3 text-center text-xs text-muted-foreground",
            expanded && "pb-3",
          )}
        >
          This is a demonstration. Answers are generated from mock business knowledge.
        </p>
      </main>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center">
        <p className="rounded-full bg-muted px-3 py-1 text-center text-xs text-muted-foreground">
          {message.content}
        </p>
      </div>
    );
  }

  const isCustomer = message.role === "customer";
  const isAgent = message.role === "agent";

  return (
    <div className={cn("flex gap-2.5", isCustomer && "flex-row-reverse")}>
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isCustomer
            ? "bg-primary text-primary-foreground"
            : isAgent
              ? "bg-success-soft text-success"
              : "bg-accent-soft text-accent",
        )}
      >
        {isCustomer ? (
          <UserRound className="size-4" />
        ) : isAgent ? (
          <Headphones className="size-4" />
        ) : (
          <Sparkles className="size-4" />
        )}
      </span>
      <div className={cn("min-w-0 max-w-[85%] space-y-1.5", isCustomer && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm",
            isCustomer
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm border border-border bg-background",
          )}
        >
          {message.content}
        </div>

        {message.role === "ai" && (
          <div className="flex flex-wrap items-center gap-1.5 text-[0.7rem] text-muted-foreground">
            {message.confidence !== undefined && (
              <Badge variant={message.confidence >= 70 ? "success" : "warning"}>
                {message.confidence}% confidence
              </Badge>
            )}
            {message.latencyMs !== undefined && <span>{message.latencyMs} ms</span>}
            {message.sources && message.sources.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <BookOpen className="size-3" />
                Answered using business knowledge
              </span>
            )}
          </div>
        )}

        {message.role === "ai" && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.sources.map((source) => (
              <span
                key={source.id}
                className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground"
              >
                {source.label} · {source.score.toFixed(2)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
