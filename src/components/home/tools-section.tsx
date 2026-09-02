import Link from "next/link";
import { ArrowUpRight, ScanSearch, SplitSquareHorizontal, FileText, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  {
    icon: ScanSearch,
    title: "Mon Match",
    description:
      "Répondez à quelques questions et découvrez quels programmes correspondent le plus à vos positions.",
    href: "/match",
    available: true,
  },
  {
    icon: SplitSquareHorizontal,
    title: "Comparateur",
    description: "Comparez deux candidats thème par thème, en ne gardant que leurs différences si vous le souhaitez.",
    href: "/comparer",
    available: true,
  },
  {
    icon: FileText,
    title: "Programmes",
    description: "Retrouvez les principales mesures de chaque candidat avec leurs sources.",
    href: "/candidats",
    available: true,
  },
  {
    icon: LineChart,
    title: "Sondages",
    description: "Suivez les tendances de la présidentielle et leur évolution dans le temps.",
    href: "/sondages",
    available: true,
  },
];

export function ToolsSection() {
  return (
    <section className="container-app py-20">
      <div className="max-w-2xl">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          La présidentielle, sans le brouillard.
        </h2>
        <p className="mt-3 text-muted">
          Quatre outils pour comprendre, comparer et vous forger votre propre opinion — sans parti pris.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className={cn(
              "focus-ring group flex flex-col rounded-xl border border-border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_20px_40px_-24px_rgba(15,15,25,0.25)]"
            )}
          >
            <tool.icon className="text-primary" size={22} strokeWidth={1.75} />
            <h3 className="mt-4 flex items-center gap-1.5 text-base font-semibold">
              {tool.title}
              <ArrowUpRight
                size={15}
                className="text-muted-2 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
