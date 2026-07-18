import { Card, CardContent } from "@/components/ui/card";
import type { AnalyticsFilters, CrimeTypeSummary } from "../types";

interface FilterBarProps {
  filters: AnalyticsFilters;
  crimeTypes: CrimeTypeSummary[] | undefined;
  setCrimeType: (v: string | null) => void;
  setMonths: (v: number) => void;
  setTopN: (v: number) => void;
}

const MONTH_OPTIONS = [3, 6, 12, 24];
const TOP_N_OPTIONS = [5, 10, 15, 20];

export function FilterBar({ filters, crimeTypes, setCrimeType, setMonths, setTopN }: FilterBarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Crime Type</label>
            <select
              value={filters.crimeType ?? ""}
              onChange={(e) => setCrimeType(e.target.value || null)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="">All Types</option>
              {crimeTypes?.map((ct) => (
                <option key={ct.crime_type} value={ct.crime_type}>
                  {ct.crime_type} ({ct.count})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Time Range</label>
            <div className="flex gap-1">
              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    filters.months === m
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
                  }`}
                >
                  {m}mo
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Top Districts</label>
            <div className="flex gap-1">
              {TOP_N_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setTopN(n)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    filters.topN === n
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
                  }`}
                >
                  Top {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
