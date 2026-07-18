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

export default function DashboardPage() {
  const dashboard = useDashboard();
  const search = useAccusedSearch();

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

      <DashboardGrid>
        <CrimeTrendChart
          data={dashboard.trends}
          isLoading={dashboard.isLoading}
        />
        <HotspotChart
          data={dashboard.hotspots}
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
