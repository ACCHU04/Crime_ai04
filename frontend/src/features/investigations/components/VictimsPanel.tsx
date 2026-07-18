import { UserX } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { Victim } from "../types";

interface VictimsPanelProps {
  victims: Victim[] | undefined;
  isLoading: boolean;
}

export function VictimsPanel({ victims, isLoading }: VictimsPanelProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;

  const list = Array.isArray(victims) ? victims : [];

  if (!list.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserX className="h-4 w-4 text-green-400" />
            Victims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No victims recorded" description="No victim information is available for this case." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserX className="h-4 w-4 text-green-400" />
          Victims ({list.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {list.map((v) => (
            <div key={v.id} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
              <div className="font-medium text-[var(--text-primary)]">{v.victim_name}</div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
                {v.gender && <span>{v.gender}</span>}
                {v.age != null && <span>Age: {v.age}</span>}
                {v.occupation && <span>{v.occupation}</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
