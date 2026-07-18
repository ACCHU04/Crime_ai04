import { useQuery } from "@tanstack/react-query";
import * as casesApi from "../api/casesApi";

export function useCase(caseId: number | null) {
  const caseQuery = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => casesApi.getCaseById(caseId!),
    select: (res) => res.data,
    enabled: caseId !== null,
  });

  const report = useQuery({
    queryKey: ["case-report", caseId],
    queryFn: () => casesApi.getCaseReport(caseId!),
    select: (res) => res.data,
    enabled: caseId !== null,
  });

  const timeline = useQuery({
    queryKey: ["case-timeline", caseId],
    queryFn: () => casesApi.getCaseTimeline(caseId!),
    select: (res) => res.data,
    enabled: caseId !== null,
  });

  const isLoading = caseQuery.isLoading || report.isLoading || timeline.isLoading;
  const isError = caseQuery.isError || report.isError || timeline.isError;

  return {
    case: caseQuery.data,
    report: report.data,
    timeline: timeline.data,
    isLoading,
    isError,
    refetch: () => {
      caseQuery.refetch();
      report.refetch();
      timeline.refetch();
    },
  };
}
