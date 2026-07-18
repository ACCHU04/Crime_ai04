import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import * as graphApi from "../api/graphApi";
import type { ViewMode, GraphResult } from "../types";

export function useNetwork() {
  const [viewMode, setViewMode] = useState<ViewMode>("full");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const fullNetwork = useQuery({
    queryKey: ["network-full"],
    queryFn: () => graphApi.getNetwork(),
    select: (res) => res.data.data,
    enabled: viewMode === "full",
  });

  const associates = useQuery({
    queryKey: ["network-associates", searchQuery],
    queryFn: () => graphApi.getAssociates(searchQuery),
    select: (res) => res.data.data,
    enabled: viewMode === "search" && searchQuery.length > 0,
  });

  const commonAccused = useQuery({
    queryKey: ["network-common-accused"],
    queryFn: () => graphApi.getCommonAccused(),
    select: (res) => res.data.data,
    enabled: viewMode === "common",
  });

  const activeQuery =
    viewMode === "full" ? fullNetwork :
    viewMode === "search" ? associates :
    commonAccused;

  const graph: GraphResult | undefined = activeQuery.data;
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;

  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const switchMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setSelectedNodeId(null);
    if (mode !== "search") setSearchQuery("");
  }, []);

  const doSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedNodeId(null);
    if (query) setViewMode("search");
  }, []);

  const selectedNode = graph?.nodes.find((n) => n.id === selectedNodeId) ?? null;

  const neighborIds = new Set<string>();
  if (selectedNodeId && graph) {
    for (const edge of graph.edges) {
      if (edge.source === selectedNodeId) neighborIds.add(edge.target);
      if (edge.target === selectedNodeId) neighborIds.add(edge.source);
    }
  }

  return {
    viewMode,
    searchQuery,
    graph,
    isLoading,
    isError,
    selectedNodeId,
    selectedNode,
    neighborIds,
    selectNode,
    clearSelection,
    switchMode,
    doSearch,
    refetch: activeQuery.refetch,
  };
}
