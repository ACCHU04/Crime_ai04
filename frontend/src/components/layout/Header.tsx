import { useLocation } from "react-router-dom";
import { Bell, Sun, Moon, User, Command } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useSidebar } from "@/hooks/useSidebar";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/investigation": "Investigation",
  "/analytics": "Analytics",
  "/network": "Network Intelligence",
  "/copilot": "AI Copilot",
  "/settings": "Settings",
};

export function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { collapsed } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Crime Intelligence Platform";

  useKeyboardShortcut("k", () => setSearchOpen((p) => !p), { meta: true });

  return (
    <header
      className="sticky top-0 z-30 flex h-[var(--header-height)] items-center border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/80 px-4 backdrop-blur-md"
      style={{ marginLeft: collapsed ? 64 : 256 }}
    >
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-sm font-semibold text-[var(--text-primary)]">
          {pageTitle}
        </h1>

        <div className="relative ml-auto hidden max-w-md flex-1 md:block">
          <Command className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search cases, people, locations..."
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1.5 pl-9 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            readOnly
            onClick={() => setSearchOpen(true)}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[var(--border-default)] bg-[var(--bg-card)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <div className="ml-2 h-6 w-px bg-[var(--border-subtle)]" />

        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-muted)]">
            <User className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <span className="hidden text-sm font-medium lg:block">Admin</span>
        </button>
      </div>

      {searchOpen && (
        <CommandPaletteOverlay onClose={() => setSearchOpen(false)} />
      )}
    </header>
  );
}

function CommandPaletteOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4">
          <Command className="h-4 w-4 text-[var(--text-muted)]" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <kbd className="rounded border border-[var(--border-default)] bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>
        <div className="p-3 text-sm text-[var(--text-muted)]">
          Start typing to search cases, analytics, and more...
        </div>
      </div>
    </div>
  );
}
