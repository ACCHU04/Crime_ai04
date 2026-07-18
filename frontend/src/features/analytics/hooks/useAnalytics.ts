import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as analyticsApi from "@/features/dashboard/api/analyticsApi";
import type { AnalyticsFilters } from "../types";

export function useAnalytics() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    crimeType: null,
    months: 12,
    topN: 10,
    minCases: 2,
  });

  const setCrimeType = (crimeType: string | null) =>
    setFilters((f) => ({ ...f, crimeType }));

  const setMonths = (months: number) =>
    setFilters((f) => ({ ...f, months }));

  const setTopN = (topN: number) =>
    setFilters((f) => ({ ...f, topN }));

  const setMinCases = (minCases: number) =>
    setFilters((f) => ({ ...f, minCases }));

  const dashboard = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: () => analyticsApi.getDashboard(),
    select: (res) => res.data.data,
  });

  const trends = useQuery({
    queryKey: ["analytics-trends", filters.months, filters.crimeType],
    queryFn: () => analyticsApi.getTrends(filters.months, filters.crimeType ?? undefined),
    select: (res) => res.data.data,
  });

  const hotspots = useQuery({
    queryKey: ["analytics-hotspots", filters.topN],
    queryFn: () => analyticsApi.getHotspots(filters.topN),
    select: (res) => res.data.data,
  });

  const statusSummary = useQuery({
    queryKey: ["analytics-status-summary"],
    queryFn: () => analyticsApi.getStatusSummary(),
    select: (res) => res.data.data,
  });

  const crimeTypes = useQuery({
    queryKey: ["analytics-crime-types"],
    queryFn: () => analyticsApi.getCrimeTypes(),
    select: (res) => res.data.data,
  });

  const districts = useQuery({
    queryKey: ["analytics-districts"],
    queryFn: () => analyticsApi.getDistrictSummary(),
    select: (res) => res.data.data,
  });

  const repeatOffenders = useQuery({
    queryKey: ["analytics-repeat-offenders", filters.minCases],
    queryFn: () => analyticsApi.getRepeatOffenders(filters.minCases),
    select: (res) => res.data.data,
  });

  const pendingCases = useQuery({
    queryKey: ["analytics-pending-cases"],
    queryFn: () => analyticsApi.getPendingCases(0, 50),
    select: (res) => res.data.data,
  });

  return {
    filters,
    setCrimeType,
    setMonths,
    setTopN,
    setMinCases,
    dashboard,
    trends,
    hotspots,
    statusSummary,
    crimeTypes,
    districts,
    repeatOffenders,
    pendingCases,
  };
}
