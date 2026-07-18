import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--bg-elevated)]">
        <AlertTriangle className="h-10 w-10 text-[var(--color-warning)]" />
      </div>
      <h1 className="text-4xl font-bold text-[var(--text-primary)]">404</h1>
      <p className="mt-2 text-lg text-[var(--text-secondary)]">
        Page not found
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
      >
        <Home className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </motion.div>
  );
}
