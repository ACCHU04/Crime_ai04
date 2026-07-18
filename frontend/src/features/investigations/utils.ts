import { Clock, FileText, Database, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TimelineEvent } from "./types";

export function getTimelineColor(type: TimelineEvent["type"]): string {
  const colors: Record<TimelineEvent["type"], string> = {
    occurrence: "border-red-500 bg-red-500/20",
    fir: "border-yellow-500 bg-yellow-500/20",
    created: "border-blue-500 bg-blue-500/20",
    status: "border-green-500 bg-green-500/20",
  };
  return colors[type] ?? "border-slate-500 bg-slate-500/20";
}

export function getTimelineIcon(type: TimelineEvent["type"]): LucideIcon {
  const icons: Record<TimelineEvent["type"], LucideIcon> = {
    occurrence: Clock,
    fir: FileText,
    created: Database,
    status: Shield,
  };
  return icons[type] ?? Clock;
}
