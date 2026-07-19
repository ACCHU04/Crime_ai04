import { useQuery } from "@tanstack/react-query";
import { computeRecommendations, type RecommendationData } from "../utils/recommendations";
import type { RuleEvaluation } from "../types";

interface UseRecommendationsProps {
  crimeType: string;
  status: string;
  daysPending: number;
  accusedCount: number;
  victimCount: number;
  district: string;
  isRepeatOffender: boolean;
  hasVictims: boolean;
  hasWitnesses: boolean;
  networkSize: number;
}

export function useRecommendations(props: UseRecommendationsProps) {
  const query = useQuery<RuleEvaluation>({
    queryKey: ["recommendations", props],
    queryFn: () => {
      const data: RecommendationData = {
        crimeType: props.crimeType,
        status: props.status,
        isRepeatOffender: props.isRepeatOffender,
        daysPending: props.daysPending,
        hasVictims: props.hasVictims,
        hasWitnesses: props.hasWitnesses,
        networkSize: props.networkSize,
        district: props.district,
      };
      return computeRecommendations(data);
    },
    staleTime: 60_000,
  });

  return { data: query.data, isLoading: query.isLoading };
}
