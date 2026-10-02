import type { ID } from "./common";
import type { KnowledgeSourceType } from "./knowledge";

export type CrawlStage =
  | "DETECTING"
  | "CRAWLING"
  | "EXTRACTING"
  | "CLEANING"
  | "CHUNKING"
  | "EMBEDDING"
  | "INDEXING"
  | "READY";

export type CrawlStageStatus = "pending" | "processing" | "completed" | "failed";

export interface CrawlStageState {
  stage: CrawlStage;
  label: string;
  description: string;
  status: CrawlStageStatus;
  progress: number;
  detail?: string;
}

export interface SourceDetection {
  type: KnowledgeSourceType | "invalid";
  url: string;
  domain: string;
  name: string;
  valid: boolean;
  message: string;
  estimatedPages: number;
  estimatedChunks: number;
}

export type DiscoveredPageStatus =
  | "pending"
  | "fetched"
  | "extracted"
  | "skipped"
  | "failed";

export interface DiscoveredPage {
  id: ID;
  title: string;
  path: string;
  status: DiscoveredPageStatus;
  words: number;
  blocks: number;
}

export interface ChunkPreview {
  id: ID;
  index: number;
  pageTitle: string;
  tokens: number;
  text: string;
  score?: number;
}

export interface EmbeddingStatus {
  total: number;
  embedded: number;
  dimensions: number;
  indexName: string;
  indexStatus: "empty" | "building" | "ready";
  vectorsPerSecond: number;
}

export type CrawlJobStatus = "running" | "completed" | "failed";

export interface CrawlJob {
  id: ID;
  url: string;
  type: KnowledgeSourceType;
  sourceName: string;
  domain: string;
  status: CrawlJobStatus;
  progress: number;
  stages: CrawlStageState[];
  discoveredPages: DiscoveredPage[];
  chunks: ChunkPreview[];
  embedding: EmbeddingStatus;
  pagesTotal: number;
  pagesCrawled: number;
  contentBlocks: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
}
