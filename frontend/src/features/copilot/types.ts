import type { Intent } from "@/types/chat";

export interface SqlQueryPayload {
  query: string;
  intent: {
    crime_type: string | null;
    district: string | null;
    fir_number: string | null;
    status: string | null;
    this_month: boolean;
    this_year: boolean;
    list_all: boolean;
  };
  sql: string;
  results: Record<string, unknown>[];
  count: number;
}

export interface AnalyticsPayload {
  type: "dashboard" | "hotspots" | "trends" | "repeat_offenders" | "pending_cases";
  data: unknown;
}

export interface GraphPayload {
  type: "full_network" | "person_network" | "common_accused";
  data: unknown;
}

export interface ChatBubble {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: Intent;
  payload?: Record<string, unknown>;
  isError?: boolean;
  timestamp: string;
}
