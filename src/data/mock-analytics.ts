import type { AdminOverview, AnalyticsOverview, Metric } from "@/types/analytics";
import type { TrendPoint } from "@/types/common";

function series(labels: string[], base: number, variance: number, seed = 1): TrendPoint[] {
  return labels.map((label, index) => {
    const wave = Math.sin((index + seed) * 1.1) * variance * 0.5;
    const drift = index * (variance * 0.12);
    const value = Math.round(base + wave + drift + ((index * 37 * seed) % variance));
    return { label, value, previous: Math.round(value * (0.82 + ((index % 5) * 0.03))) };
  });
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

export const conversationsMetricBase: Metric[] = [
  {
    id: "conversations",
    label: "Total Conversations",
    value: 12482,
    change: 12.4,
    trend: "up",
    spark: [420, 512, 468, 590, 640, 612, 720, 764],
    hint: "vs. previous 30 days",
  },
  {
    id: "resolution",
    label: "AI Resolution Rate",
    value: 87.4,
    unit: "percent",
    change: 3.1,
    trend: "up",
    spark: [78, 80, 82, 81, 84, 85, 86, 87.4],
    hint: "resolved without a human",
  },
  {
    id: "response",
    label: "Avg. Response Time",
    value: 1.8,
    unit: "seconds",
    change: -8.6,
    trend: "down",
    spark: [2.9, 2.6, 2.4, 2.3, 2.1, 2.0, 1.9, 1.8],
    hint: "first AI response",
  },
  {
    id: "handoff",
    label: "Human Handoff Rate",
    value: 12.6,
    unit: "percent",
    change: -4.2,
    trend: "down",
    spark: [19, 18, 17, 16, 15, 14, 13, 12.6],
    hint: "escalated to an agent",
  },
];

export const mockAnalytics: AnalyticsOverview = {
  metrics: [
    ...conversationsMetricBase,
    {
      id: "csat",
      label: "Customer Satisfaction",
      value: 4.7,
      change: 2.4,
      trend: "up",
      spark: [4.2, 4.3, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7],
      hint: "average rating out of 5",
    },
  ],
  conversationsOverTime: series(dayLabels, 620, 180, 2),
  aiVsHuman: [
    { name: "AI resolved", value: 10906, color: "var(--chart-1)" },
    { name: "Human resolved", value: 1576, color: "var(--chart-4)" },
  ],
  channelUsage: [
    { name: "Website", value: 8120, color: "var(--chart-1)", channel: "website" },
    { name: "Facebook", value: 1840, color: "var(--chart-2)", channel: "facebook" },
    { name: "WhatsApp", value: 1420, color: "var(--chart-3)", channel: "whatsapp" },
    { name: "Email", value: 690, color: "var(--chart-4)", channel: "email" },
    { name: "Voice", value: 412, color: "var(--chart-5)", channel: "voice" },
  ],
  responseTime: series(dayLabels, 2.4, 1.1, 5),
  satisfaction: [
    { name: "5 stars", value: 68, color: "var(--chart-3)" },
    { name: "4 stars", value: 21, color: "var(--chart-1)" },
    { name: "3 stars", value: 7, color: "var(--chart-4)" },
    { name: "1-2 stars", value: 4, color: "var(--chart-5)" },
  ],
  knowledgeUsage: [
    { name: "Shipping & Delivery", value: 2841, color: "var(--chart-1)" },
    { name: "Refund Policy", value: 2130, color: "var(--chart-2)" },
    { name: "Membership", value: 1642, color: "var(--chart-3)" },
    { name: "Warranty", value: 1204, color: "var(--chart-4)" },
    { name: "FAQ", value: 986, color: "var(--chart-5)" },
  ],
  topQuestions: [
    { question: "Where is my order?", count: 1284, resolved: 1120 },
    { question: "What is your return policy?", count: 962, resolved: 901 },
    { question: "How long does shipping take?", count: 874, resolved: 843 },
    { question: "Do you ship internationally?", count: 631, resolved: 602 },
    { question: "How do I cancel an order?", count: 512, resolved: 388 },
    { question: "Is assembly included?", count: 304, resolved: 291 },
  ],
};

export const mockAdminAnalytics: AdminOverview = {
  metrics: [
    {
      id: "organizations",
      label: "Organizations",
      value: 1284,
      change: 6.2,
      trend: "up",
      spark: [980, 1020, 1080, 1140, 1190, 1230, 1260, 1284],
      hint: "active tenants",
    },
    {
      id: "users",
      label: "Active Users",
      value: 18420,
      change: 9.4,
      trend: "up",
      spark: [14200, 15100, 15900, 16500, 17200, 17800, 18100, 18420],
      hint: "last 30 days",
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      value: 1096,
      change: 4.1,
      trend: "up",
      spark: [890, 920, 960, 1000, 1030, 1060, 1080, 1096],
      hint: "paying tenants",
    },
    {
      id: "conversations",
      label: "Total Conversations",
      value: 2840000,
      change: 14.8,
      trend: "up",
      spark: [1.9, 2.1, 2.2, 2.4, 2.5, 2.7, 2.8, 2.84],
      hint: "platform wide",
    },
    {
      id: "aiUsage",
      label: "AI Usage",
      value: 12.4,
      change: 18.2,
      trend: "up",
      spark: [7.2, 8.1, 9.0, 9.8, 10.6, 11.4, 12.0, 12.4],
      hint: "million messages / month",
    },
    {
      id: "uptime",
      label: "System Uptime",
      value: 99.98,
      unit: "percent",
      change: 0.02,
      trend: "up",
      spark: [99.94, 99.95, 99.96, 99.97, 99.97, 99.98, 99.98, 99.98],
      hint: "rolling 90 days",
    },
  ],
  signups: series(monthLabels, 82, 46, 3),
  planDistribution: [
    { name: "Starter", value: 612, color: "var(--chart-2)" },
    { name: "Growth", value: 384, color: "var(--chart-1)" },
    { name: "Business", value: 246, color: "var(--chart-3)" },
    { name: "Enterprise", value: 42, color: "var(--chart-5)" },
  ],
  usageByDay: series(dayLabels, 380000, 140000, 7),
  systemHealth: [
    { service: "API Gateway", status: "operational", uptime: 99.99, latencyMs: 84 },
    { service: "RAG Retrieval", status: "operational", uptime: 99.97, latencyMs: 312 },
    { service: "Embedding Workers", status: "operational", uptime: 99.95, latencyMs: 640 },
    { service: "Crawler Fleet", status: "degraded", uptime: 99.42, latencyMs: 1820 },
    { service: "Messaging Queue", status: "operational", uptime: 99.99, latencyMs: 42 },
    { service: "Analytics Pipeline", status: "operational", uptime: 99.91, latencyMs: 210 },
  ],
};
