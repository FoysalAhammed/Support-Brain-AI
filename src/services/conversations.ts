import { mockConversations } from "@/data/mock-conversations";
import { mockMessages } from "@/data/mock-messages";
import { sleep } from "@/lib/utils";
import type {
  Conversation,
  ConversationHandler,
  ConversationStatus,
  Message,
  OrderStatus,
} from "@/types/conversation";

const DEFAULT_ORDER_STATUS: Record<string, OrderStatus> = {
  conv_1001: "out_for_delivery",
  conv_1002: "delivered",
  conv_1003: "processing",
  conv_1004: "shipped",
  conv_1005: "delivered",
  conv_1006: "delivered",
  conv_1007: "processing",
  conv_1008: "shipped",
  conv_1009: "delivered",
  conv_1010: "delivered",
  conv_1011: "processing",
  conv_1012: "cancelled",
};

let conversations: Conversation[] = mockConversations.map((conversation) => ({
  ...conversation,
  orderStatus:
    conversation.orderStatus ?? DEFAULT_ORDER_STATUS[conversation.id] ?? "processing",
}));
const messages: Record<string, Message[]> = { ...mockMessages };

export interface ConversationFilters {
  status?: ConversationStatus | "all";
  handler?: ConversationHandler | "all";
  channel?: string;
  unreadOnly?: boolean;
  query?: string;
}

export const conversationService = {
  async list(filters: ConversationFilters = {}): Promise<Conversation[]> {
    await sleep(40);
    return conversations.filter((conversation) => {
      if (filters.status && filters.status !== "all" && conversation.status !== filters.status) {
        return false;
      }
      if (filters.handler && filters.handler !== "all" && conversation.handler !== filters.handler) {
        return false;
      }
      if (filters.channel && filters.channel !== "all" && conversation.channel !== filters.channel) {
        return false;
      }
      if (filters.unreadOnly && conversation.unread === 0) return false;
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const haystack = [
          conversation.customer.name,
          conversation.subject,
          conversation.lastMessage,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  },

  async get(id: string): Promise<Conversation | null> {
    await sleep(30);
    return conversations.find((conversation) => conversation.id === id) ?? null;
  },

  async getMessages(id: string): Promise<Message[]> {
    await sleep(40);
    return messages[id] ?? [];
  },

  async sendMessage(
    conversationId: string,
    content: string,
    role: Message["role"] = "agent",
    authorName?: string,
  ): Promise<Message> {
    await sleep(180);
    const message: Message = {
      id: `msg_${Date.now().toString(36)}`,
      conversationId,
      role,
      content,
      createdAt: new Date().toISOString(),
      authorName,
    };
    messages[conversationId] = [...(messages[conversationId] ?? []), message];
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            lastMessage: content,
            lastMessageAt: message.createdAt,
            messageCount: conversation.messageCount + 1,
          }
        : conversation,
    );
    return message;
  },

  async takeOver(conversationId: string, agentName = "You"): Promise<Conversation | null> {
    await sleep(220);
    const systemMessage: Message = {
      id: `msg_${Date.now().toString(36)}`,
      conversationId,
      role: "system",
      content: `Human agent joined the conversation.`,
      createdAt: new Date().toISOString(),
    };
    messages[conversationId] = [...(messages[conversationId] ?? []), systemMessage];
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            handler: "human",
            status: "open",
            assignedTo: agentName,
            unread: 0,
          }
        : conversation,
    );
    return conversations.find((conversation) => conversation.id === conversationId) ?? null;
  },

  async setStatus(
    conversationId: string,
    status: ConversationStatus,
  ): Promise<Conversation | null> {
    await sleep(160);
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, status, unread: status === "resolved" ? 0 : conversation.unread }
        : conversation,
    );
    return conversations.find((conversation) => conversation.id === conversationId) ?? null;
  },

  async setOrderStatus(
    conversationId: string,
    orderStatus: OrderStatus,
  ): Promise<Conversation | null> {
    await sleep(140);
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, orderStatus }
        : conversation,
    );
    return conversations.find((conversation) => conversation.id === conversationId) ?? null;
  },

  async assign(conversationId: string, agentName: string): Promise<Conversation | null> {
    await sleep(160);
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, assignedTo: agentName, handler: "human" }
        : conversation,
    );
    return conversations.find((conversation) => conversation.id === conversationId) ?? null;
  },

  async markRead(conversationId: string): Promise<void> {
    await sleep(20);
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation,
    );
  },

  async stats() {
    await sleep(20);
    return {
      total: conversations.length,
      unread: conversations.reduce((sum, c) => sum + c.unread, 0),
      open: conversations.filter((c) => c.status === "open").length,
      aiHandled: conversations.filter((c) => c.handler === "ai").length,
      humanHandled: conversations.filter((c) => c.handler === "human").length,
    };
  },
};

export type ConversationService = typeof conversationService;
