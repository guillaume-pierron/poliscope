import { cn } from "@/lib/utils";

/**
 * Hand-drawn underline stroke used under accent words in headings.
 * Sits absolutely under its relative parent, so wrap the word in
 * `relative inline-block` and drop this inside it.
 */
export function Swoosh({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("absolute -bottom-2.5 left-0 h-3 w-[104%] -translate-x-[2%]", className)}
    >
      <path
        d="M2 8.5C34 3.8 78 2.2 122 3.4c25 .7 49 2.4 76 5.1"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Small three-stroke sparkle accent, as on the logo and section titles. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 3.5v6M17.5 7l-3.6 3.6M6.5 7l3.6 3.6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
