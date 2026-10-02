"use client";

import * as React from "react";
import { Inbox, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { conversationService } from "@/services/conversations";
import { cn, initials, relativeTime } from "@/lib/utils";
import type {
  Conversation,
  ConversationStatus,
  Message,
  OrderStatus,
} from "@/types/conversation";
import { CustomerPanel } from "./customer-panel";
import { ConversationThread, channelMeta } from "./conversation-thread";

type FilterKey = "all" | "ai" | "human" | "unread" | "resolved";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI" },
  { key: "human", label: "Human" },
  { key: "unread", label: "Unread" },
  { key: "resolved", label: "Resolved" },
];

export function InboxView() {
  const [active, setActive] = React.useState<FilterKey>("all");
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loadingThread, setLoadingThread] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    conversationService
      .list({
        status: active === "resolved" ? "resolved" : "all",
        handler: active === "ai" ? "ai" : active === "human" ? "human" : "all",
        unreadOnly: active === "unread",
        query: debouncedQuery,
      })
      .then((result) => {
        if (!mounted) return;
        setConversations(result);
        setLoading(false);
        setSelectedId((current) =>
          current && result.some((item) => item.id === current)
            ? current
            : (result[0]?.id ?? null),
        );
      });
    return () => {
      mounted = false;
    };
  }, [active, debouncedQuery]);

  const selected =
    conversations.find((conversation) => conversation.id === selectedId) ?? null;

  React.useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    let mounted = true;
    setLoadingThread(true);
    conversationService.getMessages(selectedId).then((result) => {
      if (!mounted) return;
      setMessages(result);
      setLoadingThread(false);
    });
    return () => {
      mounted = false;
    };
  }, [selectedId]);

  // Full-screen: lock page scroll and allow Esc to exit.
  React.useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreen(false);
        setShowDetails(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  const exitFullscreen = () => {
    setFullscreen(false);
    setShowDetails(false);
  };

  const updateConversation = (updated: Conversation | null) => {
    if (!updated) return;
    setConversations((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const handleSend = async (content: string) => {
    if (!selected) return;
    const role = selected.handler === "human" ? "agent" : "ai";
    const message = await conversationService.sendMessage(
      selected.id,
      content,
      role,
      role === "agent" ? (selected.assignedTo ?? "You") : undefined,
    );
    setMessages((current) => [...current, message]);
    updateConversation({
      ...selected,
      lastMessage: content,
      lastMessageAt: message.createdAt,
      messageCount: selected.messageCount + 1,
    });
  };

  const handleTakeOver = async () => {
    if (!selected) return;
    const updated = await conversationService.takeOver(selected.id, "You");
    updateConversation(updated);
    setMessages(await conversationService.getMessages(selected.id));
  };

  const handleStatus = async (status: ConversationStatus) => {
    if (!selected) return;
    updateConversation(await conversationService.setStatus(selected.id, status));
  };

  const handleAssign = async (name: string) => {
    if (!selected) return;
    updateConversation(await conversationService.assign(selected.id, name));
  };

  const handleOrderStatus = async (status: OrderStatus) => {
    if (!selected) return;
    updateConversation(await conversationService.setOrderStatus(selected.id, status));
  };

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setShowDetails(false);
    conversationService.markRead(id);
  };

  const listPane = (
    <div className="flex h-full min-h-0 flex-col border-r border-border">
      <div className="space-y-2 border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations…"
            className="pl-9"
            aria-label="Search conversations"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActive(filter.key)}
              aria-pressed={active === filter.key}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                active === filter.key
                  ? "border-primary/30 bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Inbox />}
              title="No conversations"
              description="Try a different filter or search term."
              className="border-0 bg-transparent py-10"
            />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {conversations.map((conversation) => {
              const Channel = channelMeta[conversation.channel].icon;
              const isSelected = conversation.id === selectedId;
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => selectConversation(conversation.id)}
                    className={cn(
                      "flex w-full gap-3 px-3 py-3 text-left transition-colors",
                      isSelected ? "bg-primary-soft/60" : "hover:bg-muted/50",
                    )}
                  >
                    <Avatar className="size-9">
                      <AvatarFallback>
                        {initials(conversation.customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                          {conversation.customer.name}
                        </span>
                        <span className="shrink-0 text-[0.7rem] text-muted-foreground">
                          {relativeTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {conversation.subject}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground/80">
                        {conversation.lastMessage}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                          <Channel className="size-3" />
                          {channelMeta[conversation.channel].label}
                        </span>
                        {conversation.handler === "human" && (
                          <Badge variant="default" className="px-1.5 py-0 text-[0.65rem]">
                            Human
                          </Badge>
                        )}
                        {conversation.unread > 0 && (
                          <Badge variant="accent" className="ml-auto px-1.5 py-0 text-[0.65rem]">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  const threadPane = selected ? (
    loadingThread ? (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading conversation…
      </div>
    ) : (
      <ConversationThread
        conversation={selected}
        messages={messages}
        onSend={handleSend}
        onTakeOver={handleTakeOver}
        onStatus={handleStatus}
        onAssign={handleAssign}
        onBack={() => setSelectedId(null)}
        onToggleFullscreen={fullscreen ? exitFullscreen : () => setFullscreen(true)}
        isFullscreen={fullscreen}
        onToggleDetails={fullscreen ? () => setShowDetails((value) => !value) : undefined}
      />
    )
  ) : (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        icon={<Inbox />}
        title="Select a conversation"
        description="Choose a conversation from the list to view the full thread."
        className="border-0 bg-transparent"
      />
    </div>
  );

  const panes = (
    <div className="grid h-full min-h-0 w-full grid-cols-1 lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)_18rem]">
      <div className={cn("min-h-0", selected && "hidden lg:block")}>{listPane}</div>
      <div className={cn("min-h-0", !selected && "hidden lg:block")}>{threadPane}</div>
      <div className="hidden min-h-0 border-l border-border xl:block">
        {selected ? (
          <CustomerPanel conversation={selected} onUpdateOrderStatus={handleOrderStatus} />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
            Customer details appear here.
          </div>
        )}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        {panes}
        {showDetails && selected && (
          <>
            <button
              type="button"
              aria-label="Close customer details"
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 z-40 bg-slate-950/40 xl:hidden"
            />
            <div className="absolute inset-y-0 right-0 z-50 w-80 max-w-[85vw] border-l border-border bg-card xl:hidden">
              <CustomerPanel conversation={selected} onUpdateOrderStatus={handleOrderStatus} />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Every conversation across channels, AI and human. Open any thread in
          full screen for a focused chat experience.
        </p>
      </div>

      <Card className="flex h-[calc(100dvh-11rem)] min-h-[34rem] flex-col overflow-hidden">
        {panes}
      </Card>
    </div>
  );
}
