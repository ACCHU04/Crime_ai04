export const APP_NAME = "Crime Intelligence Platform";
export const APP_VERSION = "1.0.0";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  INVESTIGATION: "/investigation",
  ANALYTICS: "/analytics",
  NETWORK: "/network",
  COPILOT: "/copilot",
  SETTINGS: "/settings",
} as const;

export const STATUS_COLORS: Record<string, string> = {
  "Under Investigation": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Chargesheet Filed": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Closed: "bg-green-500/20 text-green-400 border-green-500/30",
  "Pending Trial": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Convicted: "bg-red-500/20 text-red-400 border-red-500/30",
  Acquitted: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export const INTENT_LABELS: Record<string, string> = {
  sql_query: "SQL Query",
  analytics: "Analytics",
  graph: "Network Graph",
  investigate: "Investigation",
  summarize: "Summarize",
  unknown: "Unknown",
};

export const NODE_COLORS: Record<string, string> = {
  case: "#3b82f6",
  accused: "#ef4444",
  victim: "#22c55e",
  district: "#f59e0b",
  officer: "#8b5cf6",
  unknown: "#64748b",
};

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

export function getSeverityFromScore(score: number): "critical" | "high" | "medium" | "low" {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  return "low";
}
