import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Analytics"
        description="Crime trends, hotspots, and statistical analysis"
      />
      <EmptyState
        icon={<BarChart3 className="h-7 w-7 text-[var(--text-muted)]" />}
        title="Analytics Dashboard"
        description="Interactive charts showing crime trends, district comparison, hotspot analysis, and repeat offender statistics."
      />
    </motion.div>
  );
}
