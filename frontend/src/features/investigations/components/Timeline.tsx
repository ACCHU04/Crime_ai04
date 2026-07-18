import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { getTimelineColor, getTimelineIcon } from "../utils";
import { formatDateTime } from "@/lib/formatters";
import type { TimelineData } from "../types";

interface TimelineProps {
  timeline: TimelineData | undefined;
  isLoading: boolean;
}

export function Timeline({ timeline, isLoading }: TimelineProps) {
  if (isLoading) return <LoadingSkeleton variant="card" />;
  if (!timeline?.events?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No timeline events" description="Timeline data is not available for this case." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative ml-3 border-l-2 border-[var(--border-subtle)] pl-6">
          {timeline.events.map((event, i) => {
            const Icon = getTimelineIcon(event.type);
            return (
              <div key={i} className="relative mb-6 last:mb-0">
                <div className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2 ${getTimelineColor(event.type)}`}>
                  <Icon className="h-3 w-3 text-[var(--text-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{event.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatDateTime(event.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
