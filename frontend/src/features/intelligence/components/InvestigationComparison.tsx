import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompareArrows, ArrowRight, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { useQuery } from "@tanstack/react-query";
import * as casesApi from "@/features/investigations/api/casesApi";
import { computeCaseSimilarity } from "./CaseSimilarity";
import type { Case } from "@/types";

interface InvestigationComparisonProps {
  currentCase?: Case;
}

export function InvestigationComparison({ currentCase }: InvestigationComparisonProps) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const allCases = useQuery({
    queryKey: ["all-cases-for-comparison"],
    queryFn: () => casesApi.getAllCases(0, 50),
    select: (res) => res.data,
  });

  const comparedCase = useMemo(() => {
    if (!allCases.data || !selectedId) return null;
    return allCases.data.find((c) => c.id === selectedId) ?? null;
  }, [allCases.data, selectedId]);

  const similarity = useMemo(() => {
    if (!currentCase || !comparedCase) return null;
    return computeCaseSimilarity(currentCase, comparedCase);
  }, [currentCase, comparedCase]);

  if (allCases.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompareArrows className="h-4 w-4 text-[var(--accent)]" />
            Investigation Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="text" count={4} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GitCompareArrows className="h-4 w-4 text-[var(--accent)]" />
          Investigation Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Case selector */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 pl-8 pr-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          >
            <option value="">Select a case to compare...</option>
            {allCases.data
              ?.filter((c) => c.id !== currentCase?.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fir_number} — {c.occurrence_date ? new Date(c.occurrence_date).toLocaleDateString("en-IN") : "N/A"}
                </option>
              ))}
          </select>
        </div>

        {/* Comparison view */}
        {currentCase && comparedCase && similarity && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Current</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{currentCase.fir_number}</p>
                <p className="text-xs text-[var(--text-muted)]">ID: {currentCase.id}</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Compared</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{comparedCase.fir_number}</p>
                <p className="text-xs text-[var(--text-muted)]">ID: {comparedCase.id}</p>
              </div>
            </div>

            {/* Similarity score */}
            <div className="flex items-center justify-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
              <span className="text-xs text-[var(--text-muted)]">Similarity</span>
              <span className={`text-2xl font-bold ${
                similarity.score >= 70 ? "text-red-400" : similarity.score >= 40 ? "text-yellow-400" : "text-green-400"
              }`}>
                {similarity.score}%
              </span>
            </div>

            {/* Match reasons */}
            {similarity.reasons.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {similarity.reasons.map((reason, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-slate-700/50 bg-slate-800/50 px-2 py-0.5 text-[10px] text-slate-400"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            )}

            {/* Field comparison */}
            <div className="space-y-1.5">
              {[
                { label: "Crime Head", a: currentCase.crime_head_id, b: comparedCase.crime_head_id },
                { label: "District", a: currentCase.district_id, b: comparedCase.district_id },
                { label: "Status", a: currentCase.case_status_id, b: comparedCase.case_status_id },
                { label: "Gravity", a: currentCase.gravity_id, b: comparedCase.gravity_id },
              ].map((field) => (
                <div key={field.label} className="flex items-center justify-between rounded border border-[var(--border-subtle)] px-2 py-1 text-xs">
                  <span className="w-16 text-[var(--text-muted)]">{field.label}</span>
                  <span className={`flex-1 text-center ${field.a === field.b ? "text-green-400" : "text-[var(--text-muted)]"}`}>
                    {field.a ?? "N/A"}
                  </span>
                  <ArrowRight className="h-3 w-3 text-[var(--text-muted)] mx-1" />
                  <span className={`flex-1 text-center ${field.a === field.b ? "text-green-400" : "text-[var(--text-muted)]"}`}>
                    {field.b ?? "N/A"}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigate to compared case */}
            <button
              onClick={() => navigate(`/investigation/${comparedCase.id}`)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Open compared case <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        )}

        {!currentCase && (
          <p className="text-xs text-[var(--text-muted)]">
            Select a case first to enable comparison.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
