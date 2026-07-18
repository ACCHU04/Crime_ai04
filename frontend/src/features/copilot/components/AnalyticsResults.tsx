import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/formatters";
import type { AnalyticsPayload } from "../types";

interface AnalyticsResultsProps {
  payload: AnalyticsPayload;
}

export function AnalyticsResults({ payload }: AnalyticsResultsProps) {
  const navigate = useNavigate();
  const { type, data } = payload;

  return (
    <div className="mt-3 space-y-3">
      <div className="text-xs text-[var(--text-muted)]">
        {renderContent(type, data)}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/analytics")}
        className="gap-1.5"
      >
        View full analytics
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
}

function renderContent(type: string, data: unknown): React.ReactNode {
  if (!data || typeof data !== "object") return <p>No data available.</p>;

  switch (type) {
    case "dashboard": {
      const d = data as Record<string, number>;
      return (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(d).map(([key, value]) => (
            <div key={key}>
              <span className="text-[var(--text-secondary)]">{key}: </span>
              <span className="font-medium text-[var(--text-primary)]">{formatNumber(value)}</span>
            </div>
          ))}
        </div>
      );
    }

    case "hotspots": {
      const items = (data as { district_name?: string; districtname?: string; case_count?: number; count?: number }[]) ?? [];
      return (
        <ul className="space-y-1">
          {items.slice(0, 5).map((item, i) => (
            <li key={i}>
              <span className="text-[var(--text-primary)]">
                {item.district_name ?? item.districtname ?? "Unknown"}
              </span>
              <span className="text-[var(--text-muted)]">
                {" — "}
                {formatNumber(item.case_count ?? item.count ?? 0)} cases
              </span>
            </li>
          ))}
        </ul>
      );
    }

    case "trends": {
      const items = (data as { month?: string; count?: number }[]) ?? [];
      if (items.length === 0) return <p>No trend data available.</p>;
      const total = items.reduce((sum, t) => sum + (t.count ?? 0), 0);
      const avg = Math.round(total / items.length);
      return (
        <p>
          {items.length} months of data. Average {formatNumber(avg)} cases/month.
        </p>
      );
    }

    case "repeat_offenders": {
      const items = (data as { accused_name?: string; name?: string; case_count?: number; cases?: number }[]) ?? [];
      if (items.length === 0) return <p>No repeat offenders found.</p>;
      return (
        <ul className="space-y-1">
          {items.slice(0, 5).map((item, i) => (
            <li key={i}>
              <span className="text-[var(--text-primary)]">
                {item.accused_name ?? item.name ?? "Unknown"}
              </span>
              <span className="text-[var(--text-muted)]">
                {" — "}
                {formatNumber(item.case_count ?? item.cases ?? 0)} cases
              </span>
            </li>
          ))}
        </ul>
      );
    }

    case "pending_cases": {
      const items = (data as { district?: string; count?: number }[]) ?? [];
      if (items.length === 0) return <p>No pending cases.</p>;
      const total = items.reduce((sum, p) => sum + (p.count ?? 0), 0);
      return (
        <p>
          {formatNumber(total)} pending cases across {items.length} district{items.length === 1 ? "" : "s"}.
        </p>
      );
    }

    default:
      return <p>Analytics data loaded.</p>;
  }
}
