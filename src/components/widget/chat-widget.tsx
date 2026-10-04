"use client";

import * as React from "react";
import {
  BookOpen,
  CheckCircle2,
  Headphones,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { conversationService } from "@/services/conversations";
import { knowledgeService } from "@/services/knowledge";
import { cn } from "@/lib/utils";
import type { WidgetConfig } from "@/types/channel";
import type { RagAnswer } from "@/types/knowledge";

interface WidgetMessage {
  id: string;
  role: "customer" | "ai" | "agent" | "system";
  content: string;
  sources?: RagAnswer["retrieved"];
  confidence?: number;
}

const suggestions = [
  "How long does shipping take?",
  "What is your return policy?",
  "Do you ship internationally?",
];

/**
 * The embeddable floating chat widget. Drop it on any page (the landing page and
 * the demo storefront mount it) and it behaves exactly like the script a
 * business owner pastes into their own site: a bubble that expands into a chat
 * which feeds the SupportBrain inbox.
 */
export function ChatWidget({
  config,
  sessionKey,
  className,
}: {
  config: WidgetConfig;
  sessionKey?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<WidgetMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [handedOff, setHandedOff] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  const [email, setEmail] = React.useState("");
  const [emailCaptured, setEmailCaptured] = React.useState(!config.collectEmail);
  const [dark, setDark] = React.useState(false);

  const convIdRef = React.useRef<string | null>(null);
  const sessionRef = React.useRef<string>(sessionKey ?? "");
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (sessionKey) {
      sessionRef.current = sessionKey;
      return;
    }
    const key = "supportbrain.widget.session";
    let existing = window.sessionStorage.getItem(key);
    if (!existing) {
      existing = Math.random().toString(36).slice(2, 10);
      window.sessionStorage.setItem(key, existing);
    }
    sessionRef.current = existing;
  }, [sessionKey]);

  React.useEffect(() => {
    const resolve = () => {
      if (config.theme === "dark") return true;
      if (config.theme === "light") return false;
      return document.documentElement.classList.contains("dark");
    };
    setDark(resolve());
  }, [config.theme, open]);

  React.useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "ai",
          content: `${config.greeting}\n\n${config.welcomeMessage}`,
        },
      ]);
    }
  }, [open, messages.length, config.greeting, config.welcomeMessage]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking, open]);

  const send = async (value: string) => {
    const question = value.trim();
    if (!question || thinking || handedOff) return;
    setDraft("");
    setMessages((current) => [
      ...current,
      { id: `c_${Date.now()}`, role: "customer", content: question },
    ]);
    setThinking(true);
    try {
      if (!convIdRef.current) {
        const { conversation } = await conversationService.findOrCreateWebsiteSession(
          sessionRef.current,
          {
            customerName: email ? email.split("@")[0] : "Website visitor",
            customerEmail: email || undefined,
          },
        );
        convIdRef.current = conversation.id;
      }
      const convId = convIdRef.current;
      try {
        await conversationService.sendMessage(convId, question, "customer");
      } catch {
        // mirroring is best-effort; the visitor still gets an answer
      }
      const answer = await knowledgeService.ask(question);
      try {
        await conversationService.sendMessage(convId, answer.answer, "ai");
      } catch {
        // ignore
      }
      setMessages((current) => [
        ...current,
        {
          id: `a_${Date.now()}`,
          role: "ai",
          content: answer.answer,
          sources: answer.retrieved,
          confidence: answer.confidence,
        },
      ]);
      if (!open) setUnread((value) => value + 1);
    } finally {
      setThinking(false);
    }
  };

  const requestHuman = async () => {
    setHandedOff(true);
    setMessages((current) => [
      ...current,
      { id: `s_${Date.now()}`, role: "system", content: "Connecting you to a human agent…" },
    ]);
    if (convIdRef.current) {
      try {
        await conversationService.takeOver(convIdRef.current, "You");
      } catch {
        // ignore
      }
    }
    setMessages((current) => [
      ...current,
      {
        id: `ag_${Date.now()}`,
        role: "agent",
        content:
          "Hi, Sofía from the Northwind team here. I've read your conversation and I'm happy to help.",
      },
    ]);
  };

  const positionClass =
    config.position === "bottom-left" ? "left-5 sm:left-6" : "right-5 sm:right-6";

  return (
    <div className={cn("fixed bottom-5 z-50 sm:bottom-6", positionClass, className)}>
      {open && (
        <div
          className={cn(
            "mb-3 flex h-[min(560px,72vh)] w-[min(384px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
            "animate-[fade-up_0.25s_cubic-bezier(0.16,1,0.3,1)]",
            dark && "dark",
          )}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 text-white"
            style={{ backgroundColor: config.primaryColor }}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{config.agentName}</p>
              <p className="flex items-center gap-1.5 text-[0.7rem] opacity-90">
                <span className="size-1.5 rounded-full bg-success" />
                {handedOff ? "Human agent joined" : "Online · replies instantly"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {!emailCaptured ? (
            <div className="flex flex-1 flex-col justify-center gap-3 p-5">
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium">Before we start</p>
                <p className="text-xs text-muted-foreground">
                  Add your email so we can follow up if needed.
                </p>
              </div>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="Email"
              />
              <Button
                onClick={() => setEmailCaptured(true)}
                disabled={!email.includes("@")}
                style={{ backgroundColor: config.primaryColor }}
              >
                Start chat
              </Button>
              <button
                type="button"
                onClick={() => setEmailCaptured(true)}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Skip
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin p-4">
                {messages.map((message) => (
                  <WidgetBubble key={message.id} message={message} />
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Spinner className="size-3.5 text-primary" />
                    Searching business knowledge…
                  </div>
                )}
                {!handedOff && messages.length <= 1 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => send(suggestion)}
                        className="rounded-full border border-border px-2.5 py-1 text-[0.7rem] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="border-t border-border p-3">
                {!handedOff && (
                  <button
                    type="button"
                    onClick={requestHuman}
                    className="mb-2 inline-flex items-center gap-1.5 text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Headphones className="size-3" />
                    Talk to a human
                  </button>
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
                  <Button
                    type="submit"
                    size="icon"
                    disabled={thinking || !draft.trim()}
                    aria-label="Send"
                    style={{ backgroundColor: config.primaryColor }}
                    className="text-white"
                  >
                    <Send />
                  </Button>
                </form>
              </div>
            </>
          )}

          {config.showBranding && (
            <p className="border-t border-border py-2 text-center text-[0.65rem] text-muted-foreground">
              Powered by SupportBrain AI
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setOpen((value) => !value);
            setUnread(0);
          }}
          aria-label={open ? "Close chat" : "Open chat"}
          aria-expanded={open}
          className="relative flex size-14 items-center justify-center rounded-full text-white shadow-xl transition-transform duration-150 hover:scale-105 active:scale-95"
          style={{ backgroundColor: config.primaryColor }}
        >
          {!open && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full animate-pulse-ring"
              aria-hidden
            />
          )}
          {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          {!open && unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[0.65rem] font-semibold text-destructive-foreground">
              {unread}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function WidgetBubble({ message }: { message: WidgetMessage }) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center">
        <p className="rounded-full bg-muted px-3 py-1 text-center text-[0.7rem] text-muted-foreground">
          {message.content}
        </p>
      </div>
    );
  }

  const isCustomer = message.role === "customer";

  return (
    <div className={cn("flex", isCustomer && "justify-end")}>
      <div className={cn("max-w-[85%] space-y-1", isCustomer && "items-end")}>
        <div
          className={cn(
            "whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm",
            isCustomer
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : message.role === "agent"
                ? "rounded-tl-sm border border-success/30 bg-success-soft/50"
                : "rounded-tl-sm border border-border bg-background",
          )}
        >
          {message.content}
        </div>

        {message.role === "ai" && (
          <div className="flex flex-wrap items-center gap-1.5 text-[0.65rem] text-muted-foreground">
            {message.confidence !== undefined && (
              <Badge variant={message.confidence >= 70 ? "success" : "warning"}>
                {message.confidence}% confidence
              </Badge>
            )}
            {message.sources && message.sources.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <BookOpen className="size-3" />
                Business knowledge
              </span>
            )}
          </div>
        )}

        {message.role === "ai" && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.sources.slice(0, 3).map((source) => (
              <span
                key={source.id}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground"
              >
                <CheckCircle2 className="size-2.5 text-success" />
                {source.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
