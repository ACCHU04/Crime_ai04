import type { MonthlyTrend } from "@/types/analytics";

export function computeTrendDelta(trends: MonthlyTrend[] | undefined): number {
  if (!trends || trends.length < 2) return 0;
  const current = trends[trends.length - 1]?.count ?? 0;
  const previous = trends[trends.length - 2]?.count ?? 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
