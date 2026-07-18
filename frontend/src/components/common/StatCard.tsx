import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 transition-colors hover:border-[var(--border-default)]",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-muted)]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-elevated)]">
            {icon}
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1">
          {trend === "up" && (
            <TrendingUp className="h-3.5 w-3.5 text-[var(--color-success)]" />
          )}
          {trend === "down" && (
            <TrendingDown className="h-3.5 w-3.5 text-[var(--color-danger)]" />
          )}
          {trend === "neutral" && (
            <Minus className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-[var(--color-success)]",
              trend === "down" && "text-[var(--color-danger)]",
              trend === "neutral" && "text-[var(--text-muted)]",
            )}
          >
            {trendValue}
          </span>
        </div>
      )}
    </motion.div>
  );
}
