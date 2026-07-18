import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/formatters";
import type { PendingCase } from "../types";

interface PendingCasesTableProps {
  data: PendingCase[] | undefined;
  isLoading: boolean;
  onViewCase?: (id: number) => void;
}

function getPendingDaysColor(days: number): string {
  if (days > 60) return "text-red-400";
  if (days > 30) return "text-orange-400";
  if (days > 14) return "text-yellow-400";
  return "text-green-400";
}

function getPendingDaysBarWidth(days: number): number {
  return Math.min(100, Math.round((days / 90) * 100));
}

export function PendingCasesTable({ data, isLoading, onViewCase }: PendingCasesTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Investigations</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="table" count={5} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Investigations</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No pending cases" description="All investigations are up to date." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pending Investigations ({data.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">Case</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">District</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">Date</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">Days</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">Status</th>
                {onViewCase && <th className="pb-2 text-right font-medium text-[var(--text-muted)]" />}
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr
                  key={c.case_id}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-2.5 font-medium text-[var(--text-primary)]">{c.case_number}</td>
                  <td className="py-2.5 text-[var(--text-secondary)]">{c.district}</td>
                  <td className="py-2.5 text-[var(--text-secondary)]">{formatDate(c.incident_date)}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                        <div
                          className="h-full rounded-full bg-current"
                          style={{ width: `${getPendingDaysBarWidth(c.days_pending)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getPendingDaysColor(c.days_pending)}`}>
                        {c.days_pending}d
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5"><StatusBadge status={c.status} /></td>
                  {onViewCase && (
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onViewCase(c.case_id)}
                        className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                      >
                        View <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
