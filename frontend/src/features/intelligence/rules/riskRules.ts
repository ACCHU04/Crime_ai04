import type { Rule } from "../types";

export interface RiskData {
  isRepeatOffender: boolean;
  isViolentCrime: boolean;
  accusedCount: number;
  daysPending: number;
  networkSize: number;
  victimCount: number;
  weaponInvolved: boolean;
}

export const riskRules: Rule<RiskData>[] = [
  {
    name: "repeat-offender",
    condition: (d) => d.isRepeatOffender,
    score: 25,
    reason: "Repeat offender",
  },
  {
    name: "violent-crime",
    condition: (d) => d.isViolentCrime,
    score: 20,
    reason: "Violent crime classification",
  },
  {
    name: "multiple-accused",
    condition: (d) => d.accusedCount > 1,
    score: 15,
    reason: "Multiple accused involved",
  },
  {
    name: "pending-60d",
    condition: (d) => d.daysPending > 60,
    score: 15,
    reason: (d) => `Pending ${d.daysPending} days`,
  },
  {
    name: "large-network",
    condition: (d) => d.networkSize > 5,
    score: 10,
    reason: (d) => `Network of ${d.networkSize} associates`,
  },
  {
    name: "multiple-victims",
    condition: (d) => d.victimCount > 1,
    score: 10,
    reason: "Multiple victims",
  },
  {
    name: "weapon",
    condition: (d) => d.weaponInvolved,
    score: 5,
    reason: "Weapon involvement suspected",
  },
];
