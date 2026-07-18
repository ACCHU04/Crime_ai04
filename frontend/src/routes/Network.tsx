import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Network } from "lucide-react";

export default function NetworkPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Network Intelligence"
        description="Visualize criminal networks, associations, and repeat offender links"
      />
      <EmptyState
        icon={<Network className="h-7 w-7 text-[var(--text-muted)]" />}
        title="Network Graph"
        description="Interactive graph showing relationships between accused persons, cases, districts, and officers."
      />
    </motion.div>
  );
}
