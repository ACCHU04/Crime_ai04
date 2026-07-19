import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import type { Severity } from "../types";

interface ExplanationCardProps {
  title: string;
  severity: Severity;
  score: number;
  factors: { label: string; weight: number; triggered: boolean; description: string }[];
  className?: string;
}

const SEVERITY_BORDER: Record<Severity, string> = {
  critical: "border-red-500/30",
  high: "border-orange-500/30",
  medium: "border-yellow-500/30",
  low: "border-green-500/30",
};

const SEVERITY_BG: Record<Severity, string> = {
  critical: "bg-red-500/5",
  high: "bg-orange-500/5",
  medium: "bg-yellow-500/5",
  low: "bg-green-500/5",
};

const SEVERITY_TEXT: Record<Severity, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-green-400",
};

export function ExplanationCard({ title, severity, score, factors, className = "" }: ExplanationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const triggeredCount = factors.filter((f) => f.triggered).length;
  const maxWeight = factors.reduce((max, f) => Math.max(max, f.weight), 1);

  return (
    <div className={`rounded-xl border ${SEVERITY_BORDER[severity]} ${SEVERITY_BG[severity]} p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className={`h-4 w-4 ${SEVERITY_TEXT[severity]}`} />
          <span className="text-sm font-medium text-slate-200">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${SEVERITY_TEXT[severity]}`}>{score}</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Score bar */}
      <div className="relative h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            severity === "critical" ? "bg-red-500" :
            severity === "high" ? "bg-orange-500" :
            severity === "medium" ? "bg-yellow-500" : "bg-green-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <p className="text-[10px] text-slate-500 mb-1">{triggeredCount} of {factors.length} factors triggered</p>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mt-3">
              {factors.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                    f.triggered
                      ? "border-slate-600/50 bg-slate-800/50"
                      : "border-slate-700/30 bg-transparent opacity-50"
                  }`}
                >
                  {/* Weight bar */}
                  <div className="w-12 shrink-0">
                    <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${f.triggered ? "bg-[var(--accent)]" : "bg-slate-600"}`}
                        style={{ width: `${(f.weight / maxWeight) * 100}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-600 mt-0.5 text-center">w:{f.weight}</p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${f.triggered ? "text-slate-200" : "text-slate-400"}`}>
                        {f.label}
                      </span>
                      {f.triggered && (
                        <span className="text-[9px] px-1 py-0 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
