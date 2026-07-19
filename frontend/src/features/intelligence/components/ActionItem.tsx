import type { Action } from "../types";
import { SEVERITY_COLORS } from "../constants/severity";

interface Props {
  action: Action;
}

export default function ActionItem({ action }: Props) {
  return (
    <button
      onClick={action.onClick}
      className="w-full flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5 text-left transition-colors hover:border-blue-500/30 hover:bg-blue-500/5 group"
    >
      <div className="w-8 h-8 rounded-md bg-slate-700/50 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
        <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-200 group-hover:text-blue-300 truncate">{action.label}</p>
        <p className="text-[11px] text-slate-400 truncate">{action.description}</p>
      </div>
    </button>
  );
}
