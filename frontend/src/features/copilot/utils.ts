import type { Intent } from "@/types/chat";

export function getIntentColor(intent: Intent): string {
  const colors: Record<Intent, string> = {
    sql_query: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    analytics: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    graph: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    investigate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    summarize: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    unknown: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };
  return colors[intent] ?? colors.unknown;
}

export function normalizeResponse(
  intent: string,
  _agent: string,
  payload: unknown,
): { summary: string; intent: Intent } {
  const typedIntent = (intent ?? "unknown") as Intent;

  return { summary: buildSummary(typedIntent, payload), intent: typedIntent };
}

function buildSummary(intent: Intent, payload: unknown): string {
  if (!payload || typeof payload !== "object") return "No data returned.";

  switch (intent) {
    case "sql_query": {
      const p = payload as { count?: number; results?: unknown[]; intent?: Record<string, unknown> };
      const count = p.count ?? p.results?.length ?? 0;
      const filters: string[] = [];
      if (p.intent?.crime_type) filters.push(`crime type: ${p.intent.crime_type}`);
      if (p.intent?.district) filters.push(`district: ${p.intent.district}`);
      if (p.intent?.status) filters.push(`status: ${p.intent.status}`);
      if (p.intent?.fir_number) filters.push(`FIR: ${p.intent.fir_number}`);
      const filterText = filters.length > 0 ? ` (${filters.join(", ")})` : "";
      return `Found ${count} case${count === 1 ? "" : "s"}${filterText}.`;
    }

    case "analytics": {
      const p = payload as { type?: string };
      const type = p.type ?? "data";
      const labels: Record<string, string> = {
        dashboard: "Here's the dashboard overview.",
        hotspots: "Here are the crime hotspots.",
        trends: "Here's the monthly crime trend.",
        repeat_offenders: "Here are the repeat offenders.",
        pending_cases: "Here are the pending cases.",
      };
      return labels[type] ?? "Here's the analytics data.";
    }

    case "graph": {
      const p = payload as { type?: string };
      const type = p.type ?? "data";
      const labels: Record<string, string> = {
        full_network: "Here's the full crime network graph.",
        person_network: "Here's the person's network connections.",
        common_accused: "Here's the repeat offender network.",
      };
      return labels[type] ?? "Here's the network data.";
    }

    case "investigate": {
      const p = payload as { summary?: string };
      return p.summary ?? "Investigation analysis complete.";
    }

    case "summarize": {
      const p = payload as { summary?: string };
      return p.summary ?? "Summary generated.";
    }

    default:
      return "Could not determine intent. Try rephrasing your query.";
  }
}
