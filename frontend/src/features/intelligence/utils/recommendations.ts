import { evaluateRules } from "../rules/evaluate";
import { recommendationRules, type RecommendationData } from "../rules/recommendationRules";

export function computeRecommendations(data: RecommendationData) {
  return evaluateRules(recommendationRules, data);
}
