import { formatDate } from "@/lib/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { SqlQueryPayload } from "../types";

interface SqlResultsTableProps {
  payload: SqlQueryPayload;
}

export function SqlResultsTable({ payload }: SqlResultsTableProps) {
  const rows = payload.results?.slice(0, 20) ?? [];
  const total = payload.count ?? rows.length;
  const truncated = total > 20;

  if (rows.length === 0) {
    return (
      <p className="text-xs text-[var(--text-muted)]">No results found.</p>
    );
  }

  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
            <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">FIR</th>
            <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">Crime</th>
            <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">District</th>
            <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">Status</th>
            <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border-subtle)] last:border-0">
              <td className="px-3 py-2 font-mono text-[var(--text-primary)]">
                {String(row.firnumber ?? "N/A")}
              </td>
              <td className="px-3 py-2 text-[var(--text-primary)]">
                {String(row.crime_type ?? "N/A")}
              </td>
              <td className="px-3 py-2 text-[var(--text-primary)]">
                {String(row.district ?? "N/A")}
              </td>
              <td className="px-3 py-2">
                <StatusBadge status={String(row.status ?? "")} />
              </td>
              <td className="px-3 py-2 text-[var(--text-muted)]">
                {formatDate(String(row.occurrencedate ?? null))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {truncated && (
        <p className="px-3 py-2 text-xs text-[var(--text-muted)]">
          Showing 20 of {total} results
        </p>
      )}
    </div>
  );
}
