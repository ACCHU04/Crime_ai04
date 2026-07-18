import type { GraphNode, GraphEdge, GraphStats, GraphResult } from "@/types";

export type { GraphNode, GraphEdge, GraphStats, GraphResult };

export type ViewMode = "full" | "search" | "common";

export interface NetworkState {
  viewMode: ViewMode;
  searchQuery: string;
  selectedNodeId: string | null;
}
