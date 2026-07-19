import type { Severity } from "../types";

interface OperationalHealthInput {
  totalCases: number;
  pendingCases: number;
  closedCases: number;
  convictedCases: number;
  topDistrict: string | null;
  topCrimeType: string | null;
  hotspotCount: number;
  repeatOffenderCount: number;
  pendingDaysAvg: number;
}

interface OperationalHealthResult {
  score: number;
  level: Severity;
  status: string;
  trend: number;
}

export function computeOperationalHealth(data: OperationalHealthInput): OperationalHealthResult {
  let score = 100;

  if (data.totalCases > 0) {
    score -= (data.pendingCases / data.totalCases) * 20;
    score -= (data.repeatOffenderCount / data.totalCases) * 30;
    score -= Math.min(data.pendingDaysAvg / 30, 1) * 15;
    if (data.convictedCases / data.totalCases < 0.1) score -= 15;
  }

  if (data.hotspotCount > 0) {
    score -= Math.min(data.hotspotCount / 10, 1) * 20;
  }

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const level: Severity =
    clamped >= 80 ? "low" : clamped >= 60 ? "medium" : clamped >= 40 ? "high" : "critical";

  const status =
    clamped >= 80 ? "Healthy" : clamped >= 60 ? "Needs Attention" : "Critical";

  const trend = data.totalCases > 0
    ? Math.round(((data.pendingCases / data.totalCases) * 100) - 50)
    : 0;

  return { score: clamped, level, status, trend };
}
