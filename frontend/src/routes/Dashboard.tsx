import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Dashboard"
        description="Real-time crime intelligence overview for Karnataka"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LoadingSkeleton variant="stat" />
        <LoadingSkeleton variant="stat" />
        <LoadingSkeleton variant="stat" />
        <LoadingSkeleton variant="stat" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    </motion.div>
  );
}
