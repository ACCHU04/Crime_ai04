import { UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { RepeatOffender } from "../types";

interface RepeatOffenderTableProps {
  data: RepeatOffender[] | undefined;
  isLoading: boolean;
  minCases: number;
  setMinCases: (v: number) => void;
}

export function RepeatOffenderTable({ data, isLoading, minCases, setMinCases }: RepeatOffenderTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Repeat Offenders</CardTitle>
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
          <CardTitle className="text-base">Repeat Offenders</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No repeat offenders" description={`No accused persons linked to ${minCases}+ cases.`} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <UserX className="h-4 w-4 text-red-400" />
            Repeat Offenders
          </span>
          <div className="flex gap-1">
            {[2, 3, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMinCases(n)}
                className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                  minCases === n
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
                }`}
              >
                {n}+
              </button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">Name</th>
                <th className="pb-2 text-center font-medium text-[var(--text-muted)]">Cases</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">FIR Numbers</th>
                <th className="pb-2 text-left font-medium text-[var(--text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr
                  key={r.accused_id}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="py-2.5 font-medium text-[var(--text-primary)]">{r.full_name}</td>
                  <td className="py-2.5 text-center">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                      {r.case_count}
                    </span>
                  </td>
                  <td className="py-2.5 text-xs text-[var(--text-secondary)]">{r.cases.join(", ")}</td>
                  <td className="py-2.5 text-xs text-[var(--text-muted)]">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
