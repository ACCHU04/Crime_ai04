import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { Search, LayoutDashboard, SearchIcon, BarChart3, Network, Bot, Settings, FileText, Users, MapPin } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", description: "Crime intelligence overview", icon: LayoutDashboard, path: "/dashboard" },
  { id: "investigation", label: "Investigation", description: "Case deep-dive", icon: SearchIcon, path: "/investigation" },
  { id: "analytics", label: "Analytics", description: "Trends and statistics", icon: BarChart3, path: "/analytics" },
  { id: "network", label: "Network Intelligence", description: "Criminal network graph", icon: Network, path: "/network" },
  { id: "copilot", label: "AI Copilot", description: "Natural language assistant", icon: Bot, path: "/copilot" },
  { id: "settings", label: "Settings", description: "Platform configuration", icon: Settings, path: "/settings" },
];

const QUICK_ACTIONS = [
  { id: "search-cases", label: "Search cases...", icon: FileText, path: "/investigation" },
  { id: "view-network", label: "View criminal network", icon: Users, path: "/network" },
  { id: "check-hotspots", label: "Check hotspots", icon: MapPin, path: "/analytics" },
  { id: "ask-copilot", label: "Ask AI Copilot", icon: Bot, path: "/copilot" },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleSelect = useCallback(
    (path: string) => {
      onClose();
      navigate(path);
    },
    [onClose, navigate],
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Palette */}
      <div className="relative w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        <Command shouldFilter={true} loop>
          {/* Search input */}
          <div className="flex items-center border-b border-slate-700 px-4">
            <Search className="h-4 w-4 text-slate-500 shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent px-3 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-xs text-slate-500">
              No results found.
            </Command.Empty>

            {/* Navigation */}
            <Command.Group heading="Navigation" className="px-1">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.id}
                    value={`${item.label} ${item.description}`}
                    onSelect={() => handleSelect(item.path)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-pointer data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-[11px] text-slate-500">{item.description}</p>
                    </div>
                  </Command.Item>
                );
              })}
            </Command.Group>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="px-1 mt-1">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Command.Item
                    key={action.id}
                    value={action.label}
                    onSelect={() => handleSelect(action.path)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-pointer data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4 text-slate-500" />
                    <span>{action.label}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div className="border-t border-slate-700 px-4 py-2 flex items-center justify-between text-[10px] text-slate-600">
            <span>Navigate with arrows, Enter to select</span>
            <span>Crime Intelligence Platform</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
