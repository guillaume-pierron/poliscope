import Link from "next/link";
import { ThemeIcon } from "@/lib/theme-icons";
import type { Theme } from "@/lib/types";

export function ThemesSection({ themes }: { themes: Theme[] }) {
  return (
    <section className="border-t border-border bg-surface py-20">
      <div className="container-app">
        <div className="max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Douze thématiques, un même niveau d&apos;exigence.
          </h2>
          <p className="mt-3 text-muted">
            Chaque proposition est classée par thème et reliée à sa source d&apos;origine.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              href={`/themes/${theme.slug}`}
              className="focus-ring group flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-border-strong hover:bg-surface-strong"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <ThemeIcon icon={theme.icon} className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">{theme.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
