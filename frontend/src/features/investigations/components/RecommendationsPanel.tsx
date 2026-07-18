import { Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { CaseSummary } from "../types";

interface RecommendationsPanelProps {
  summary: CaseSummary | undefined;
  isLoading: boolean;
}

export function RecommendationsPanel({ summary, isLoading }: RecommendationsPanelProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;

  const actions = summary?.suggested_actions ?? [];

  if (!actions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No recommendations" description="No AI-generated recommendations are available." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400" />
              {action}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
