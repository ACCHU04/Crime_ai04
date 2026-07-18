export interface GraphNode {
  id: string;
  type: "case" | "accused" | "victim" | "district" | "officer" | "unknown";
  label: string;
  metadata: Record<string, unknown> | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "occurred_in" | "accused_in" | "victim_of" | "assigned_to" | "connected";
}

export interface GraphStats {
  total_nodes: number;
  total_edges: number;
  connected_components: number;
  cases: number;
  accused_persons: number;
  victims: number;
}

export interface GraphResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: GraphStats;
}
