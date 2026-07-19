import { useMemo } from "react";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { buildDashboardIntelligence } from "../engine/dashboard";
import type { IntelligenceResult } from "../types";

export function useDashboardIntelligence(): IntelligenceResult[] {
  const { stats, trends, hotspots, pendingCases } = useDashboard();

  return useMemo(() => {
    return buildDashboardIntelligence(stats, trends, hotspots, pendingCases);
  }, [stats, trends, hotspots, pendingCases]);
}
