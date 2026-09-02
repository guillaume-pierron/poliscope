import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 text-lg font-semibold tracking-tight", className)}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </span>
      Poliscope
    </Link>
  );
}
