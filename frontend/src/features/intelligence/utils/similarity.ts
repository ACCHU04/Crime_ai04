import { evaluateRules } from "../rules/evaluate";
import { similarityRules, type SimilarityData } from "../rules/similarityRules";

export function computeSimilarity(data: SimilarityData) {
  return evaluateRules(similarityRules, data);
}
