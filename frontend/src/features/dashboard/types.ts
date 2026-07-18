import type { DashboardStats, HotspotEntry, MonthlyTrend, PendingCase, CrimeTypeSummary, StatusSummary, AccusedSearchResult, Case } from "@/types";

export type { DashboardStats, HotspotEntry, MonthlyTrend, PendingCase, CrimeTypeSummary, StatusSummary, AccusedSearchResult, Case };

export interface DashboardData {
  dashboard: DashboardStats | undefined;
  statusSummary: StatusSummary[] | undefined;
  crimeTypes: CrimeTypeSummary[] | undefined;
  trends: MonthlyTrend[] | undefined;
  hotspots: HotspotEntry[] | undefined;
  recentCases: Case[] | undefined;
  pendingCases: PendingCase[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export interface AccusedSearchData {
  query: string;
  setQuery: (q: string) => void;
  results: AccusedSearchResult[];
  isLoading: boolean;
  isError: boolean;
}
