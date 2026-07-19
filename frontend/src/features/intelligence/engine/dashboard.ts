import type { IntelligenceResult, Severity } from "../types";
import type { DashboardStats, HotspotEntry, MonthlyTrend, PendingCase } from "@/types/analytics";
import { computeOperationalHealth } from "../utils/operationalHealth";
import { computeTrendDelta } from "../utils/confidence";
import { KARNATAKA_DISTRICTS } from "../constants/karnatakaDistricts";

export function buildDashboardIntelligence(stats: DashboardStats, trends: MonthlyTrend[] | undefined, hotspots: HotspotEntry[] | undefined, pendingCases: PendingCase[] | undefined): IntelligenceResult[] {
  const results: IntelligenceResult[] = [];
  const trendDelta = computeTrendDelta(trends);

  if (stats) {
    const health = computeOperationalHealth({
      totalCases: stats.totalCases,
      pendingCases: stats.pendingCases,
      closedCases: stats.closedCases,
      convictedCases: stats.convictedCases,
      topDistrict: stats.topDistrict,
      topCrimeType: stats.topCrimeType,
      hotspotCount: hotspots?.length ?? 0,
      repeatOffenderCount: stats.repeatOffendersCount,
      pendingDaysAvg: stats.avgPendingDays,
    });

    results.push({
      title: "Operational Health",
      severity: health.level,
      confidence: 85,
      summary: `Overall score: ${health.score}/100 — ${health.status}`,
      insights: [
        { label: "Pending Cases", value: stats.pendingCases, severity: stats.pendingCases > stats.totalCases * 0.6 ? "high" : "medium" },
        { label: "Avg Pending Days", value: stats.avgPendingDays, severity: stats.avgPendingDays > 60 ? "high" : stats.avgPendingDays > 30 ? "medium" : "low" },
        { label: "Repeat Offenders", value: stats.repeatOffendersCount, severity: stats.repeatOffendersCount > 2 ? "high" : "low" },
      ],
      actions: [
        { label: "View Pending Cases", description: "Review cases requiring attention" },
        { label: "View Hotspots", description: "See active hotspot areas" },
      ],
      reasons: health.level === "critical"
        ? "Critical operational issues detected — multiple pending cases and repeat offenders"
        : health.level === "high"
        ? "Operational health needs attention — review pending cases"
        : "Operational health is within normal parameters",
    });
  }

  if (trendDelta !== 0) {
    const severity: Severity = trendDelta > 20 ? "critical" : trendDelta > 0 ? "medium" : "low";
    results.push({
      title: "Case Trend",
      severity,
      confidence: 80,
      summary: trendDelta > 0
        ? `Case count increased ${trendDelta}% this month`
        : `Case count decreased ${Math.abs(trendDelta)}% this month`,
      insights: [
        { label: "Trend", value: `${trendDelta > 0 ? "+" : ""}${trendDelta}%`, severity },
      ],
      actions: [],
      reasons: trendDelta > 20
        ? "Significant upward trend — possible emerging crime pattern"
        : trendDelta > 0
        ? "Moderate increase within expected range"
        : "Downward trend — investigation efforts may be effective",
    });
  }

  if (hotspots && hotspots.length > 0) {
    const highCrimeHotspots = hotspots.filter((h) => h.crimeCount >= 5);
    results.push({
      title: "Active Hotspots",
      severity: highCrimeHotspots.length > 2 ? "high" : "medium",
      confidence: 82,
      summary: `${hotspots.length} active hotspots${highCrimeHotspots.length > 0 ? `, ${highCrimeHotspots.length} high-activity` : ""}`,
      insights: [
        { label: "Total Hotspots", value: hotspots.length },
        { label: "High Activity", value: highCrimeHotspots.length, severity: highCrimeHotspots.length > 2 ? "high" : "low" },
      ],
      actions: [
        { label: "View Hotspot Map", description: "See geographic distribution" },
      ],
      reasons: highCrimeHotspots.length > 2
        ? "Multiple high-activity hotspots require focused patrol deployment"
        : "Hotspot activity within manageable levels",
    });
  }

  if (pendingCases && pendingCases.length > 0) {
    const urgentCases = pendingCases.filter((c) => {
      const days = Math.floor((Date.now() - new Date(c.filingDate).getTime()) / 86400000);
      return days > 60;
    });
    results.push({
      title: "Pending Case Queue",
      severity: urgentCases.length > 2 ? "high" : "medium",
      confidence: 88,
      summary: `${pendingCases.length} cases pending trial${urgentCases.length > 0 ? `, ${urgentCases.length} older than 60 days` : ""}`,
      insights: [
        { label: "Pending", value: pendingCases.length, severity: pendingCases.length > 20 ? "high" : "medium" },
        { label: "Urgent", value: urgentCases.length, severity: urgentCases.length > 2 ? "high" : "low" },
      ],
      actions: [
        { label: "Open Priority Queue", description: "Review urgent cases" },
      ],
      reasons: urgentCases.length > 2
        ? "Multiple cases past 60-day threshold — legal compliance at risk"
        : "Pending cases within acceptable range",
    });
  }

  return results;
}
