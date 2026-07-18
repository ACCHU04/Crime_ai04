import { NODE_COLORS } from "@/lib/constants";

export const EDGE_COLORS: Record<string, string> = {
  occurred_in: "#f59e0b",
  accused_in: "#ef4444",
  victim_of: "#22c55e",
  assigned_to: "#8b5cf6",
  connected: "#64748b",
};

export function getNodeColor(type: string): string {
  return NODE_COLORS[type] ?? NODE_COLORS.unknown;
}

export function getNodeRadius(type: string): number {
  const radii: Record<string, number> = {
    case: 8,
    accused: 7,
    victim: 6,
    district: 9,
    officer: 6,
  };
  return radii[type] ?? 5;
}

export function getEdgeColor(type: string): string {
  return EDGE_COLORS[type] ?? EDGE_COLORS.connected;
}

export function parseNodeId(id: string): { type: string; numericId: number | null } {
  const dashIndex = id.indexOf("-");
  if (dashIndex === -1) return { type: "unknown", numericId: null };
  const type = id.substring(0, dashIndex);
  const numStr = id.substring(dashIndex + 1);
  const numericId = parseInt(numStr, 10);
  return { type, numericId: isNaN(numericId) ? null : numericId };
}
