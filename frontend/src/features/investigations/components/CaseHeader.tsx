import { FileText, MapPin, Tag } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { formatDate } from "@/lib/formatters";
import type { CaseReport } from "../types";

interface CaseHeaderProps {
  report: CaseReport | undefined;
  isLoading: boolean;
}

export function CaseHeader({ report, isLoading }: CaseHeaderProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;

  if (!report) return null;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--accent)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {report.fir_number}
            </h3>
            {report.status && <StatusBadge status={report.status} />}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            {report.crime_head && (
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {report.crime_head}
                {report.crime_subhead && ` — ${report.crime_subhead}`}
              </span>
            )}
            {report.district && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {report.district}
              </span>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-[var(--text-muted)]">
          <div>Occurrence: {formatDate(report.occurrence_date)}</div>
          <div>FIR Date: {formatDate(report.fir_date)}</div>
        </div>
      </div>
    </div>
  );
}
