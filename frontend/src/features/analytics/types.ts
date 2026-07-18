import type {
  DashboardStats,
  HotspotEntry,
  MonthlyTrend,
  PendingCase,
  CrimeTypeSummary,
  StatusSummary,
  DistrictSummary,
  RepeatOffender,
} from "@/types";

export type {
  DashboardStats,
  HotspotEntry,
  MonthlyTrend,
  PendingCase,
  CrimeTypeSummary,
  StatusSummary,
  DistrictSummary,
  RepeatOffender,
};

export interface AnalyticsFilters {
  crimeType: string | null;
  months: number;
  topN: number;
  minCases: number;
}
