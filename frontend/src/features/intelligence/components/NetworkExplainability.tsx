import { useMemo } from "react";
import { motion } from "framer-motion";
import { Network, AlertTriangle, Link2, Users, FileText, MapPin, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { GraphNode, GraphEdge } from "@/types/graph";

interface NetworkExplainabilityProps {
  selectedNode: GraphNode | null;
  edges: GraphEdge[];
  allNodes: GraphNode[];
  stats?: {
    total_nodes: number;
    total_edges: number;
    cases: number;
    accused_persons: number;
    victims: number;
  };
}

interface NodeMetric {
  label: string;
  value: number | string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  case: <FileText className="h-4 w-4 text-blue-400" />,
  accused: <Users className="h-4 w-4 text-red-400" />,
  victim: <Users className="h-4 w-4 text-green-400" />,
  officer: <Shield className="h-4 w-4 text-purple-400" />,
  district: <MapPin className="h-4 w-4 text-yellow-400" />,
};

function getNodeMetrics(
  node: GraphNode,
  edges: GraphEdge[],
  allNodes: GraphNode[],
  stats: NetworkExplainabilityProps["stats"],
): NodeMetric[] {
  const connectedEdges = edges.filter(
    (e) => e.source === node.id || e.target === node.id,
  );
  const degree = connectedEdges.length;

  const neighborIds = new Set<string>();
  for (const e of connectedEdges) {
    neighborIds.add(e.source === node.id ? e.target : e.source);
  }

  const neighborTypes = new Map<string, number>();
  for (const nid of neighborIds) {
    const n = allNodes.find((x) => x.id === nid);
    if (n) {
      neighborTypes.set(n.type, (neighborTypes.get(n.type) ?? 0) + 1);
    }
  }

  const caseConnections = edges.filter(
    (e) =>
      (e.source === node.id || e.target === node.id) &&
      (allNodes.find((n) => n.id === (e.source === node.id ? e.target : e.source))?.type === "case"),
  ).length;

  const accusedConnections = edges.filter(
    (e) =>
      (e.source === node.id || e.target === node.id) &&
      (allNodes.find((n) => n.id === (e.source === node.id ? e.target : e.source))?.type === "accused"),
  ).length;

  const metrics: NodeMetric[] = [
    {
      label: "Connections",
      value: degree,
      severity: degree > 5 ? "critical" : degree > 3 ? "high" : degree > 1 ? "medium" : "low",
      description: `${degree} direct connections in the network`,
    },
    {
      label: "Case Links",
      value: caseConnections,
      severity: caseConnections > 2 ? "high" : caseConnections > 0 ? "medium" : "low",
      description: `Connected to ${caseConnections} case${caseConnections !== 1 ? "s" : ""}`,
    },
    {
      label: "Accused Links",
      value: accusedConnections,
      severity: accusedConnections > 1 ? "high" : accusedConnections > 0 ? "medium" : "low",
      description: `Connected to ${accusedConnections} accused person${accusedConnections !== 1 ? "s" : ""}`,
    },
  ];

  if (stats && stats.total_nodes > 0) {
    const centrality = degree / Math.max(stats.total_nodes - 1, 1);
    metrics.push({
      label: "Centrality",
      value: `${Math.round(centrality * 100)}%`,
      severity: centrality > 0.1 ? "critical" : centrality > 0.05 ? "high" : "medium",
      description: "Relative importance in the network",
    });
  }

  return metrics;
}

export function NetworkExplainability({
  selectedNode,
  edges,
  allNodes,
  stats,
}: NetworkExplainabilityProps) {
  const metrics = useMemo(() => {
    if (!selectedNode) return [];
    return getNodeMetrics(selectedNode, edges, allNodes, stats);
  }, [selectedNode, edges, allNodes, stats]);

  if (!selectedNode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-4 w-4 text-[var(--accent)]" />
            Network Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-muted)]">
            Select a node to see why it matters.
          </p>
        </CardContent>
      </Card>
    );
  }

  const connectedEdges = edges.filter(
    (e) => e.source === selectedNode.id || e.target === selectedNode.id,
  );

  const neighborTypes = new Map<string, number>();
  for (const e of connectedEdges) {
    const nid = e.source === selectedNode.id ? e.target : e.source;
    const n = allNodes.find((x) => x.id === nid);
    if (n) {
      neighborTypes.set(n.type, (neighborTypes.get(n.type) ?? 0) + 1);
    }
  }

  const severityColors = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-green-400",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Network className="h-4 w-4 text-[var(--accent)]" />
          Network Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Node identity */}
        <div className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-card)]">
            {TYPE_ICONS[selectedNode.type] ?? <Users className="h-4 w-4 text-slate-400" />}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{selectedNode.label}</p>
            <p className="text-xs capitalize text-[var(--text-muted)]">{selectedNode.type}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2.5"
            >
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{m.label}</p>
              <p className={`text-lg font-bold ${severityColors[m.severity]}`}>{m.value}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{m.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Why it matters */}
        {metrics.some((m) => m.severity === "critical" || m.severity === "high") && (
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-medium text-orange-300">Why this matters</span>
            </div>
            <p className="text-xs text-orange-200/80">
              {selectedNode.type === "accused" &&
                "This person is connected to multiple cases or suspects. Removing them could disrupt criminal networks."}
              {selectedNode.type === "case" &&
                "This case has multiple suspects or connects to other cases. Key investigation node."}
              {selectedNode.type === "victim" &&
                "This victim appears in multiple contexts. Their connections may reveal broader patterns."}
              {selectedNode.type === "district" &&
                "This district has high criminal activity. Concentrated enforcement may be needed."}
              {selectedNode.type === "officer" &&
                "This officer is assigned to multiple cases. Workload and jurisdiction analysis needed."}
            </p>
          </div>
        )}

        {/* Connection breakdown */}
        {neighborTypes.size > 0 && (
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Connected to</p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(neighborTypes.entries()).map(([type, count]) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-700/50 bg-slate-800/50 px-2 py-0.5 text-[10px] text-slate-400"
                >
                  {TYPE_ICONS[type] ?? <Link2 className="h-2.5 w-2.5" />}
                  {count} {type}{count !== 1 ? "s" : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
