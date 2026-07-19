export type Severity = "critical" | "high" | "medium" | "low";

export interface Insight {
  label: string;
  value: string | number;
  severity?: Severity;
  onClick?: () => void;
}

export interface Action {
  label: string;
  description: string;
  onClick?: () => void;
  severity?: Severity;
}

export interface IntelligenceResult {
  title: string;
  severity: Severity;
  confidence: number;
  summary: string;
  insights: Insight[];
  actions: Action[];
  reasons: string[];
}

export interface Rule<T = unknown> {
  name: string;
  condition: (data: T) => boolean;
  score: number;
  reason: string | ((data: T) => string);
}

export interface RuleEvaluation {
  score: number;
  level: Severity;
  confidence: number;
  reasons: string[];
  matchedRules: string[];
}
