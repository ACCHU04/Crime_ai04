import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Search } from "lucide-react";
import type { AccusedSearchData } from "../types";

interface QuickSearchProps {
  search: AccusedSearchData;
}

export function QuickSearch({ search }: QuickSearchProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            placeholder="Search accused by name..."
            className="pl-9"
          />
        </div>

        {search.isLoading && search.query.length > 1 && (
          <LoadingSkeleton variant="text" count={3} />
        )}

        {!search.isLoading &&
          search.query.length > 1 &&
          search.results.length === 0 && (
            <p className="py-4 text-center text-sm text-[var(--text-muted)]">
              No results found for "{search.query}"
            </p>
          )}

        {search.results.length > 0 && (
          <div className="space-y-2">
            {search.results.map((r) => (
              <div
                key={r.accused_id}
                className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-3 py-2 hover:bg-[var(--bg-hover)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {r.accused_name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Case #{r.case_id}
                  </p>
                </div>
                {r.status && <StatusBadge status={r.status} />}
              </div>
            ))}
          </div>
        )}

        {search.query.length <= 1 && !search.isLoading && (
          <p className="py-4 text-center text-sm text-[var(--text-muted)]">
            Type at least 2 characters to search
          </p>
        )}
      </CardContent>
    </Card>
  );
}
