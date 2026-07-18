import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { getPercentage } from "../utils";
import type { DistrictSummary } from "../types";

interface DistrictTableProps {
  data: DistrictSummary[] | undefined;
  isLoading: boolean;
}

export function DistrictTable({ data, isLoading }: DistrictTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">District Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="table" count={6} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">District Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No district data" description="No district-level data available." />
        </CardContent>
      </Card>
    );
  }

  const sorted = [...data].sort((a, b) => b.count - a.count);
  const total = sorted.reduce((s, d) => s + d.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-[var(--accent)]" />
          District Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">#</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">District</th>
                <th className="pb-2 text-right font-medium text-[var(--text-muted)]">Cases</th>
                <th className="pb-2 text-right font-medium text-[var(--text-muted)]">Share</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => (
                <tr
                  key={d.district}
                  className="border-b border-[var(--border-subtle)] last:border-0"
                >
                  <td className="py-2 text-[var(--text-muted)]">{i + 1}</td>
                  <td className="py-2 font-medium text-[var(--text-primary)]">{d.district}</td>
                  <td className="py-2 text-right text-[var(--text-secondary)]">{d.count}</td>
                  <td className="py-2 text-right text-[var(--text-muted)]">{getPercentage(d.count, total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
