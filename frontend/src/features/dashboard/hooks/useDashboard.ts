import { useQuery } from "@tanstack/react-query";
import * as analyticsApi from "../api/analyticsApi";
import * as casesApi from "../api/casesApi";

export function useDashboard() {
  const dashboard = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => analyticsApi.getDashboard(),
    select: (res) => res.data.data,
  });

  const statusSummary = useQuery({
    queryKey: ["status-summary"],
    queryFn: () => analyticsApi.getStatusSummary(),
    select: (res) => res.data.data,
  });

  const crimeTypes = useQuery({
    queryKey: ["crime-types"],
    queryFn: () => analyticsApi.getCrimeTypes(),
    select: (res) => res.data.data,
  });

  const trends = useQuery({
    queryKey: ["trends", 12],
    queryFn: () => analyticsApi.getTrends(12),
    select: (res) => res.data.data,
  });

  const hotspots = useQuery({
    queryKey: ["hotspots", 10],
    queryFn: () => analyticsApi.getHotspots(10),
    select: (res) => res.data.data,
  });

  const recentCases = useQuery({
    queryKey: ["recent-cases"],
    queryFn: () => casesApi.getRecentCases(5),
    select: (res) => res.data,
  });

  const pendingCases = useQuery({
    queryKey: ["pending-cases"],
    queryFn: () => analyticsApi.getPendingCases(0, 10),
    select: (res) => res.data.data,
  });

  const isLoading =
    dashboard.isLoading ||
    statusSummary.isLoading ||
    crimeTypes.isLoading ||
    trends.isLoading ||
    hotspots.isLoading ||
    recentCases.isLoading ||
    pendingCases.isLoading;

  const isError =
    dashboard.isError ||
    statusSummary.isError ||
    crimeTypes.isError ||
    trends.isError ||
    hotspots.isError ||
    recentCases.isError ||
    pendingCases.isError;

  return {
    dashboard: dashboard.data,
    statusSummary: statusSummary.data,
    crimeTypes: crimeTypes.data,
    trends: trends.data,
    hotspots: hotspots.data,
    recentCases: recentCases.data,
    pendingCases: pendingCases.data,
    isLoading,
    isError,
    refetch: () => {
      dashboard.refetch();
      statusSummary.refetch();
      crimeTypes.refetch();
      trends.refetch();
      hotspots.refetch();
      recentCases.refetch();
      pendingCases.refetch();
    },
  };
}
