import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/formatters";
import { getPendingDaysColor, getPendingDaysBarWidth } from "../utils";
import type { PendingCase } from "@/types";

interface PendingCasesTableProps {
  data: PendingCase[] | undefined;
  isLoading: boolean;
}

export function PendingCasesTable({ data, isLoading }: PendingCasesTableProps) {
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
        <CardTitle className="text-base">Pending Investigations</CardTitle>
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
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr
                  key={c.case_id}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-2.5 font-medium text-[var(--text-primary)]">
                    {c.case_number}
                  </td>
                  <td className="py-2.5 text-[var(--text-secondary)]">
                    {c.district}
                  </td>
                  <td className="py-2.5 text-[var(--text-secondary)]">
                    {formatDate(c.incident_date)}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                        <div
                          className="h-full rounded-full bg-current"
                          style={{
                            width: `${getPendingDaysBarWidth(c.days_pending)}%`,
                          }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getPendingDaysColor(c.days_pending)}`}>
                        {c.days_pending}d
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
