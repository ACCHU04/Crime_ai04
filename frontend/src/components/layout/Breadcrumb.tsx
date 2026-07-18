import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/lib/constants";

const BREADCRUMB_MAP: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.INVESTIGATION]: "Investigation",
  [ROUTES.ANALYTICS]: "Analytics",
  [ROUTES.NETWORK]: "Network Intelligence",
  [ROUTES.COPILOT]: "AI Copilot",
  [ROUTES.SETTINGS]: "Settings",
};

export function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
      <Link
        to="/"
        className="flex items-center hover:text-[var(--text-primary)]"
      >
        <Home className="h-3 w-3" />
      </Link>
      {segments.map((segment, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        const label = BREADCRUMB_MAP[path] ?? segment;
        const isLast = i === segments.length - 1;

        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {isLast ? (
              <span className="font-medium text-[var(--text-secondary)]">
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="hover:text-[var(--text-primary)]"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
