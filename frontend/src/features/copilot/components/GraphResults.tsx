import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GraphPayload } from "../types";

interface GraphResultsProps {
  payload: GraphPayload;
}

export function GraphResults({ payload }: GraphResultsProps) {
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
        onClick={() => navigate("/network")}
        className="gap-1.5"
      >
        View Network
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
}

function renderContent(type: string, data: unknown): React.ReactNode {
  if (!data || typeof data !== "object") return <p>No graph data available.</p>;

  const d = data as Record<string, unknown>;

  switch (type) {
    case "full_network": {
      const stats = d.stats as { node_count?: number; edge_count?: number } | undefined;
      const nodes = d.nodes as unknown[] | undefined;
      const edges = d.edges as unknown[] | undefined;
      const nodeCount = stats?.node_count ?? nodes?.length ?? 0;
      const edgeCount = stats?.edge_count ?? edges?.length ?? 0;
      return (
        <p>
          Full network: {nodeCount} node{nodeCount === 1 ? "" : "s"}, {edgeCount} connection{edgeCount === 1 ? "" : "s"}.
        </p>
      );
    }

    case "person_network": {
      const connected = d.connected_entities as { name?: string; type?: string }[] | undefined;
      const personName = d.person_name as string | undefined;
      if (!connected || connected.length === 0) {
        return <p>No connections found{personName ? ` for ${personName}` : ""}.</p>;
      }
      return (
        <div>
          <p className="mb-1">
            {personName ? `${personName} is connected to` : "Connected to"} {connected.length} entit{connected.length === 1 ? "y" : "ies"}:
          </p>
          <ul className="ml-4 list-disc space-y-0.5">
            {connected.slice(0, 8).map((e, i) => (
              <li key={i}>
                <span className="text-[var(--text-primary)]">{e.name ?? "Unknown"}</span>
                {e.type && (
                  <span className="text-[var(--text-muted)]"> ({e.type})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case "common_accused": {
      const accused = d.accused as { name?: string; case_count?: number; cases?: number }[] | undefined;
      if (!accused || accused.length === 0) {
        return <p>No common accused found.</p>;
      }
      return (
        <div>
          <p className="mb-1">{accused.length} repeat offender{accused.length === 1 ? "" : "s"}:</p>
          <ul className="ml-4 list-disc space-y-0.5">
            {accused.map((a, i) => (
              <li key={i}>
                <span className="text-[var(--text-primary)]">{a.name ?? "Unknown"}</span>
                <span className="text-[var(--text-muted)]">
                  {" — "}
                  {a.case_count ?? a.cases ?? 0} cases
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    default:
      return <p>Graph data loaded.</p>;
  }
}
