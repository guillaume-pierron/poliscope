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
