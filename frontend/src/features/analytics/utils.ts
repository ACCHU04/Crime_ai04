import { STATUS_COLORS } from "@/lib/constants";

export const PIE_COLORS = [
  "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4",
];

export const BAR_COLORS = [
  "#3b82f6", "#06b6d4", "#14b8a6", "#22c55e", "#84cc16",
  "#eab308", "#f97316", "#ef4444", "#ec4899", "#8b5cf6",
];

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30";
}

export function getPercentage(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}
