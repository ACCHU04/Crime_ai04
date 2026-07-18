import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { GraphStats } from "../types";

interface StatisticsPanelProps {
  stats: GraphStats | undefined;
}

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  if (!stats) return null;

  const items = [
    { label: "Total Nodes", value: stats.total_nodes },
    { label: "Total Edges", value: stats.total_edges },
    { label: "Components", value: stats.connected_components },
    { label: "Cases", value: stats.cases },
    { label: "Accused", value: stats.accused_persons },
    { label: "Victims", value: stats.victims },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div key={item.label} className="rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 text-center">
              <div className="text-lg font-bold text-[var(--text-primary)]">{item.value}</div>
              <div className="text-xs text-[var(--text-muted)]">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
