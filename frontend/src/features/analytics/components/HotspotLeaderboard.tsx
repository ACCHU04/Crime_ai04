import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { getPercentage } from "../utils";
import type { HotspotEntry } from "../types";

interface HotspotLeaderboardProps {
  data: HotspotEntry[] | undefined;
  isLoading: boolean;
  topN: number;
}

const RANK_COLORS = ["text-red-400", "text-orange-400", "text-yellow-400", "text-[var(--text-secondary)]", "text-[var(--text-secondary)]"];

export function HotspotLeaderboard({ data, isLoading, topN }: HotspotLeaderboardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">District Hotspots</CardTitle>
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
          <CardTitle className="text-base">District Hotspots</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No hotspot data" description="No district hotspot data available." />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((s, d) => s + d.case_count, 0);
  const maxCount = data[0]?.case_count ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-red-400" />
          District Hotspots (Top {topN})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-72 overflow-y-auto space-y-2">
          {data.map((d, i) => (
            <div key={d.district} className="flex items-center gap-3">
              <span className={`w-6 text-right text-xs font-bold ${RANK_COLORS[i] ?? "text-[var(--text-muted)]"}`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{d.district}</span>
                  <span className="text-xs text-[var(--text-muted)]">{d.case_count} ({getPercentage(d.case_count, total)})</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                  <div
                    className="h-full rounded-full bg-red-500/60"
                    style={{ width: `${(d.case_count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
