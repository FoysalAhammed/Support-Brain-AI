import type { ID } from "./common";
import type { ChannelType } from "./channel";

export type ConversationStatus = "open" | "pending" | "resolved" | "snoozed";
export type ConversationHandler = "ai" | "human";
export type MessageRole = "customer" | "ai" | "agent" | "system";
export type Sentiment = "positive" | "neutral" | "negative";
export type Priority = "low" | "normal" | "high" | "urgent";

export type OrderStatus =
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export type MessageDeliveryStatus = "sent" | "delivered" | "read";

export interface MessageSource {
  id: ID;
  label: string;
  kind: "page" | "faq" | "document" | "post";
  score: number;
}

export interface MessageAttachment {
  id: ID;
  name: string;
  kind: "image" | "file";
  url?: string;
}

export interface Message {
  id: ID;
  conversationId: ID;
  role: MessageRole;
  content: string;
  createdAt: string;
  confidence?: number;
  latencyMs?: number;
  deliveryStatus?: MessageDeliveryStatus;
  sources?: MessageSource[];
  attachments?: MessageAttachment[];
  authorName?: string;
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  company?: string;
  phone?: string;
  channel: ChannelType;
  firstSeenAt: string;
  totalConversations: number;
  lifetimeValue?: number;
  tags: string[];
  notes?: string;
}

export interface Conversation {
  id: ID;
  organizationId: ID;
  customerId: ID;
  customer: Customer;
  subject: string;
  status: ConversationStatus;
  handler: ConversationHandler;
  channel: ChannelType;
  priority: Priority;
  sentiment: Sentiment;
  confidence: number;
  unread: number;
  messageCount: number;
  aiResolved: boolean;
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  assignedTo?: string;
  orderStatus?: OrderStatus;
  tags: string[];
}
