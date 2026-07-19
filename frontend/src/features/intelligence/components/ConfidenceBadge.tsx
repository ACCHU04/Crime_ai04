interface Props {
  confidence: number;
}

export default function ConfidenceBadge({ confidence }: Props) {
  const color = confidence >= 85
    ? "text-green-400 bg-green-500/10 border-green-500/20"
    : confidence >= 70
    ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    : "text-orange-400 bg-orange-500/10 border-orange-500/20";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${color}`}>
      {confidence}% confidence
    </span>
  );
}
