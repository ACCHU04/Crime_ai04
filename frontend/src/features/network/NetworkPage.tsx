import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { useNetwork } from "./hooks/useNetwork";
import { SearchPanel } from "./components/SearchPanel";
import { NetworkControls } from "./components/NetworkControls";
import { NetworkGraph } from "./components/NetworkGraph";
import { NodeDetails } from "./components/NodeDetails";
import { RelationshipLegend } from "./components/RelationshipLegend";
import { StatisticsPanel } from "./components/StatisticsPanel";

export default function NetworkPage() {
  const network = useNetwork();

  if (network.isError && !network.graph) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Network Intelligence"
          description="Visualize criminal networks, associations, and repeat offender links"
        />
        <ErrorState
          title="Failed to load network"
          message="Unable to fetch graph data from the backend."
          onRetry={network.refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network Intelligence"
        description="Visualize criminal networks, associations, and repeat offender links"
      />

      <div className="flex flex-wrap items-center gap-4">
        <SearchPanel
          searchQuery={network.searchQuery}
          onSearch={network.doSearch}
        />
        <NetworkControls
          viewMode={network.viewMode}
          onSwitchMode={network.switchMode}
          onRefresh={network.refetch}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <NetworkGraph
          graph={network.graph}
          isLoading={network.isLoading}
          selectedNodeId={network.selectedNodeId}
          neighborIds={network.neighborIds}
          onSelectNode={network.selectNode}
          onClearSelection={network.clearSelection}
        />

        <div className="space-y-6">
          <NodeDetails
            node={network.selectedNode}
            edges={network.graph?.edges ?? []}
            allNodes={network.graph?.nodes ?? []}
          />
          <StatisticsPanel stats={network.graph?.stats} />
          <RelationshipLegend />
        </div>
      </div>
    </div>
  );
}
