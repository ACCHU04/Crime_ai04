import { Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { CaseReport } from "../types";

interface OfficersPanelProps {
  report: CaseReport | undefined;
  isLoading: boolean;
}

export function OfficersPanel({ report, isLoading }: OfficersPanelProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;
  if (!report?.investigating_officer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-purple-400" />
            Investigating Officer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No officer assigned" description="No investigating officer has been assigned to this case." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4 text-purple-400" />
          Investigating Officer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
          <div className="font-medium text-[var(--text-primary)]">{report.investigating_officer}</div>
          <div className="mt-1 text-xs text-[var(--text-secondary)]">
            Assigned to {report.district ?? "unknown district"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
