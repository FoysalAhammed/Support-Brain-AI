import { mockConversations } from "@/data/mock-conversations";
import { mockMessages } from "@/data/mock-messages";
import { sleep } from "@/lib/utils";
import type {
  Conversation,
  ConversationHandler,
  ConversationStatus,
  Customer,
  Message,
  OrderStatus,
} from "@/types/conversation";
import type { ChannelType } from "@/types/channel";

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

const STORAGE_KEY = "supportbrain.conversations.v1";
let counter = 0;

function nextId(prefix: string) {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ conversations, messages }),
    );
  } catch {
    // storage unavailable — the demo keeps running in memory
  }
}

function hydrate() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as {
      conversations?: Conversation[];
      messages?: Record<string, Message[]>;
    };
    if (Array.isArray(parsed.conversations) && parsed.conversations.length > 0) {
      conversations = parsed.conversations;
    }
    if (parsed.messages && typeof parsed.messages === "object") {
      for (const key of Object.keys(messages)) delete messages[key];
      Object.assign(messages, parsed.messages);
    }
  } catch {
    // ignore malformed storage
  }
}

hydrate();

export interface ConversationFilters {
  status?: ConversationStatus | "all";
  handler?: ConversationHandler | "all";
  channel?: string;
  unreadOnly?: boolean;
  query?: string;
}

export const conversationService = {
  async create(input: {
    channel?: ChannelType;
    customerName?: string;
    customerEmail?: string;
    subject?: string;
    firstMessage?: string;
    organizationId?: string;
    customerId?: string;
  }): Promise<{ conversation: Conversation; message: Message | null }> {
    await sleep(60);
    const now = new Date().toISOString();
    const channel = input.channel ?? "website";
    const conversationId = nextId("conv");
    const customer: Customer = {
      id: input.customerId ?? nextId("cus"),
      name: input.customerName ?? "Website visitor",
      email: input.customerEmail ?? "visitor@guest.supportbrain.ai",
      channel,
      firstSeenAt: now,
      totalConversations: 1,
      tags: ["widget"],
    };

    let message: Message | null = null;
    if (input.firstMessage) {
      message = {
        id: nextId("msg"),
        conversationId,
        role: "customer",
        content: input.firstMessage,
        createdAt: now,
        deliveryStatus: "delivered",
      };
    }

    const conversation: Conversation = {
      id: conversationId,
      organizationId: input.organizationId ?? "org_northwind",
      customerId: customer.id,
      customer,
      subject: input.subject ?? "Website chat",
      status: "open",
      handler: "ai",
      channel,
      priority: "normal",
      sentiment: "neutral",
      confidence: 0,
      unread: 0,
      messageCount: message ? 1 : 0,
      aiResolved: true,
      lastMessage: message?.content ?? "Conversation started",
      lastMessageAt: now,
      createdAt: now,
      tags: ["widget"],
    };

    conversations = [conversation, ...conversations];
    messages[conversationId] = message ? [message] : [];
    persist();
    return { conversation, message };
  },

  async findOrCreateWebsiteSession(
    sessionKey: string,
    input?: { customerName?: string; customerEmail?: string; subject?: string },
  ): Promise<{ conversation: Conversation; messages: Message[]; created: boolean }> {
    await sleep(30);
    const customerId = `cus_${sessionKey}`;
    const existing = conversations.find(
      (conversation) => conversation.customerId === customerId,
    );
    if (existing) {
      return {
        conversation: existing,
        messages: messages[existing.id] ?? [],
        created: false,
      };
    }
    const { conversation } = await this.create({
      ...input,
      customerId,
      subject: input?.subject ?? "Website widget chat",
    });
    return {
      conversation,
      messages: messages[conversation.id] ?? [],
      created: true,
    };
  },

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
    persist();
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
    persist();
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
    persist();
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
    persist();
    return conversations.find((conversation) => conversation.id === conversationId) ?? null;
  },

  async assign(conversationId: string, agentName: string): Promise<Conversation | null> {
    await sleep(160);
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, assignedTo: agentName, handler: "human" }
        : conversation,
    );
    persist();
    return conversations.find((conversation) => conversation.id === conversationId) ?? null;
  },

  async markRead(conversationId: string): Promise<void> {
    await sleep(20);
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation,
    );
    persist();
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
