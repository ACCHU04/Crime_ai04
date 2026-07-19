import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { computeRiskScore, type RiskData } from "../utils/riskScore";
import type { RuleEvaluation } from "../types";

interface UseRiskAssessmentProps {
  crimeType: string;
  status: string;
  daysPending: number;
  accusedCount: number;
  victimCount: number;
  district: string;
  isRepeatOffender: boolean;
}

export function useRiskAssessment(props: UseRiskAssessmentProps) {
  const query = useQuery<RuleEvaluation>({
    queryKey: ["risk-assessment", props],
    queryFn: () => {
      const data: RiskData = {
        isRepeatOffender: props.isRepeatOffender,
        isViolentCrime: ["murder", "assault", "robbery", "dacoity", "kidnapping", "rape"].some((k) =>
          props.crimeType.toLowerCase().includes(k),
        ),
        accusedCount: props.accusedCount,
        daysPending: props.daysPending,
        networkSize: 0,
        victimCount: props.victimCount,
        weaponInvolved: false,
      };
      return computeRiskScore(data);
    },
    staleTime: 60_000,
  });

  return { data: query.data, isLoading: query.isLoading };
}
