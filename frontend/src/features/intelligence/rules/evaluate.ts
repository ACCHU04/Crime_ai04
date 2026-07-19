import type { Rule, RuleEvaluation, Severity } from "../types";

export function evaluateRules<T>(rules: Rule<T>[], data: T): RuleEvaluation {
  const matched = rules.filter((r) => r.condition(data));
  const score = Math.min(matched.reduce((s, r) => s + r.score, 0), 100);
  const confidence = Math.min(70 + matched.length * 5, 99);
  const level: Severity =
    score >= 80 ? "critical" : score >= 60 ? "high" : score >= 40 ? "medium" : "low";

  return {
    score,
    level,
    confidence,
    reasons: matched.map((r) => typeof r.reason === "function" ? r.reason(data) : r.reason),
    matchedRules: matched.map((r) => r.name),
  };
}
