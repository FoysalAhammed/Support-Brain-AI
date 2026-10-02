"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { conversationService } from "@/services/conversations";
import type {
  Conversation,
  ConversationStatus,
  Message,
  OrderStatus,
} from "@/types/conversation";
import { ConversationThread } from "./conversation-thread";
import { CustomerPanel } from "./customer-panel";

export function ConversationView({ conversationId }: { conversationId: string }) {
  const [conversation, setConversation] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([
      conversationService.get(conversationId),
      conversationService.getMessages(conversationId),
    ]).then(([loadedConversation, loadedMessages]) => {
      if (!mounted) return;
      setConversation(loadedConversation);
      setMessages(loadedMessages);
      setLoading(false);
      conversationService.markRead(conversationId);
    });
    return () => {
      mounted = false;
    };
  }, [conversationId]);

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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-[32rem] w-full" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <EmptyState
        icon={<Inbox />}
        title="Conversation not found"
        description="This conversation may have been removed."
        action={
          <Button asChild>
            <Link href="/dashboard/inbox">Back to inbox</Link>
          </Button>
        }
      />
    );
  }

  const handleSend = async (content: string) => {
    const role = conversation.handler === "human" ? "agent" : "ai";
    const message = await conversationService.sendMessage(
      conversation.id,
      content,
      role,
      role === "agent" ? (conversation.assignedTo ?? "You") : undefined,
    );
    setMessages((current) => [...current, message]);
    setConversation((current) =>
      current
        ? {
            ...current,
            lastMessage: content,
            lastMessageAt: message.createdAt,
            messageCount: current.messageCount + 1,
          }
        : current,
    );
  };

  const handleTakeOver = async () => {
    const updated = await conversationService.takeOver(conversation.id, "You");
    if (updated) setConversation(updated);
    setMessages(await conversationService.getMessages(conversation.id));
  };

  const handleStatus = async (status: ConversationStatus) => {
    const updated = await conversationService.setStatus(conversation.id, status);
    if (updated) setConversation(updated);
  };

  const handleAssign = async (name: string) => {
    const updated = await conversationService.assign(conversation.id, name);
    if (updated) setConversation(updated);
  };

  const handleOrderStatus = async (status: OrderStatus) => {
    const updated = await conversationService.setOrderStatus(conversation.id, status);
    if (updated) setConversation(updated);
  };

  const thread = (
    <ConversationThread
      conversation={conversation}
      messages={messages}
      onSend={handleSend}
      onTakeOver={handleTakeOver}
      onStatus={handleStatus}
      onAssign={handleAssign}
      onToggleFullscreen={() => setFullscreen((value) => !value)}
      isFullscreen={fullscreen}
      onToggleDetails={fullscreen ? () => setShowDetails((value) => !value) : undefined}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="grid h-full min-h-0 w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-h-0">{thread}</div>
          <div className="hidden min-h-0 border-l border-border lg:block">
            <CustomerPanel conversation={conversation} onUpdateOrderStatus={handleOrderStatus} />
          </div>
        </div>
        {showDetails && (
          <>
            <button
              type="button"
              aria-label="Close customer details"
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 z-40 bg-slate-950/40 lg:hidden"
            />
            <div className="absolute inset-y-0 right-0 z-50 w-80 max-w-[85vw] border-l border-border bg-card lg:hidden">
              <CustomerPanel conversation={conversation} />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="lg:hidden">
        <Link href="/dashboard/inbox">
          <ArrowLeft />
          Back to inbox
        </Link>
      </Button>

      <Card className="grid h-[calc(100dvh-11rem)] min-h-[34rem] overflow-hidden lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-h-0">{thread}</div>
        <div className="hidden min-h-0 border-l border-border lg:block">
          <CustomerPanel conversation={conversation} onUpdateOrderStatus={handleOrderStatus} />
        </div>
      </Card>
    </div>
  );
}
