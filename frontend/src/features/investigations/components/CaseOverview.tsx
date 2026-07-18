import { User, Calendar, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { formatDate } from "@/lib/formatters";
import type { CaseReport } from "../types";

interface CaseOverviewProps {
  report: CaseReport | undefined;
  isLoading: boolean;
}

export function CaseOverview({ report, isLoading }: CaseOverviewProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;
  if (!report) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-[var(--accent)]" />
          Case Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {report.brief_facts && (
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {report.brief_facts}
            </p>
          )}
          {!report.brief_facts && (
            <p className="text-sm italic text-[var(--text-muted)]">
              No brief facts available for this case.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
            {report.investigating_officer && (
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <User className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span>{report.investigating_officer}</span>
              </div>
            )}
            {report.occurrence_date && (
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span>{formatDate(report.occurrence_date)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
