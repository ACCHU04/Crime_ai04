import { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { useRecommendations } from "../hooks/useRecommendations";
import { useRiskAssessment } from "../hooks/useRiskAssessment";

interface OfficerAssistantProps {
  caseId: number;
  crimeType: string;
  status: string;
  district: string;
  daysPending: number;
  accusedCount: number;
  victimCount: number;
  isRepeatOffender?: boolean;
}

export function OfficerAssistant({
  caseId,
  crimeType,
  status,
  district,
  daysPending,
  accusedCount,
  victimCount,
  isRepeatOffender = false,
}: OfficerAssistantProps) {
  const risk = useRiskAssessment({
    crimeType,
    status,
    daysPending,
    accusedCount,
    victimCount,
    district,
    isRepeatOffender,
  });

  const recs = useRecommendations({
    crimeType,
    status,
    daysPending,
    accusedCount,
    victimCount,
    district,
    isRepeatOffender,
    hasVictims: victimCount > 0,
    hasWitnesses: false,
    networkSize: 0,
  });

  if (risk.isLoading || recs.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-[var(--accent)]" />
            Officer Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="text" count={4} />
        </CardContent>
      </Card>
    );
  }

  const riskResult = risk.data;
  const recsResult = recs.data;

  const riskColor =
    riskResult?.level === "critical"
      ? "text-red-400"
      : riskResult?.level === "high"
      ? "text-orange-400"
      : riskResult?.level === "medium"
      ? "text-yellow-400"
      : "text-green-400";

  const riskBorderColor =
    riskResult?.level === "critical"
      ? "border-red-500/30"
      : riskResult?.level === "high"
      ? "border-orange-500/30"
      : riskResult?.level === "medium"
      ? "border-yellow-500/30"
      : "border-green-500/30";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4 text-[var(--accent)]" />
          Officer Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Score */}
        {riskResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-lg border p-3 ${riskBorderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${riskColor}`} />
                <span className="text-sm font-medium text-slate-200">Risk Assessment</span>
              </div>
              <span className={`text-lg font-bold ${riskColor}`}>
                {riskResult.score}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{riskResult.summary}</p>

            {riskResult.reasons.length > 0 && (
              <div className="mt-2 space-y-1">
                {riskResult.reasons.slice(0, 3).map((reason, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                    <span className="mt-1 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                    {reason}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Recommended Actions */}
        {recsResult && recsResult.matchedRules.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs font-medium text-slate-300">Recommended Next Steps</span>
            </div>
            <div className="space-y-1.5">
              {recsResult.reasons.map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 rounded-md border border-slate-700/40 bg-slate-800/30 px-2.5 py-1.5"
                >
                  <ArrowRight className="h-3 w-3 text-[var(--accent)] shrink-0" />
                  <span className="text-xs text-slate-400">{reason}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <BookOpen className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Quick Reference</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <span className="text-slate-500">District</span>
            <span className="text-slate-400">{district}</span>
            <span className="text-slate-500">Status</span>
            <span className="text-slate-400">{status}</span>
            <span className="text-slate-500">Days Pending</span>
            <span className={`font-medium ${daysPending > 60 ? "text-orange-400" : "text-slate-400"}`}>
              {daysPending}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
