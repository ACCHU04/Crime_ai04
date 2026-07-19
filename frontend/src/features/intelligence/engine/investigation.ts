import type { IntelligenceResult } from "../types";
import type { CaseDetail } from "@/types/case";
import { computeRiskScore } from "../utils/riskScore";
import { computeRecommendations } from "../utils/recommendations";

export function buildInvestigationIntelligence(caseDetail: CaseDetail | undefined): IntelligenceResult[] {
  if (!caseDetail) return [];
  const results: IntelligenceResult[] = [];

  const daysSinceFiling = Math.floor(
    (Date.now() - new Date(caseDetail.filingDate).getTime()) / 86400000
  );

  const violentCrimeKeywords = ["murder", "assault", "robbery", "dacoity", "kidnapping", "rape"];
  const isViolent = violentCrimeKeywords.some((k) =>
    caseDetail.crimeType.toLowerCase().includes(k)
  );

  const risk = computeRiskScore({
    isRepeatOffender: false,
    isViolentCrime: isViolent,
    accusedCount: caseDetail.accusedCount,
    daysPending: daysSinceFiling,
    networkSize: 0,
    victimCount: caseDetail.victimCount,
    weaponInvolved: false,
  });

  results.push({
    title: "Risk Assessment",
    severity: risk.level,
    confidence: risk.confidence,
    summary: `Risk Score: ${risk.score}/100 — ${
      risk.level === "critical" ? "Critical" :
      risk.level === "high" ? "High Risk" :
      risk.level === "medium" ? "Medium Risk" : "Low Risk"
    }`,
    insights: [
      { label: "Risk Score", value: `${risk.score}/100`, severity: risk.level },
      { label: "Confidence", value: `${risk.confidence}%` },
      { label: "Days Pending", value: daysSinceFiling, severity: daysSinceFiling > 60 ? "high" : daysSinceFiling > 30 ? "medium" : "low" },
      { label: "Accused Count", value: caseDetail.accusedCount },
      { label: "Victim Count", value: caseDetail.victimCount },
    ],
    actions: risk.matchedRules.length > 0 ? [
      { label: "Why?", description: risk.reasons.join(" • "), severity: risk.level },
    ] : [],
    reasons: risk.reasons,
  });

  const recs = computeRecommendations({
    crimeType: caseDetail.crimeType,
    status: caseDetail.status,
    isRepeatOffender: false,
    daysPending: daysSinceFiling,
    hasVictims: caseDetail.victimCount > 0,
    hasWitnesses: false,
    networkSize: 0,
    district: caseDetail.districtName,
  });

  if (recs.matchedRules.length > 0) {
    results.push({
      title: "Recommended Actions",
      severity: "medium",
      confidence: recs.confidence,
      summary: `${recs.matchedRules.length} recommended next steps`,
      insights: recs.reasons.map((r) => ({ label: "Action", value: r })),
      actions: recs.reasons.map((r, i) => ({
        label: `Step ${i + 1}`,
        description: r,
      })),
      reasons: recs.reasons,
    });
  }

  if (daysSinceFiling > 30) {
    results.push({
      title: "Case Timeline",
      severity: daysSinceFiling > 60 ? "high" : "medium",
      confidence: 75,
      summary: `Case filed ${daysSinceFiling} days ago`,
      insights: [
        { label: "Filing Date", value: caseDetail.filingDate },
        { label: "Days Elapsed", value: daysSinceFiling, severity: daysSinceFiling > 60 ? "high" : "medium" },
      ],
      actions: [
        { label: "View Timeline", description: "See detailed case timeline" },
      ],
      reasons: daysSinceFiling > 60
        ? "Case has exceeded 60-day threshold"
        : "Case is within investigation window",
    });
  }

  return results;
}
