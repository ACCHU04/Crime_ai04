import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NODE_COLORS } from "@/lib/constants";
import { EDGE_COLORS } from "../utils";

const NODE_TYPES = [
  { type: "case", label: "Case" },
  { type: "accused", label: "Accused" },
  { type: "victim", label: "Victim" },
  { type: "district", label: "District" },
  { type: "officer", label: "Officer" },
];

const EDGE_TYPES = [
  { type: "occurred_in", label: "Occurred In" },
  { type: "accused_in", label: "Accused In" },
  { type: "victim_of", label: "Victim Of" },
  { type: "assigned_to", label: "Assigned To" },
];

export function RelationshipLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="mb-1.5 text-xs font-medium text-[var(--text-muted)]">Node Types</h4>
          <div className="space-y-1">
            {NODE_TYPES.map((n) => (
              <div key={n.type} className="flex items-center gap-2 text-xs">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: NODE_COLORS[n.type] }}
                />
                <span className="text-[var(--text-secondary)]">{n.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-1.5 text-xs font-medium text-[var(--text-muted)]">Edge Types</h4>
          <div className="space-y-1">
            {EDGE_TYPES.map((e) => (
              <div key={e.type} className="flex items-center gap-2 text-xs">
                <span
                  className="h-0.5 w-4 rounded"
                  style={{ backgroundColor: EDGE_COLORS[e.type] }}
                />
                <span className="text-[var(--text-secondary)]">{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
