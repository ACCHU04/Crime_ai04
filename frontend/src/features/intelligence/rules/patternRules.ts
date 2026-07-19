import type { Rule } from "../types";

export interface PatternData {
  crimeType: string;
  district: string;
  similarCasesInWindow: number;
  timeWindowHours: number;
  distanceKm: number;
}

export const patternRules: Rule<PatternData>[] = [
  {
    name: "cluster-same-district",
    condition: (d) => d.similarCasesInWindow >= 3 && d.district.length > 0,
    score: 40,
    reason: (d) => `${d.similarCasesInWindow} similar cases in ${d.district}`,
  },
  {
    name: "cluster-time",
    condition: (d) => d.timeWindowHours <= 72 && d.similarCasesInWindow >= 2,
    score: 30,
    reason: (d) => `${d.similarCasesInWindow} cases within ${d.timeWindowHours} hours`,
  },
  {
    name: "cluster-distance",
    condition: (d) => d.distanceKm <= 10 && d.similarCasesInWindow >= 2,
    score: 20,
    reason: (d) => `${d.similarCasesInWindow} cases within ${d.distanceKm} km`,
  },
  {
    name: "serial-pattern",
    condition: (d) => d.similarCasesInWindow >= 3 && d.timeWindowHours <= 168,
    score: 10,
    reason: "Possible serial offender pattern detected",
  },
];
