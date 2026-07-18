import api from "@/services/axios";
import type { APIResponse } from "@/types";
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

export const getDashboard = () =>
  api.get<APIResponse<DashboardStats>>("/analytics/dashboard");

export const getStatusSummary = () =>
  api.get<APIResponse<StatusSummary[]>>("/analytics/status-summary");

export const getCrimeTypes = () =>
  api.get<APIResponse<CrimeTypeSummary[]>>("/analytics/crime-type-summary");

export const getTrends = (months = 12, crimeType?: string) =>
  api.get<APIResponse<MonthlyTrend[]>>("/analytics/trends", {
    params: { months, ...(crimeType ? { crime_type: crimeType } : {}) },
  });

export const getHotspots = (topN = 10) =>
  api.get<APIResponse<HotspotEntry[]>>("/analytics/hotspots", {
    params: { top_n: topN },
  });

export const getPendingCases = (skip = 0, limit = 50) =>
  api.get<APIResponse<PendingCase[]>>("/analytics/pending-cases", {
    params: { skip, limit },
  });

export const getDistrictSummary = () =>
  api.get<APIResponse<DistrictSummary[]>>("/analytics/district-summary");

export const getRepeatOffenders = (minCases = 2) =>
  api.get<APIResponse<RepeatOffender[]>>("/analytics/repeat-offenders", {
    params: { min_cases: minCases },
  });
