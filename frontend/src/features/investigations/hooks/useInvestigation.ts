import { useQuery } from "@tanstack/react-query";
import * as casesApi from "../api/casesApi";
import * as graphApi from "../api/graphApi";

export function useInvestigation(caseId: number | null, officerName: string | null) {
  const summary = useQuery({
    queryKey: ["case-summary", caseId],
    queryFn: () => casesApi.summarizeCase(caseId!),
    select: (res) => res.data,
    enabled: caseId !== null,
  });

  const associates = useQuery({
    queryKey: ["case-associates", officerName],
    queryFn: () => graphApi.getAssociates(officerName!),
    select: (res) => res.data?.data,
    enabled: !!officerName,
  });

  const isLoading = summary.isLoading || associates.isLoading;
  const isError = summary.isError || associates.isError;

  return {
    summary: summary.data,
    associates: associates.data,
    isLoading,
    isError,
    refetch: () => {
      summary.refetch();
      associates.refetch();
    },
  };
}
