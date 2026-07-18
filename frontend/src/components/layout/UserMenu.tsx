import { User, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/constants";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-muted)]">
          <User className="h-4 w-4 text-[var(--accent)]" />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-lg">
          <div className="border-b border-[var(--border-subtle)] px-4 py-3">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Admin User
            </p>
            <p className="text-xs text-[var(--text-muted)]">Karnataka Police</p>
          </div>
          <div className="py-1">
            <Link
              to={ROUTES.SETTINGS}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
