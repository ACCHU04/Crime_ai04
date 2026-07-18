import { Bell } from "lucide-react";
import { useState } from "react";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const count = 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-lg">
          <div className="border-b border-[var(--border-subtle)] px-4 py-3">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Notifications
            </span>
          </div>
          <div className="p-4 text-center text-sm text-[var(--text-muted)]">
            No new notifications
          </div>
        </div>
      )}
    </div>
  );
}
