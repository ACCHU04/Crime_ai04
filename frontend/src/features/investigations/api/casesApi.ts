import api from "@/services/axios";
import type { Case } from "@/types";
import type { CaseReport, CaseSummary, TimelineData } from "../types";

export const getCaseById = (id: number) =>
  api.get<Case>(`/cases/${id}`);

export const getCaseReport = (id: number) =>
  api.get<CaseReport>(`/cases/${id}/report`);

export const getCaseTimeline = (id: number) =>
  api.get<TimelineData>(`/cases/${id}/timeline`);

export const getCaseVictims = (id: number) =>
  api.get(`/cases/${id}/victims`);

export const summarizeCase = (id: number) =>
  api.post<CaseSummary>(`/cases/${id}/summarize`);

export const getAllCases = (skip = 0, limit = 100) =>
  api.get<Case[]>("/cases/", { params: { skip, limit } });
