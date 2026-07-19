import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GitCompare, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import type { Case } from "@/types";
import * as casesApi from "@/features/investigations/api/casesApi";

interface CaseSimilarityProps {
  currentCase: Case;
}

interface SimilarCase extends Case {
  similarityScore: number;
  matchReasons: string[];
}

function computeCaseSimilarity(a: Case, b: Case): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (a.crime_head_id && b.crime_head_id && a.crime_head_id === b.crime_head_id) {
    score += 30;
    reasons.push("Same crime type");
  }
  if (a.district_id && b.district_id && a.district_id === b.district_id) {
    score += 30;
    reasons.push("Same district");
  }
  if (a.case_status_id && b.case_status_id && a.case_status_id === b.case_status_id) {
    score += 10;
    reasons.push("Same status");
  }
  if (a.occurrence_date && b.occurrence_date) {
    const daysDiff = Math.abs(
      new Date(a.occurrence_date).getTime() - new Date(b.occurrence_date).getTime(),
    ) / 86400000;
    if (daysDiff <= 30) {
      score += 20;
      reasons.push("Occurred within 30 days");
    } else if (daysDiff <= 90) {
      score += 10;
      reasons.push("Occurred within 90 days");
    }
  }
  if (a.gravity_id && b.gravity_id && a.gravity_id === b.gravity_id) {
    score += 10;
    reasons.push("Same gravity");
  }

  return { score: Math.min(score, 100), reasons };
}

export function CaseSimilarity({ currentCase }: CaseSimilarityProps) {
  const [expanded, setExpanded] = useState(false);

  const allCases = useQuery({
    queryKey: ["all-cases-for-similarity"],
    queryFn: () => casesApi.getAllCases(0, 50),
    select: (res) => res.data,
  });

  const similarCases = useMemo(() => {
    if (!allCases.data) return [];

    return allCases.data
      .filter((c) => c.id !== currentCase.id)
      .map((c) => {
        const { score, reasons } = computeCaseSimilarity(currentCase, c);
        return { ...c, similarityScore: score, matchReasons: reasons };
      })
      .filter((c) => c.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, expanded ? 10 : 3);
  }, [allCases.data, currentCase, expanded]);

  if (allCases.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="h-4 w-4 text-[var(--accent)]" />
            Case Similarity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="text" count={3} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GitCompare className="h-4 w-4 text-[var(--accent)]" />
          Case Similarity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {similarCases.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">
            No similar cases found in the database.
          </p>
        ) : (
          <>
            <p className="text-xs text-[var(--text-muted)]">
              {similarCases.length} similar case{similarCases.length !== 1 ? "s" : ""} found
            </p>

            {similarCases.map((sc) => (
              <motion.div
                key={sc.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {sc.fir_number}
                    </span>
                    <span className="ml-2 text-xs text-[var(--text-muted)]">
                      Score: {sc.similarityScore}%
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      sc.similarityScore >= 70
                        ? "text-red-400"
                        : sc.similarityScore >= 40
                        ? "text-yellow-400"
                        : "text-slate-400"
                    }`}
                  >
                    {sc.similarityScore >= 70
                      ? "High Match"
                      : sc.similarityScore >= 40
                      ? "Moderate"
                      : "Low"}
                  </span>
                </div>

                {sc.matchReasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sc.matchReasons.map((reason, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700/50 bg-slate-800/50 px-2 py-0.5 text-[10px] text-slate-400"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {allCases.data && allCases.data.length > 4 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center justify-center gap-1 rounded-lg border border-[var(--border-subtle)] py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {expanded ? (
                  <>Show less <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>Show more <ChevronDown className="h-3 w-3" /></>
                )}
              </button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
