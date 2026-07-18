import { useQuery } from "@tanstack/react-query";
import * as casesApi from "../api/casesApi";
import * as accusedApi from "../api/accusedApi";

export function usePeople(caseId: number | null) {
  const victims = useQuery({
    queryKey: ["case-victims", caseId],
    queryFn: () => casesApi.getCaseVictims(caseId!),
    select: (res) => res.data,
    enabled: caseId !== null,
  });

  const accused = useQuery({
    queryKey: ["case-accused", caseId],
    queryFn: () => accusedApi.getAccusedByCase(caseId!),
    select: (res) => res.data,
    enabled: caseId !== null,
  });

  const isLoading = victims.isLoading || accused.isLoading;
  const isError = victims.isError || accused.isError;

  return {
    victims: victims.data,
    accused: accused.data,
    isLoading,
    isError,
    refetch: () => {
      victims.refetch();
      accused.refetch();
    },
  };
}
