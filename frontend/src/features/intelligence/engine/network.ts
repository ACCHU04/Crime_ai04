import type { IntelligenceResult } from "../types";
import type { GraphStats } from "@/types/graph";

export function buildNetworkIntelligence(stats: GraphStats | undefined): IntelligenceResult[] {
  if (!stats) return [];
  const results: IntelligenceResult[] = [];

  const totalNodes = (stats.casesCount ?? 0) + (stats.accusedCount ?? 0) + (stats.victimsCount ?? 0) + (stats.officersCount ?? 0);
  const accusedRatio = stats.accusedCount > 0 ? (stats.accusedCount / totalNodes) : 0;

  results.push({
    title: "Network Summary",
    severity: totalNodes > 100 ? "high" : "medium",
    confidence: 88,
    summary: `${stats.casesCount} cases, ${stats.accusedCount} accused, ${stats.victimsCount} victims in the network`,
    insights: [
      { label: "Cases", value: stats.casesCount },
      { label: "Accused", value: stats.accusedCount, severity: stats.accusedCount > stats.casesCount * 2 ? "high" : "low" },
      { label: "Victims", value: stats.victimsCount },
      { label: "Edges", value: stats.edgesCount },
      { label: "Officers", value: stats.officersCount },
    ],
    actions: [],
    reasons: totalNodes > 100
      ? "Large network — consider segmentation"
      : "Network size within normal parameters",
  });

  if (stats.accusedCount > stats.casesCount * 1.5) {
    results.push({
      title: "Repeat Offender Alert",
      severity: "high",
      confidence: 82,
      summary: `${stats.accusedCount} accused across ${stats.casesCount} cases — ${Math.round(accusedRatio * 100)}% accused ratio suggests repeat offenders`,
      insights: [
        { label: "Accused Count", value: stats.accusedCount },
        { label: "Case Count", value: stats.casesCount },
        { label: "Ratio", value: `${Math.round(accusedRatio * 100)}%`, severity: accusedRatio > 2 ? "high" : "medium" },
      ],
      actions: [
        { label: "View Repeat Offenders", description: "Identify serial suspects" },
      ],
      reasons: [
        "Accused-to-case ratio significantly above 1:1",
        "Repeat offenders likely active in the network",
      ],
    });
  }

  return results;
}
