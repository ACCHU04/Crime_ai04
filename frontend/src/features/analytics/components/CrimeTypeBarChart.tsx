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
import { BAR_COLORS } from "../utils";
import type { CrimeTypeSummary } from "../types";

interface CrimeTypeBarChartProps {
  data: CrimeTypeSummary[] | undefined;
  isLoading: boolean;
}

export function CrimeTypeBarChart({ data, isLoading }: CrimeTypeBarChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crime Categories</CardTitle>
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
          <CardTitle className="text-base">Crime Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No crime data" description="No crime category data available." />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    name: d.crime_type,
    cases: d.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Crime Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
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
                width={130}
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
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
