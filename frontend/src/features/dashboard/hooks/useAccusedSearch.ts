import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { searchAccused } from "../api/accusedApi";

export function useAccusedSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const search = useQuery({
    queryKey: ["accused-search", debouncedQuery],
    queryFn: () => searchAccused(debouncedQuery),
    select: (res) => res.data,
    enabled: debouncedQuery.length > 1,
  });

  return {
    query,
    setQuery,
    results: search.data ?? [],
    isLoading: search.isLoading,
    isError: search.isError,
  };
}
