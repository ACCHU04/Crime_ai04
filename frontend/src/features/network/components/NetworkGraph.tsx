import { useCallback, useRef, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { getNodeColor, getNodeRadius, getEdgeColor } from "../utils";
import type { GraphResult, GraphNode } from "../types";

interface NetworkGraphProps {
  graph: GraphResult | undefined;
  isLoading: boolean;
  selectedNodeId: string | null;
  neighborIds: Set<string>;
  onSelectNode: (id: string | null) => void;
  onClearSelection: () => void;
}

interface ForceNode extends GraphNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface ForceLink {
  source: string | ForceNode;
  target: string | ForceNode;
  type: string;
}

export function NetworkGraph({
  graph,
  isLoading,
  selectedNodeId,
  neighborIds,
  onSelectNode,
  onClearSelection,
}: NetworkGraphProps) {
  const fgRef = useRef<any>(null);

  const graphData = useMemo(() => {
    if (!graph) return { nodes: [], links: [] };
    return {
      nodes: graph.nodes.map((n) => ({ ...n })),
      links: graph.edges.map((e) => ({ ...e })),
    };
  }, [graph]);

  const nodeCanvasObject = useCallback(
    (node: ForceNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const isSelected = node.id === selectedNodeId;
      const isNeighbor = neighborIds.has(node.id);
      const isDimmed = selectedNodeId && !isSelected && !isNeighbor;
      const radius = getNodeRadius(node.type);
      const color = getNodeColor(node.type);
      const alpha = isDimmed ? 0.2 : 1;

      ctx.globalAlpha = alpha;

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x ?? 0, node.y ?? 0, radius + 4, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      const label = node.label;
      const fontSize = Math.max(10 / globalScale, 2);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = isDimmed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.9)";
      ctx.fillText(label, node.x ?? 0, (node.y ?? 0) + radius + 2);

      ctx.globalAlpha = 1;
    },
    [selectedNodeId, neighborIds],
  );

  const linkCanvasObject = useCallback(
    (link: ForceLink, ctx: CanvasRenderingContext2D) => {
      const sourceNode = typeof link.source === "object" ? link.source : null;
      const targetNode = typeof link.target === "object" ? link.target : null;
      if (!sourceNode || !targetNode) return;

      const isHighlighted =
        selectedNodeId &&
        (sourceNode.id === selectedNodeId || targetNode.id === selectedNodeId);
      const isDimmed = selectedNodeId && !isHighlighted;

      ctx.globalAlpha = isDimmed ? 0.1 : isHighlighted ? 0.8 : 0.3;
      ctx.strokeStyle = getEdgeColor(link.type);
      ctx.lineWidth = isHighlighted ? 1.5 : 0.5;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x ?? 0, sourceNode.y ?? 0);
      ctx.lineTo(targetNode.x ?? 0, targetNode.y ?? 0);
      ctx.stroke();

      ctx.globalAlpha = 1;
    },
    [selectedNodeId],
  );

  const handleNodeClick = useCallback(
    (node: ForceNode) => {
      onSelectNode(node.id === selectedNodeId ? null : node.id);
    },
    [selectedNodeId, onSelectNode],
  );

  const handleBackgroundClick = useCallback(() => {
    onClearSelection();
  }, [onClearSelection]);

  if (isLoading) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="text-base">Network Graph</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full items-center justify-center">
          <LoadingSkeleton variant="card" />
        </CardContent>
      </Card>
    );
  }

  if (!graph || !graph.nodes.length) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="text-base">Network Graph</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full items-center justify-center">
          <EmptyState
            title="No graph data"
            description="No network connections found for the current view."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Network Graph ({graph.nodes.length} nodes, {graph.edges.length} edges)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[550px] bg-[var(--bg-primary)]">
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            nodeCanvasObject={nodeCanvasObject}
            nodePointerAreaPaint={(node: ForceNode, color: string, ctx: CanvasRenderingContext2D) => {
              const radius = getNodeRadius(node.type);
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x ?? 0, node.y ?? 0, radius + 2, 0, 2 * Math.PI);
              ctx.fill();
            }}
            linkCanvasObject={linkCanvasObject}
            onNodeClick={handleNodeClick}
            onBackgroundClick={handleBackgroundClick}
            backgroundColor="var(--bg-primary)"
            width={800}
            height={550}
            d3VelocityDecay={0.3}
            warmupTicks={50}
            cooldownTicks={100}
            enablePointerInteraction={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
