import Link from "next/link";
import { Sparkle } from "@/components/ui/swoosh";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "focus-ring relative inline-flex items-start font-serif text-2xl font-semibold tracking-tight",
        className
      )}
    >
      Poliscope
      <Sparkle className="ml-0.5 mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
    </Link>
  );
}
