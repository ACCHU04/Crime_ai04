import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { useDashboard } from "./hooks/useDashboard";
import { useAccusedSearch } from "./hooks/useAccusedSearch";
import { DashboardStats } from "./components/DashboardStats";
import { DashboardGrid } from "./components/DashboardGrid";
import { CrimeTrendChart } from "./components/CrimeTrendChart";
import { HotspotChart } from "./components/HotspotChart";
import { RecentFIRTable } from "./components/RecentFIRTable";
import { PendingCasesTable } from "./components/PendingCasesTable";
import { QuickSearch } from "./components/QuickSearch";
import { useDashboardIntelligence } from "@/features/intelligence/hooks/useDashboardIntelligence";
import { IntelligenceCard } from "@/features/intelligence/components/IntelligenceCard";
import { CrimeHeatMap } from "@/features/intelligence/components/CrimeHeatMap";

export default function DashboardPage() {
  const dashboard = useDashboard();
  const search = useAccusedSearch();
  const intelligence = useDashboardIntelligence();

  if (dashboard.isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Real-time crime intelligence overview for Karnataka"
        />
        <ErrorState
          title="Failed to load dashboard"
          message="Unable to fetch data from the backend. Please check if the API server is running."
          onRetry={dashboard.refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time crime intelligence overview for Karnataka"
      />

      <DashboardStats data={dashboard} />

      {intelligence.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">Daily Intelligence Brief</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelligence.map((result, i) => (
              <IntelligenceCard key={i} result={result} />
            ))}
          </div>
        </div>
      )}

      <DashboardGrid>
        <CrimeTrendChart
          data={dashboard.trends}
          isLoading={dashboard.isLoading}
        />
        <CrimeHeatMap
          hotspots={dashboard.hotspots}
          isLoading={dashboard.isLoading}
        />
      </DashboardGrid>

      <DashboardGrid>
        <RecentFIRTable
          data={dashboard.recentCases}
          isLoading={dashboard.isLoading}
        />
        <PendingCasesTable
          data={dashboard.pendingCases}
          isLoading={dashboard.isLoading}
        />
      </DashboardGrid>

      <DashboardGrid>
        <QuickSearch search={search} />
        <div />
      </DashboardGrid>
    </div>
  );
}
