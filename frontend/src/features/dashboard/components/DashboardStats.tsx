import { Files, Search, CheckCircle, Layers, Users } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { formatNumber } from "@/lib/formatters";
import { getUnderInvestigationCount } from "../utils";
import type { DashboardData } from "../types";

export function DashboardStats({ data }: { data: DashboardData }) {
  if (data.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="stat" />
        ))}
      </div>
    );
  }

  if (data.isError || !data.dashboard) {
    return (
      <ErrorState
        title="Failed to load stats"
        message="Dashboard statistics could not be loaded."
      />
    );
  }

  const stats = data.dashboard;
  const underInvestigation = getUnderInvestigationCount(data.statusSummary);
  const crimeCategoryCount = data.crimeTypes?.length ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <StatCard
        label="Total Cases"
        value={formatNumber(stats.total_cases)}
        icon={<Files className="h-5 w-5 text-[var(--accent)]" />}
      />
      <StatCard
        label="Under Investigation"
        value={formatNumber(underInvestigation)}
        icon={<Search className="h-5 w-5 text-yellow-400" />}
        trend="up"
        trendValue={`${stats.pending_cases} pending`}
      />
      <StatCard
        label="Closed Cases"
        value={formatNumber(stats.closed_cases)}
        icon={<CheckCircle className="h-5 w-5 text-[var(--color-success)]" />}
      />
      <StatCard
        label="Crime Categories"
        value={formatNumber(crimeCategoryCount)}
        icon={<Layers className="h-5 w-5 text-purple-400" />}
      />
      <StatCard
        label="Convicted"
        value={formatNumber(stats.convicted_cases)}
        icon={<Users className="h-5 w-5 text-[var(--color-danger)]" />}
        trend={stats.convicted_cases > 0 ? "up" : "neutral"}
        trendValue={`${stats.convicted_cases} total`}
      />
    </div>
  );
}
