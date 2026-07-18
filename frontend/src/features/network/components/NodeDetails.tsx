import { useNavigate } from "react-router-dom";
import { ArrowRight, User, FileText, MapPin, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { parseNodeId } from "../utils";
import type { GraphNode, GraphEdge } from "../types";

interface NodeDetailsProps {
  node: GraphNode | null;
  edges: GraphEdge[];
  allNodes: GraphNode[];
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  case: <FileText className="h-4 w-4" />,
  accused: <User className="h-4 w-4" />,
  victim: <User className="h-4 w-4" />,
  officer: <Shield className="h-4 w-4" />,
  district: <MapPin className="h-4 w-4" />,
};

export function NodeDetails({ node, edges, allNodes }: NodeDetailsProps) {
  const navigate = useNavigate();

  if (!node) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Node Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-muted)]">Click a node to view its details.</p>
        </CardContent>
      </Card>
    );
  }

  const { type, numericId } = parseNodeId(node.id);

  const connectedEdges = edges.filter(
    (e) => e.source === node.id || e.target === node.id,
  );

  const connectedNodes = connectedEdges.map((e) => {
    const otherId = e.source === node.id ? e.target : e.source;
    const otherNode = allNodes.find((n) => n.id === otherId);
    return { edge: e, node: otherNode };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {TYPE_ICONS[type] ?? <User className="h-4 w-4" />}
          {node.label}
        </CardTitle>
        <p className="text-xs capitalize text-[var(--text-muted)]">{type}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {type === "case" && numericId && (
          <button
            onClick={() => navigate(`/investigation/${numericId}`)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            View Investigation <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <div>
          <h4 className="mb-1 text-xs font-medium text-[var(--text-muted)]">
            Connected ({connectedNodes.length})
          </h4>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {connectedNodes.map(({ edge, node: other }, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1 text-xs"
              >
                <span className="text-[var(--text-primary)]">
                  {other?.label ?? "Unknown"}
                </span>
                <span className="text-[var(--text-muted)]">{edge.type}</span>
              </div>
            ))}
            {connectedNodes.length === 0 && (
              <p className="text-xs text-[var(--text-muted)]">No connections</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
