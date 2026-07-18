import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Search } from "lucide-react";

export default function InvestigationPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Investigation"
        description="Deep-dive into case timelines, evidence, and relationships"
      />
      <EmptyState
        icon={<Search className="h-7 w-7 text-[var(--text-muted)]" />}
        title="Investigation Workspace"
        description="Select a case to view its timeline, evidence, victims, suspects, and AI-generated investigation reports."
      />
    </motion.div>
  );
}
