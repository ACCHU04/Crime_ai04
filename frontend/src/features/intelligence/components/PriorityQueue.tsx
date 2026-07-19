import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ListOrdered, ArrowRight, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useQuery } from "@tanstack/react-query";
import * as casesApi from "@/features/investigations/api/casesApi";
import { computeRiskScore } from "../utils/riskScore";
import type { Case } from "@/types";

interface PrioritizedCase {
  case: Case;
  riskScore: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  daysPending: number;
}

export function PriorityQueue() {
  const navigate = useNavigate();

  const allCases = useQuery({
    queryKey: ["all-cases-for-priority"],
    queryFn: () => casesApi.getAllCases(0, 100),
    select: (res) => res.data,
  });

  const prioritized = useMemo(() => {
    if (!allCases.data) return [];

    const cases: PrioritizedCase[] = allCases.data.map((c) => {
      const daysPending = c.fir_date
        ? Math.floor((Date.now() - new Date(c.fir_date).getTime()) / 86400000)
        : 0;

      const risk = computeRiskScore({
        isRepeatOffender: false,
        isViolentCrime: false,
        accusedCount: 0,
        daysPending,
        networkSize: 0,
        victimCount: 0,
        weaponInvolved: false,
      });

      return {
        case: c,
        riskScore: risk.score,
        riskLevel: risk.level,
        daysPending,
      };
    });

    return cases.sort((a, b) => b.riskScore - a.riskScore);
  }, [allCases.data]);

  if (allCases.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListOrdered className="h-4 w-4 text-[var(--accent)]" />
            Priority Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="table" count={5} />
        </CardContent>
      </Card>
    );
  }

  const severityBg: Record<string, string> = {
    critical: "border-red-500/40 bg-red-500/5",
    high: "border-orange-500/40 bg-orange-500/5",
    medium: "border-yellow-500/40 bg-yellow-500/5",
    low: "border-green-500/40 bg-green-500/5",
  };

  const severityText: Record<string, string> = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-green-400",
  };

  const severityLabel: Record<string, string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListOrdered className="h-4 w-4 text-[var(--accent)]" />
          Priority Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {prioritized.length === 0 ? (
          <EmptyState title="No cases" description="No cases to prioritize." />
        ) : (
          <>
            <p className="text-xs text-[var(--text-muted)]">
              {prioritized.length} cases ranked by risk score
            </p>
            {prioritized.map((p, i) => (
              <motion.button
                key={p.case.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/investigation/${p.case.id}`)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:brightness-110 ${severityBg[p.riskLevel]}`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {p.case.fir_number}
                    </span>
                    <span className={`text-[10px] font-medium ${severityText[p.riskLevel]}`}>
                      {severityLabel[p.riskLevel]}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {p.daysPending} days pending
                    {p.case.occurrence_date && ` • ${new Date(p.case.occurrence_date).toLocaleDateString("en-IN")}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-lg font-bold ${severityText[p.riskLevel]}`}>
                    {p.riskScore}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
              </motion.button>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
