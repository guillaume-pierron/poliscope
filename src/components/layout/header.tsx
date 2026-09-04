"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sun } from "lucide-react";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  if (pathname === "/match") {
    return (
      <header className="border-b border-border bg-background">
        <div className="container-app flex h-[72px] items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="focus-ring flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            Quitter le Match
            <LogOut size={15} />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-app flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring relative py-1 text-sm transition-colors",
                  active ? "font-semibold text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/match" variant="accent" size="md" className="hidden sm:inline-flex">
            Faire mon Match
            <Sun size={16} />
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
