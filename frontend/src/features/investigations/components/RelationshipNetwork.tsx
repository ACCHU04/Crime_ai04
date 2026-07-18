import { Network } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { NODE_COLORS } from "@/lib/constants";
import type { GraphResult } from "../types";

interface RelationshipNetworkProps {
  associates: GraphResult | undefined;
  isLoading: boolean;
}

export function RelationshipNetwork({ associates, isLoading }: RelationshipNetworkProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;

  if (!associates || !associates.nodes?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-4 w-4 text-[var(--accent)]" />
            Relationship Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No relationships found"
            description="No network connections are available for this case."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Network className="h-4 w-4 text-[var(--accent)]" />
          Relationship Network ({associates.nodes.length} nodes, {associates.edges.length} edges)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {associates.nodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: NODE_COLORS[node.type] ?? NODE_COLORS.unknown }}
              />
              <span className="text-[var(--text-primary)]">{node.label}</span>
              <span className="text-xs text-[var(--text-muted)]">{node.type}</span>
            </div>
          ))}
        </div>
        {associates.stats && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[var(--text-muted)]">
            <div>Cases: {associates.stats.cases}</div>
            <div>Accused: {associates.stats.accused_persons}</div>
            <div>Victims: {associates.stats.victims}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
