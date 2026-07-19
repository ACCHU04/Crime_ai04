import type { Rule } from "../types";

export interface SimilarityData {
  sameDistrict: boolean;
  sameCrimeType: boolean;
  accusedOverlapRatio: number;
  sameStatus: boolean;
}

export const similarityRules: Rule<SimilarityData>[] = [
  {
    name: "same-crime",
    condition: (d) => d.sameCrimeType,
    score: 30,
    reason: "Same crime type",
  },
  {
    name: "same-district",
    condition: (d) => d.sameDistrict,
    score: 30,
    reason: "Same district",
  },
  {
    name: "accused-overlap",
    condition: (d) => d.accusedOverlapRatio > 0,
    score: 40,
    reason: (d) => `Same suspect network (${Math.round(d.accusedOverlapRatio * 100)}% overlap)`,
  },
  {
    name: "same-status",
    condition: (d) => d.sameStatus,
    score: 5,
    reason: "Same case status",
  },
];
