import { UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { AccusedByCaseResponse } from "@/types";

interface SuspectsPanelProps {
  accused: AccusedByCaseResponse | undefined;
  isLoading: boolean;
}

export function SuspectsPanel({ accused, isLoading }: SuspectsPanelProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;

  const list = accused?.accused ?? [];

  if (!list.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCheck className="h-4 w-4 text-red-400" />
            Suspects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No suspects recorded" description="No accused persons are linked to this case." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCheck className="h-4 w-4 text-red-400" />
          Suspects ({list.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a.accused_id} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--text-primary)]">{a.accused_name}</span>
                {a.status && <StatusBadge status={a.status} />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
