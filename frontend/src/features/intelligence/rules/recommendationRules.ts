import type { Rule } from "../types";

export interface RecommendationData {
  crimeType: string;
  status: string;
  isRepeatOffender: boolean;
  daysPending: number;
  hasVictims: boolean;
  hasWitnesses: boolean;
  networkSize: number;
  district: string;
}

export const recommendationRules: Rule<RecommendationData>[] = [
  {
    name: "interview-witness",
    condition: (d) => d.hasVictims || d.hasWitnesses,
    score: 1,
    reason: "Interview witness — victim or witness available",
  },
  {
    name: "review-cctv",
    condition: (d) => d.crimeType.toLowerCase().includes("theft") || d.crimeType.toLowerCase().includes("burglary"),
    score: 1,
    reason: "Review CCTV — theft/burglary case",
  },
  {
    name: "check-previous-fir",
    condition: (d) => d.isRepeatOffender,
    score: 1,
    reason: "Check previous FIR — accused has prior cases",
  },
  {
    name: "verify-tower",
    condition: (d) => d.crimeType.toLowerCase().includes("murder") || d.crimeType.toLowerCase().includes("assault"),
    score: 1,
    reason: "Verify tower location — mobile data available",
  },
  {
    name: "network-analysis",
    condition: (d) => d.networkSize > 3,
    score: 1,
    reason: "Analyze suspect network — multiple connections detected",
  },
  {
    name: "expedite-pending",
    condition: (d) => d.daysPending > 60,
    score: 1,
    reason: "Expedite investigation — case pending too long",
  },
  {
    name: "district-coordination",
    condition: (d) => d.networkSize > 5,
    score: 1,
    reason: "Coordinate with district units — wide network detected",
  },
];
