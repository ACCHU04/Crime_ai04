import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Bot } from "lucide-react";

export default function CopilotPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="AI Copilot"
        description="Natural language crime intelligence assistant"
      />
      <EmptyState
        icon={<Bot className="h-7 w-7 text-[var(--text-muted)]" />}
        title="AI Copilot"
        description="Ask questions in plain English. The AI classifies your intent and routes to SQL queries, analytics, graph exploration, or investigation tools."
      />
    </motion.div>
  );
}
