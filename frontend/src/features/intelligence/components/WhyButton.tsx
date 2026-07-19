import { useState } from "react";

interface Props {
  reasons: string[];
  severity?: "critical" | "high" | "medium" | "low";
}

export default function WhyButton({ reasons, severity = "medium" }: Props) {
  const [open, setOpen] = useState(false);

  if (reasons.length === 0) return null;

  const borderColors: Record<string, string> = {
    critical: "border-red-500/30 bg-red-500/5",
    high: "border-orange-500/30 bg-orange-500/5",
    medium: "border-yellow-500/30 bg-yellow-500/5",
    low: "border-green-500/30 bg-green-500/5",
  };

  const buttonColors: Record<string, string> = {
    critical: "text-red-400 hover:text-red-300",
    high: "text-orange-400 hover:text-orange-300",
    medium: "text-yellow-400 hover:text-yellow-300",
    low: "text-green-400 hover:text-green-300",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-xs font-medium transition-colors ${buttonColors[severity]}`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Why?
      </button>

      {open && (
        <div className={`absolute z-50 mt-2 w-72 rounded-lg border p-3 shadow-xl backdrop-blur-sm ${borderColors[severity]}`}>
          <p className="text-xs font-medium text-slate-300 mb-2">Reasons</p>
          <ul className="space-y-1.5">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
