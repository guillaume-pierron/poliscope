import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
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
      {SITE_NAME}
    </Link>
  );
}
