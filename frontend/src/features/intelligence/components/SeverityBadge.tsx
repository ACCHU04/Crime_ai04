import type { Severity } from "../types";
import { SEVERITY_COLORS, SEVERITY_LABELS } from "../constants/severity";

interface Props {
  severity: Severity;
  size?: "sm" | "md";
}

export default function SeverityBadge({ severity, size = "sm" }: Props) {
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${SEVERITY_COLORS[severity]} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${severity === "critical" ? "bg-red-500" : severity === "high" ? "bg-orange-500" : severity === "medium" ? "bg-yellow-500" : "bg-green-500"}`} />
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
