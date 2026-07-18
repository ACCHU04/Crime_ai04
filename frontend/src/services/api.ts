import api from "./axios";
import type { APIResponse, PaginationParams } from "@/types";
import type { HealthResponse } from "@/types";
import type { Case, CaseCreate, CaseUpdate } from "@/types";
import type { AccusedByCaseResponse, AccusedSearchResult } from "@/types";
import type {
  DashboardStats,
  HotspotEntry,
  MonthlyTrend,
  PendingCase,
  CrimeTypeSummary,
  StatusSummary,
  DistrictSummary,
} from "@/types";
import type { GraphResult } from "@/types";
import type { ChatRequest, ChatResponse } from "@/types";

export const healthApi = {
  check: () => api.get<HealthResponse>("/health"),
};

export const casesApi = {
  list: (params?: PaginationParams) =>
    api.get<Case[]>("/cases/", { params }),
  get: (id: number) => api.get<Case>(`/cases/${id}`),
  create: (data: CaseCreate) => api.post<Case>("/cases/", data),
  update: (id: number, data: CaseUpdate) =>
    api.patch<Case>(`/cases/${id}`, data),
  remove: (id: number) => api.delete(`/cases/${id}`),
};

export const accusedApi = {
  byCase: (caseId: number) =>
    api.get<AccusedByCaseResponse>(`/accused/by-case/${caseId}`),
  search: (name: string) =>
    api.get<AccusedSearchResult[]>("/accused/search", { params: { name } }),
};

export const analyticsApi = {
  dashboard: () => api.get<APIResponse<DashboardStats>>("/analytics/dashboard"),
  hotspots: (topN = 10) =>
    api.get<APIResponse<HotspotEntry[]>>("/analytics/hotspots", {
      params: { top_n: topN },
    }),
  trends: (months = 12, crimeType?: string) =>
    api.get<APIResponse<MonthlyTrend[]>>("/analytics/trends", {
      params: { months, crime_type: crimeType },
    }),
  repeatOffenders: (minCases = 2) =>
    api.get<APIResponse<{ accused_id: number; full_name: string; alias: string | null; case_count: number; cases: string[]; status: string }[]>>(
      "/analytics/repeat-offenders",
      { params: { min_cases: minCases } },
    ),
  pendingCases: (skip = 0, limit = 50) =>
    api.get<APIResponse<PendingCase[]>>("/analytics/pending-cases", {
      params: { skip, limit },
    }),
  crimeTypeSummary: () =>
    api.get<APIResponse<CrimeTypeSummary[]>>("/analytics/crime-type-summary"),
  statusSummary: () =>
    api.get<APIResponse<StatusSummary[]>>("/analytics/status-summary"),
  districtSummary: () =>
    api.get<APIResponse<DistrictSummary[]>>("/analytics/district-summary"),
};

export const graphApi = {
  network: () => api.get<APIResponse<GraphResult>>("/graph/network"),
  associates: (personName: string) =>
    api.get<APIResponse<GraphResult>>(`/graph/associates/${encodeURIComponent(personName)}`),
  commonAccused: () =>
    api.get<APIResponse<GraphResult>>("/graph/common-accused"),
};

export const chatApi = {
  send: (data: ChatRequest) => api.post<ChatResponse>("/chat/", data),
};
