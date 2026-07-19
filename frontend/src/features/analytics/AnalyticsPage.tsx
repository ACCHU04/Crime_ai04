import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { useAnalytics } from "./hooks/useAnalytics";
import { FilterBar } from "./components/FilterBar";
import { AnalyticsSummaryStats } from "./components/AnalyticsSummaryStats";
import { TrendChart } from "./components/TrendChart";
import { StatusPieChart } from "./components/StatusPieChart";
import { CrimeTypeBarChart } from "./components/CrimeTypeBarChart";
import { DistrictTable } from "./components/DistrictTable";
import { HotspotLeaderboard } from "./components/HotspotLeaderboard";
import { RepeatOffenderTable } from "./components/RepeatOffenderTable";
import { PendingCasesTable } from "./components/PendingCasesTable";
import { PatternDetection } from "@/features/intelligence/components/PatternDetection";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const analytics = useAnalytics();

  if (analytics.dashboard.isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description="Crime trends, hotspots, and statistical analysis"
        />
        <ErrorState
          title="Failed to load analytics"
          message="The analytics backend is unreachable."
          onRetry={() => analytics.dashboard.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Crime trends, hotspots, and statistical analysis"
      />

      <FilterBar
        filters={analytics.filters}
        crimeTypes={analytics.crimeTypes.data}
        setCrimeType={analytics.setCrimeType}
        setMonths={analytics.setMonths}
        setTopN={analytics.setTopN}
      />

      <PatternDetection
        hotspots={analytics.hotspots.data}
        trends={analytics.trends.data}
        crimeTypes={analytics.crimeTypes.data}
        isLoading={analytics.hotspots.isLoading || analytics.trends.isLoading}
      />

      <AnalyticsSummaryStats
        data={analytics.dashboard.data}
        isLoading={analytics.dashboard.isLoading}
        isError={analytics.dashboard.isError}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrendChart
          data={analytics.trends.data}
          isLoading={analytics.trends.isLoading}
          crimeType={analytics.filters.crimeType}
          months={analytics.filters.months}
        />
        <StatusPieChart
          data={analytics.statusSummary.data}
          isLoading={analytics.statusSummary.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CrimeTypeBarChart
          data={analytics.crimeTypes.data}
          isLoading={analytics.crimeTypes.isLoading}
        />
        <DistrictTable
          data={analytics.districts.data}
          isLoading={analytics.districts.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HotspotLeaderboard
          data={analytics.hotspots.data}
          isLoading={analytics.hotspots.isLoading}
          topN={analytics.filters.topN}
        />
        <RepeatOffenderTable
          data={analytics.repeatOffenders.data}
          isLoading={analytics.repeatOffenders.isLoading}
          minCases={analytics.filters.minCases}
          setMinCases={analytics.setMinCases}
        />
      </div>

      <PendingCasesTable
        data={analytics.pendingCases.data}
        isLoading={analytics.pendingCases.isLoading}
        onViewCase={(id) => navigate(`/investigation/${id}`)}
      />
    </div>
  );
}
