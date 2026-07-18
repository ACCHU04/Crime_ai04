import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PIE_COLORS } from "../utils";
import type { StatusSummary } from "../types";

interface StatusPieChartProps {
  data: StatusSummary[] | undefined;
  isLoading: boolean;
}

export function StatusPieChart({ data, isLoading }: StatusPieChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Case Status Distribution</CardTitle>
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
          <CardTitle className="text-base">Case Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No status data" description="No case status data available." />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Case Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                paddingAngle={2}
                label={(props: PieLabelRenderProps) => `${props.name ?? ""}: ${props.value ?? ""}`}
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value) => [`${value} (${Math.round((Number(value) / total) * 100)}%)`, "Cases"]}
              />
              <Legend
                wrapperStyle={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
