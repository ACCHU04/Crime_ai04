import { evaluateRules } from "../rules/evaluate";
import { patternRules, type PatternData } from "../rules/patternRules";

export function computePatternDetection(data: PatternData) {
  return evaluateRules(patternRules, data);
}
