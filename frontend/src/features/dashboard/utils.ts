import { STATUS_COLORS } from "@/lib/constants";

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30";
}

export function getPendingDaysColor(days: number): string {
  if (days > 60) return "text-red-400";
  if (days > 30) return "text-orange-400";
  if (days > 14) return "text-yellow-400";
  return "text-green-400";
}

export function getPendingDaysBarWidth(days: number): number {
  return Math.min(100, Math.round((days / 90) * 100));
}

export function getUnderInvestigationCount(
  summary: { status: string; count: number }[] | undefined,
): number {
  return summary?.find((s) => s.status === "Under Investigation")?.count ?? 0;
}
