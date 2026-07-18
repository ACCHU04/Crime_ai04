import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  variant?: "card" | "text" | "table" | "stat";
}

export function LoadingSkeleton({
  className,
  count = 1,
  variant = "card",
}: LoadingSkeletonProps) {
  const base = "animate-pulse rounded-lg bg-[var(--bg-elevated)]";

  const variants = {
    card: "h-40 w-full",
    text: "h-4 w-full",
    table: "h-10 w-full",
    stat: "h-20 w-full",
  };

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(base, variants[variant])} />
      ))}
    </div>
  );
}
