import type { IntelligenceResult } from "../types";
import SeverityBadge from "./SeverityBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import WhyButton from "./WhyButton";
import ActionItem from "./ActionItem";

interface Props {
  result: IntelligenceResult;
  className?: string;
}

export default function IntelligenceCard({ result, className = "" }: Props) {
  const borderColors: Record<string, string> = {
    critical: "border-red-500/30",
    high: "border-orange-500/30",
    medium: "border-yellow-500/30",
    low: "border-green-500/30",
  };

  return (
    <div className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm p-5 ${borderColors[result.severity]} ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold text-slate-200 truncate">{result.title}</h3>
          <SeverityBadge severity={result.severity} />
        </div>
        <ConfidenceBadge confidence={result.confidence} />
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-400 mb-4">{result.summary}</p>

      {/* Insights */}
      {result.insights.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {result.insights.map((insight, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{insight.label}</span>
              <span className={`text-sm font-medium ${insight.severity === "critical" ? "text-red-400" : insight.severity === "high" ? "text-orange-400" : insight.severity === "medium" ? "text-yellow-400" : "text-slate-300"}`}>
                {insight.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {result.actions.length > 0 && (
        <div className="space-y-2 mb-3">
          {result.actions.map((action, i) => (
            <ActionItem key={i} action={action} />
          ))}
        </div>
      )}

      {/* Why? */}
      {result.reasons.length > 0 && (
        <WhyButton reasons={result.reasons} severity={result.severity} />
      )}
    </div>
  );
}
