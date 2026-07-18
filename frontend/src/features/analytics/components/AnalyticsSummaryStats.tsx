import { Files, Search, CheckCircle, Users } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { formatNumber } from "@/lib/formatters";
import type { DashboardStats } from "../types";

interface AnalyticsSummaryStatsProps {
  data: DashboardStats | undefined;
  isLoading: boolean;
  isError?: boolean;
}

export function AnalyticsSummaryStats({ data, isLoading, isError }: AnalyticsSummaryStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="stat" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to load summary"
        message="Dashboard stats could not be loaded."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Cases"
        value={formatNumber(data.total_cases)}
        icon={<Files className="h-5 w-5 text-[var(--accent)]" />}
      />
      <StatCard
        label="Pending"
        value={formatNumber(data.pending_cases)}
        icon={<Search className="h-5 w-5 text-yellow-400" />}
      />
      <StatCard
        label="Closed"
        value={formatNumber(data.closed_cases)}
        icon={<CheckCircle className="h-5 w-5 text-[var(--color-success)]" />}
      />
      <StatCard
        label="Convicted"
        value={formatNumber(data.convicted_cases)}
        icon={<Users className="h-5 w-5 text-[var(--color-danger)]" />}
      />
    </div>
  );
}
