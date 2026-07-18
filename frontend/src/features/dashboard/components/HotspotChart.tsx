import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { HotspotEntry } from "@/types";

const HOTSPOT_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6",
];

interface HotspotChartProps {
  data: HotspotEntry[] | undefined;
  isLoading: boolean;
}

export function HotspotChart({ data, isLoading }: HotspotChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hotspot Districts</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="card" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hotspot Districts</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No hotspot data" description="No district data available." />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    name: d.district,
    cases: d.case_count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hotspot Districts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border-subtle)" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              />
              <Bar dataKey="cases" radius={[0, 4, 4, 0]} name="Cases">
                {chartData.map((_, index) => (
                  <Cell key={index} fill={HOTSPOT_COLORS[index % HOTSPOT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
