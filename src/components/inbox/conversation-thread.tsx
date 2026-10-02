"use client";

import * as React from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Facebook,
  Globe,
  Headphones,
  Instagram,
  Mail,
  Maximize2,
  MessageSquare,
  Minimize2,
  PanelRight,
  Paperclip,
  Phone,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  UserCheck,
  UserPlus,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { mockTeamMembers } from "@/data/mock-users";
import { cn, initials, relativeTime } from "@/lib/utils";
import type {
  Conversation,
  ConversationStatus,
  Message,
  MessageDeliveryStatus,
  MessageRole,
} from "@/types/conversation";
import type { ChannelType } from "@/types/channel";
import { OrderStatusBadge } from "./order-status";

export const channelMeta: Record<ChannelType, { label: string; icon: React.ElementType }> = {
  website: { label: "Website", icon: Globe },
  facebook: { label: "Facebook", icon: Facebook },
  whatsapp: { label: "WhatsApp", icon: Phone },
  voice: { label: "Voice", icon: Headphones },
  email: { label: "Email", icon: Mail },
  instagram: { label: "Instagram", icon: Instagram },
};

function roleLabel(role: MessageRole) {
  if (role === "ai") return "AI Agent";
  if (role === "agent") return "Human agent";
  if (role === "system") return "System";
  return "Customer";
}

function DeliveryTicks({ status }: { status: MessageDeliveryStatus }) {
  const Icon = status === "sent" ? Check : CheckCheck;
  return (
    <p
      className={cn(
        "flex items-center justify-end gap-1 text-[0.7rem]",
        status === "read" ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-3" />
      {status === "read" ? "Seen" : status === "delivered" ? "Delivered" : "Sent"}
    </p>
  );
}

export function ConversationThread({
  conversation,
  messages,
  onSend,
  onTakeOver,
  onStatus,
  onAssign,
  onBack,
  onToggleFullscreen,
  isFullscreen,
  onToggleDetails,
}: {
  conversation: Conversation;
  messages: Message[];
  onSend: (content: string) => Promise<void> | void;
  onTakeOver: () => void;
  onStatus: (status: ConversationStatus) => void;
  onAssign: (name: string) => void;
  onBack?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  onToggleDetails?: () => void;
}) {
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const Channel = channelMeta[conversation.channel].icon;
  const needsHandoff = conversation.handler === "ai" && conversation.confidence < 70;

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, conversation.id]);

  const send = async () => {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    await onSend(content);
    setDraft("");
    setSending(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        {onBack && (
          <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onBack} aria-label="Back">
            <ArrowLeft />
          </Button>
        )}
        <Avatar className="size-9">
          <AvatarFallback>{initials(conversation.customer.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">
              {conversation.customer.name}
            </p>
            <OrderStatusBadge status={conversation.orderStatus ?? "processing"} />
          </div>
          <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Channel className="size-3" />
            {channelMeta[conversation.channel].label} · {conversation.subject}
          </p>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          {conversation.handler === "ai" ? (
            <Badge variant="accent">
              <Sparkles className="size-3" />
              AI
            </Badge>
          ) : (
            <Badge variant="default">
              <UserCheck className="size-3" />
              Human
            </Badge>
          )}
        </div>
        {onToggleDetails && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleDetails}
            aria-label="Toggle customer details"
          >
            <PanelRight />
          </Button>
        )}
        {onToggleFullscreen && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Conversation</DropdownMenuLabel>
            {conversation.handler === "ai" && (
              <DropdownMenuItem onSelect={onTakeOver}>
                <UserPlus />
                Take over conversation
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Assign to</DropdownMenuLabel>
            {mockTeamMembers.slice(0, 4).map((member) => (
              <DropdownMenuItem
                key={member.id}
                onSelect={() => onAssign(member.name)}
              >
                <UserCheck />
                {member.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {conversation.status === "resolved" ? (
              <DropdownMenuItem onSelect={() => onStatus("open")}>
                <RotateCcw />
                Reopen
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={() => onStatus("resolved")}>
                <CheckCheck />
                Mark resolved
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {needsHandoff && (
        <div className="flex flex-col gap-2 border-b border-warning/30 bg-warning-soft/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-medium text-warning">
                AI confidence low ({conversation.confidence}%)
              </p>
              <p className="text-xs text-muted-foreground">
                This conversation requires human assistance.
              </p>
            </div>
          </div>
          <Button size="sm" onClick={onTakeOver}>
            <UserPlus />
            Take Over Conversation
          </Button>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            conversation={conversation}
            outboundStatus={
              message.role === "ai" || message.role === "agent"
                ? index === messages.length - 1
                  ? "delivered"
                  : "read"
                : undefined
            }
          />
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          {conversation.handler === "human" ? (
            <span className="inline-flex items-center gap-1.5">
              <UserCheck className="size-3" />
              Replying as a human agent
              {conversation.assignedTo ? ` · ${conversation.assignedTo}` : ""}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3" />
              AI agent is handling this conversation
            </span>
          )}
        </div>
        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder="Type your message…"
            className="min-h-10 flex-1 resize-none"
            rows={1}
            aria-label="Message"
          />
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Attach file">
              <Paperclip />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Voice message">
              <MessageSquare />
            </Button>
            <Button type="submit" size="icon" disabled={sending || !draft.trim()} aria-label="Send">
              {sending ? <Spinner /> : <Send />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  conversation,
  outboundStatus,
}: {
  message: Message;
  conversation: Conversation;
  outboundStatus?: MessageDeliveryStatus;
}) {
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
  const isAi = message.role === "ai";
  const isOutbound = message.role === "agent" || isAi;

  return (
    <div className={cn("flex gap-2.5", isOutbound && "flex-row-reverse")}>
      <Avatar className="size-8">
        <AvatarFallback
          className={cn(
            isAi && "bg-accent-soft text-accent",
            message.role === "agent" && "bg-primary text-primary-foreground",
          )}
        >
          {isOutbound
            ? isAi
              ? "AI"
              : initials(message.authorName ?? "You")
            : initials(conversation.customer.name)}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "min-w-0 max-w-[85%] space-y-1.5",
          isOutbound && "items-end text-right",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm",
            isCustomer && "rounded-tl-sm border border-border bg-card",
            isAi && "rounded-br-sm border border-accent/30 bg-accent-soft text-foreground",
            message.role === "agent" && "rounded-br-sm bg-primary text-primary-foreground",
          )}
        >
          <p
            className={cn(
              "mb-1 text-[0.7rem]",
              message.role === "agent" ? "opacity-80" : "opacity-70",
            )}
          >
            {isOutbound
              ? isAi
                ? "AI Agent"
                : (message.authorName ?? "You")
              : roleLabel(message.role)}{" "}
            · {relativeTime(message.createdAt)}
          </p>
          {message.content}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <span
                  key={attachment.id}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  <Paperclip className="size-3" />
                  {attachment.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {outboundStatus && <DeliveryTicks status={outboundStatus} />}

        {isAi && (
          <div className="flex flex-wrap items-center justify-end gap-1.5 text-[0.7rem] text-muted-foreground">
            {message.confidence !== undefined && (
              <Badge variant={message.confidence >= 70 ? "success" : "warning"}>
                {message.confidence}% confidence
              </Badge>
            )}
            {message.latencyMs !== undefined && <span>{message.latencyMs} ms</span>}
            {message.sources?.map((source) => (
              <span
                key={source.id}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5"
              >
                <Zap className="size-2.5" />
                {source.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
