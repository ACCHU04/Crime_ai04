import api from "@/services/axios";
import type { APIResponse } from "@/types";
import type { GraphResult } from "../types";

export const getAssociates = (personName: string) =>
  api.get<APIResponse<GraphResult>>(`/graph/associates/${encodeURIComponent(personName)}`);

export const getNetwork = () =>
  api.get<APIResponse<GraphResult>>("/graph/network");
