/**
 * Arc gauge beside the headline score. The filled portion is the score
 * itself (pathLength is normalised to 100 so the dash offset maps 1:1 to
 * percent), so the curve encodes real data rather than being decorative.
 */
export function ScoreGauge({ score, className }: { score: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <svg viewBox="0 0 120 62" fill="none" aria-hidden="true" className={className}>
      <path
        d="M8 54a52 52 0 0 1 104 0"
        stroke="var(--surface-strong)"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={100}
      />
      <path
        d="M8 54a52 52 0 0 1 104 0"
        stroke="var(--primary)"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="100"
        strokeDashoffset={100 - clamped}
      />
      <path
        d="M112 12v9M116.5 16.5h-9"
        stroke="var(--primary)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
