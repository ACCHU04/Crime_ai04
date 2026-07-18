import { Brain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";


import type { CaseSummary } from "../types";

interface AIInvestigationSummaryProps {
  summary: CaseSummary | undefined;
  isLoading: boolean;
}

export function AIInvestigationSummary({ summary, isLoading }: AIInvestigationSummaryProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;
  if (!summary) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-4 w-4 text-[var(--accent)]" />
          AI Investigation Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {summary.summary}
        </p>
      </CardContent>
    </Card>
  );
}
