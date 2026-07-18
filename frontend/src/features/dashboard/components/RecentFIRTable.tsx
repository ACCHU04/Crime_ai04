import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/formatters";
import type { Case } from "@/types";

interface RecentFIRTableProps {
  data: Case[] | undefined;
  isLoading: boolean;
}

export function RecentFIRTable({ data, isLoading }: RecentFIRTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent FIRs</CardTitle>
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
          <CardTitle className="text-base">Recent FIRs</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No FIRs" description="No recent cases found." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent FIRs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">FIR No.</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">Date</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">District</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-2.5 font-medium text-[var(--text-primary)]">
                    {c.fir_number}
                  </td>
                  <td className="py-2.5 text-[var(--text-secondary)]">
                    {formatDate(c.occurrence_date)}
                  </td>
                  <td className="py-2.5 text-[var(--text-secondary)]">
                    District {c.district_id}
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={c.case_status_id === 1 ? "Under Investigation" : "Closed"} />
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
