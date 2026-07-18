import { useState } from "react";
import { Command } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm text-[var(--text-muted)] hover:border-[var(--border-default)]"
      >
        <Command className="h-4 w-4" />
        <span>Search</span>
        <kbd className="ml-4 rounded border border-[var(--border-default)] bg-[var(--bg-card)] px-1.5 py-0.5 text-[10px]">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
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
      )}
    </>
  );
}
