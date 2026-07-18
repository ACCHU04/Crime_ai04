import api from "@/services/axios";
import type { AccusedByCaseResponse } from "@/types";

export const getAccusedByCase = (caseId: number) =>
  api.get<AccusedByCaseResponse>(`/accused/by-case/${caseId}`);
