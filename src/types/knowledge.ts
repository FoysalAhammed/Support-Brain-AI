import type { ID } from "./common";

export type KnowledgeSourceType = "website" | "facebook" | "document" | "database";

export type DatabaseEngine = "postgresql" | "mysql" | "mongodb" | "supabase";

export type KnowledgeSourceStatus =
  | "queued"
  | "processing"
  | "syncing"
  | "ready"
  | "failed";

export interface KnowledgeSource {
  id: ID;
  organizationId: ID;
  name: string;
  type: KnowledgeSourceType;
  url?: string;
  domain?: string;
  status: KnowledgeSourceStatus;
  pages: number;
  contentBlocks: number;
  chunks: number;
  embeddings: number;
  sizeKb: number;
  coverage: number;
  lastSyncedAt: string | null;
  createdAt: string;
  error?: string;
  agentIds: ID[];
  engine?: DatabaseEngine;
  host?: string;
  tables?: number;
  rows?: number;
}

export interface ExtractedSection {
  id: ID;
  sourceId: ID;
  pageTitle: string;
  heading: string;
  text: string;
  words: number;
}

export type ActivityKind =
  | "created"
  | "crawled"
  | "extracted"
  | "cleaned"
  | "chunked"
  | "embedded"
  | "indexed"
  | "synced"
  | "failed"
  | "tested";

export interface KnowledgeActivity {
  id: ID;
  sourceId: ID;
  kind: ActivityKind;
  message: string;
  at: string;
}

export interface RagRetrievedChunk {
  id: ID;
  sourceId: ID;
  label: string;
  kind: "page" | "faq" | "document" | "post";
  score: number;
  snippet: string;
}

export interface RagAnswer {
  id: ID;
  question: string;
  answer: string;
  confidence: number;
  latencyMs: number;
  usedKnowledge: boolean;
  needsHandoff: boolean;
  retrieved: RagRetrievedChunk[];
  stages: { label: string; detail: string }[];
}
