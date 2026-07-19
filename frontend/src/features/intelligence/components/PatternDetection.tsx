import { useMemo } from "react";
import { motion } from "framer-motion";
import { Radar, TrendingUp, MapPin, Users, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import type { HotspotEntry, MonthlyTrend, CrimeTypeSummary } from "@/types/analytics";

interface PatternDetectionProps {
  hotspots?: HotspotEntry[];
  trends?: MonthlyTrend[];
  crimeTypes?: CrimeTypeSummary[];
  isLoading?: boolean;
}

interface DetectedPattern {
  type: "cluster" | "temporal" | "serial" | "geographic";
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  confidence: number;
}

function detectPatterns(
  hotspots: HotspotEntry[] | undefined,
  trends: MonthlyTrend[] | undefined,
  crimeTypes: CrimeTypeSummary[] | undefined,
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  // Geographic cluster detection
  if (hotspots && hotspots.length >= 3) {
    const topHotspots = hotspots.slice(0, 3);
    const sameDistrict = topHotspots.every((h) => h.districtName === topHotspots[0].districtName);

    if (sameDistrict) {
      patterns.push({
        type: "cluster",
        title: "Geographic Cluster",
        description: `Top 3 hotspots are all in ${topHotspots[0].districtName}. Possible localized crime wave.`,
        severity: "high",
        confidence: 85,
      });
    } else if (topHotspots.every((h) => h.crimeCount >= 5)) {
      patterns.push({
        type: "geographic",
        title: "Multi-District Activity",
        description: `${hotspots.length} districts with elevated crime. Broader enforcement coordination may be needed.`,
        severity: "medium",
        confidence: 78,
      });
    }
  }

  // Temporal pattern detection
  if (trends && trends.length >= 3) {
    const recent = trends.slice(-3);
    const allRising = recent.every(
      (t, i) => i === 0 || t.count >= recent[i - 1].count,
    );
    const allFalling = recent.every(
      (t, i) => i === 0 || t.count <= recent[i - 1].count,
    );

    if (allRising && recent[2].count > recent[0].count * 1.3) {
      patterns.push({
        type: "temporal",
        title: "Escalating Trend",
        description: `Case count rising ${Math.round(((recent[2].count - recent[0].count) / recent[0].count) * 100)}% over last 3 periods. Requires immediate attention.`,
        severity: "high",
        confidence: 82,
      });
    }

    if (allFalling) {
      patterns.push({
        type: "temporal",
        title: "Declining Trend",
        description: "Case count consistently decreasing. Investigation efforts may be effective.",
        severity: "low",
        confidence: 75,
      });
    }

    // Volatility detection
    if (trends.length >= 4) {
      const variance = trends.slice(-4).reduce((sum, t, i, arr) => {
        if (i === 0) return sum;
        return sum + Math.abs(t.count - arr[i - 1].count);
      }, 0) / 3;
      const avg = trends.slice(-4).reduce((s, t) => s + t.count, 0) / 4;

      if (avg > 0 && variance / avg > 0.4) {
        patterns.push({
          type: "temporal",
          title: "High Volatility",
          description: "Crime count fluctuating significantly month to month. Unpredictable patterns detected.",
          severity: "medium",
          confidence: 70,
        });
      }
    }
  }

  // Crime type concentration
  if (crimeTypes && crimeTypes.length >= 2) {
    const sorted = [...crimeTypes].sort((a, b) => b.count - a.count);
    const total = sorted.reduce((s, c) => s + c.count, 0);
    if (total > 0 && sorted[0].count / total > 0.4) {
      patterns.push({
        type: "serial",
        title: "Crime Type Concentration",
        description: `${sorted[0].name} accounts for ${Math.round((sorted[0].count / total) * 100)}% of all cases. Possible systemic issue.`,
        severity: sorted[0].count / total > 0.6 ? "high" : "medium",
        confidence: 80,
      });
    }
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  patterns.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return patterns;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  cluster: <MapPin className="h-4 w-4" />,
  temporal: <TrendingUp className="h-4 w-4" />,
  serial: <Users className="h-4 w-4" />,
  geographic: <Radar className="h-4 w-4" />,
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-red-500/30 bg-red-500/5",
  high: "border-orange-500/30 bg-orange-500/5",
  medium: "border-yellow-500/30 bg-yellow-500/5",
  low: "border-green-500/30 bg-green-500/5",
};

const SEVERITY_TEXT: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-green-400",
};

export function PatternDetection({
  hotspots,
  trends,
  crimeTypes,
  isLoading,
}: PatternDetectionProps) {
  const patterns = useMemo(
    () => detectPatterns(hotspots, trends, crimeTypes),
    [hotspots, trends, crimeTypes],
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Radar className="h-4 w-4 text-[var(--accent)]" />
            Pattern Detection
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
          <Radar className="h-4 w-4 text-[var(--accent)]" />
          Pattern Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/30 bg-slate-800/20 p-3">
            <AlertTriangle className="h-4 w-4 text-slate-500" />
            <p className="text-xs text-slate-400">
              No significant patterns detected. Data volume may be insufficient for pattern analysis.
            </p>
          </div>
        ) : (
          patterns.map((p, i) => (
            <motion.div
              key={`${p.type}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-lg border p-3 ${SEVERITY_STYLES[p.severity]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={SEVERITY_TEXT[p.severity]}>
                    {TYPE_ICONS[p.type]}
                  </span>
                  <span className="text-sm font-medium text-slate-200">{p.title}</span>
                </div>
                <span className="text-[10px] text-slate-500">{p.confidence}% conf.</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{p.description}</p>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
