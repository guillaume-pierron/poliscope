import Link from "next/link";
import type { ReactNode } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";
import { ENTITIES, ENTITY_KEYS } from "@/lib/admin/entities";
import { logoutAction } from "../actions";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-app grid gap-8 py-10 md:grid-cols-[220px_1fr] md:py-14">
      <aside className="md:sticky md:top-24 md:self-start">
        <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
          <LayoutDashboard size={16} />
          Administration
        </Link>
        <nav className="mt-5 space-y-0.5">
          {ENTITY_KEYS.map((key) => (
            <Link
              key={key}
              href={`/admin/${key}`}
              className="focus-ring block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {ENTITIES[key].labelPlural}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-6">
          <button
            type="submit"
            className="focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
          >
            <LogOut size={14} />
            Se déconnecter
          </button>
        </form>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
