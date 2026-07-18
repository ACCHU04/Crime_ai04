import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const QUESTIONS = [
  "Show all pending cases",
  "Which district has the most crimes?",
  "Show repeat offenders",
  "Show the full network",
  "Summarize case FIR2026001",
  "Show theft cases in Bengaluru",
];

interface SuggestedQuestionsProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({ onSelect, disabled }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUESTIONS.map((q) => (
        <motion.button
          key={q}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
        >
          <Sparkles className="h-3 w-3" />
          {q}
        </motion.button>
      ))}
    </div>
  );
}
