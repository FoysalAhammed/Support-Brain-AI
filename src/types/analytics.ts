import type { TrendPoint } from "./common";
import type { ChannelType } from "./channel";

export type DateRangeKey = "today" | "7d" | "30d" | "90d";

export interface Metric {
  id: string;
  label: string;
  value: number;
  unit?: "percent" | "seconds" | "number" | "currency";
  change: number;
  trend: "up" | "down" | "flat";
  spark: number[];
  hint?: string;
}

export interface NamedValue {
  name: string;
  value: number;
  color?: string;
}

export interface AnalyticsOverview {
  metrics: Metric[];
  conversationsOverTime: TrendPoint[];
  aiVsHuman: NamedValue[];
  channelUsage: (NamedValue & { channel: ChannelType })[];
  responseTime: TrendPoint[];
  satisfaction: NamedValue[];
  knowledgeUsage: NamedValue[];
  topQuestions: { question: string; count: number; resolved: number }[];
}

export interface AdminOverview {
  metrics: Metric[];
  signups: TrendPoint[];
  planDistribution: NamedValue[];
  usageByDay: TrendPoint[];
  systemHealth: {
    service: string;
    status: "operational" | "degraded" | "down";
    uptime: number;
    latencyMs: number;
  }[];
}
