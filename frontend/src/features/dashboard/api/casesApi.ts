import api from "@/services/axios";
import type { Case } from "@/types";

export const getRecentCases = (limit = 5) =>
  api.get<Case[]>("/cases/", { params: { skip: 0, limit } });

export const getCases = (skip = 0, limit = 100) =>
  api.get<Case[]>("/cases/", { params: { skip, limit } });

export const getCaseById = (id: number) =>
  api.get<Case>(`/cases/${id}`);
