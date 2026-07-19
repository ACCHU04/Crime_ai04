import { evaluateRules } from "../rules/evaluate";
import { riskRules, type RiskData } from "../rules/riskRules";

export function computeRiskScore(data: RiskData) {
  return evaluateRules(riskRules, data);
}
