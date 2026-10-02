import { mockAdminAnalytics, mockAnalytics } from "@/data/mock-analytics";
import { mockOrganizations } from "@/data/mock-organizations";
import { sleep } from "@/lib/utils";
import type { AdminOverview, AnalyticsOverview, DateRangeKey } from "@/types/analytics";

const rangeMultiplier: Record<DateRangeKey, number> = {
  today: 0.035,
  "7d": 0.23,
  "30d": 1,
  "90d": 2.9,
};

export const analyticsService = {
  async getOverview(range: DateRangeKey = "30d"): Promise<AnalyticsOverview> {
    await sleep(60);
    const multiplier = rangeMultiplier[range];
    const metrics = mockAnalytics.metrics.map((metric) =>
      metric.unit === "percent" || metric.id === "csat" || metric.unit === "seconds"
        ? metric
        : { ...metric, value: Math.round(metric.value * multiplier) },
    );
    const conversationsOverTime =
      range === "7d" || range === "today"
        ? mockAnalytics.conversationsOverTime
        : mockAnalytics.conversationsOverTime.map((point, index) => ({
            ...point,
            value: Math.round(point.value * 4 + index * 60),
            previous: Math.round((point.previous ?? 0) * 4),
          }));
    return { ...mockAnalytics, metrics, conversationsOverTime };
  },

  async getAdminOverview(): Promise<AdminOverview> {
    await sleep(60);
    return mockAdminAnalytics;
  },

  async listOrganizations() {
    await sleep(40);
    return mockOrganizations;
  },
};

export type AnalyticsService = typeof analyticsService;
