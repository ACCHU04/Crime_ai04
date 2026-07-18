import { RefreshCw, Globe, Users, AlertTriangle } from "lucide-react";
import type { ViewMode } from "../types";

interface NetworkControlsProps {
  viewMode: ViewMode;
  onSwitchMode: (mode: ViewMode) => void;
  onRefresh: () => void;
}

const MODES: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: "full", label: "Full Network", icon: <Globe className="h-4 w-4" /> },
  { key: "search", label: "Person Search", icon: <Users className="h-4 w-4" /> },
  { key: "common", label: "Repeat Offenders", icon: <AlertTriangle className="h-4 w-4" /> },
];

export function NetworkControls({ viewMode, onSwitchMode, onRefresh }: NetworkControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-1">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => onSwitchMode(m.key)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === m.key
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>
      <button
        onClick={onRefresh}
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
        title="Refresh"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}
