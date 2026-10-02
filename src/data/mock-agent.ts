import type { AIAgent } from "@/types/agent";
import { ago } from "./time";

const ORG = "org_northwind";

export const mockAgent: AIAgent = {
  id: "agt_support",
  organizationId: ORG,
  name: "Northwind Assistant",
  avatarEmoji: "🧭",
  greeting: "Hi! I'm the Northwind Assistant. How can I help you today?",
  instructions:
    "You are the customer support assistant for Northwind Commerce, a home and lifestyle brand. Answer questions using only the connected knowledge sources. Be warm, concise and precise. Always state delivery windows, return windows and warranty terms accurately. If you are unsure or the customer is upset or asking about a specific order, offer to connect them with a human agent. Never invent product details or prices that are not in the knowledge base.",
  tone: "friendly",
  responseLength: "balanced",
  language: "English (US)",
  confidenceThreshold: 70,
  fallbackMessage:
    "I want to make sure you get an accurate answer, so let me connect you with a member of our team.",
  handoffEnabled: true,
  model: "supportbrain-pro",
  temperature: 0.3,
  status: "active",
  knowledgeSourceIds: ["src_website", "src_facebook"],
  channelIds: ["chn_website", "chn_email"],
  updatedAt: ago(180),
};

export const agentLanguages = [
  "English (US)",
  "English (UK)",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Bengali",
  "Hindi",
  "Japanese",
];

export const agentModelOptions = [
  {
    id: "supportbrain-pro" as const,
    name: "SupportBrain Pro",
    description: "Balanced quality and latency, tuned for support RAG.",
    badge: "Recommended",
  },
  {
    id: "gpt-4o" as const,
    name: "GPT-4o",
    description: "Strong general reasoning and multilingual fluency.",
  },
  {
    id: "claude-3-7-sonnet" as const,
    name: "Claude 3.7 Sonnet",
    description: "Careful, nuanced answers for sensitive conversations.",
  },
  {
    id: "grok-3" as const,
    name: "Grok 3",
    description: "Fast responses with a conversational tone.",
  },
];
