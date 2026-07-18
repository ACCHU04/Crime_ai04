import api from "@/services/axios";
import type { AccusedSearchResult } from "@/types";

export const searchAccused = (name: string) =>
  api.get<AccusedSearchResult[]>("/accused/search", { params: { name } });
