export type Intent =
  | "sql_query"
  | "analytics"
  | "graph"
  | "investigate"
  | "summarize"
  | "unknown";

export interface ChatRequest {
  query: string;
  case_data?: Record<string, unknown> | null;
  intent_hint?: Intent | null;
  session_id?: string | null;
}

export interface ChatResponse {
  intent: string;
  agent: string;
  payload: unknown;
  error: string | null;
  session_id: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: Intent;
  payload?: unknown;
  timestamp: string;
}
