import type { ID } from "./common";

export type AgentTone = "professional" | "friendly" | "concise" | "enthusiastic";
export type ResponseLength = "short" | "balanced" | "detailed";
export type ModelId = "supportbrain-pro" | "gpt-4o" | "claude-3-7-sonnet" | "grok-3";
export type AgentStatus = "active" | "paused" | "training";

export interface AIAgent {
  id: ID;
  organizationId: ID;
  name: string;
  avatarEmoji: string;
  greeting: string;
  instructions: string;
  tone: AgentTone;
  responseLength: ResponseLength;
  language: string;
  confidenceThreshold: number;
  fallbackMessage: string;
  handoffEnabled: boolean;
  model: ModelId;
  temperature: number;
  status: AgentStatus;
  knowledgeSourceIds: ID[];
  channelIds: ID[];
  updatedAt: string;
}

export interface RetrievedSource {
  id: ID;
  sourceId: ID;
  name: string;
  type: string;
  score: number;
  snippet: string;
}

export interface AgentReply {
  id: ID;
  content: string;
  confidence: number;
  latencyMs: number;
  retrieved: RetrievedSource[];
  model: ModelId;
  usedKnowledge: boolean;
}

export interface AgentTestTurn {
  id: ID;
  role: "user" | "agent";
  content: string;
  at: string;
  reply?: AgentReply;
}
