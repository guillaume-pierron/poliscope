"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/match" variant="accent" size="sm" className="hidden sm:inline-flex">
            Faire mon Match
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
