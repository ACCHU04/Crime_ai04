import type { IntelligenceResult } from "../types";
import type { HotspotEntry, MonthlyTrend, PendingCase } from "@/types/analytics";
import { computePatternDetection } from "../utils/patternDetection";

export function buildAnalyticsIntelligence(
  hotspots: HotspotEntry[] | undefined,
  trends: MonthlyTrend[] | undefined,
  pendingCases: PendingCase[] | undefined,
  filters: { crimeType?: string; district?: string; year?: number } | undefined
): IntelligenceResult[] {
  const results: IntelligenceResult[] = [];

  if (hotspots && hotspots.length > 0) {
    const topHotspot = hotspots[0];
    const pattern = computePatternDetection({
      crimeType: filters?.crimeType || "",
      district: topHotspot?.districtName || "",
      similarCasesInWindow: topHotspot?.crimeCount ?? 0,
      timeWindowHours: 168,
      distanceKm: 10,
    });

    results.push({
      title: "Geographic Pattern",
      severity: pattern.level,
      confidence: pattern.confidence,
      summary: `${hotspots.length} hotspot districts identified — ${
        pattern.level === "high" ? "cluster pattern detected" : "within normal range"
      }`,
      insights: [
        { label: "Hotspot Districts", value: hotspots.length, severity: hotspots.length > 5 ? "high" : "medium" },
        { label: "Top District", value: topHotspot?.districtName || "N/A" },
        { label: "Peak Cases", value: topHotspot?.crimeCount ?? 0 },
      ],
      actions: [
        { label: "View Full Map", description: "See all hotspot locations" },
      ],
      reasons: pattern.reasons,
    });
  }

  if (trends && trends.length > 0) {
    const current = trends[trends.length - 1]?.count ?? 0;
    const previous = trends[trends.length - 2]?.count ?? 0;
    const change = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;

    results.push({
      title: "Temporal Pattern",
      severity: change > 20 ? "high" : change > 0 ? "medium" : "low",
      confidence: 80,
      summary: change > 0
        ? `Cases increased ${change}% — upward trend`
        : change < 0
        ? `Cases decreased ${Math.abs(change)}% — downward trend`
        : "Case volume stable",
      insights: [
        { label: "Current Month", value: current },
        { label: "Previous Month", value: previous },
        { label: "Change", value: `${change > 0 ? "+" : ""}${change}%`, severity: change > 20 ? "high" : change > 0 ? "medium" : "low" },
      ],
      actions: [],
      reasons: change > 20
        ? "Significant increase — potential emerging pattern"
        : change < 0
        ? "Cases declining — effective enforcement"
        : "Stable trend",
    });
  }

  if (pendingCases && pendingCases.length > 0) {
    const urgent = pendingCases.filter((c) => {
      const days = Math.floor((Date.now() - new Date(c.filingDate).getTime()) / 86400000);
      return days > 60;
    });

    results.push({
      title: "Case Queue Health",
      severity: urgent.length > 3 ? "high" : "medium",
      confidence: 85,
      summary: `${pendingCases.length} pending cases — ${urgent.length} urgent (60+ days)`,
      insights: [
        { label: "Pending", value: pendingCases.length, severity: "medium" },
        { label: "Urgent", value: urgent.length, severity: urgent.length > 3 ? "high" : "low" },
      ],
      actions: [
        { label: "Priority Queue", description: "View urgent cases" },
      ],
      reasons: urgent.length > 3
        ? "Multiple cases exceed legal time limits"
        : "Case queue within acceptable limits",
    });
  }

  return results;
}
