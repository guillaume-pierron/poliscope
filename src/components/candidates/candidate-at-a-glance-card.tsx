import { BookMarked, FileCheck2, Library } from "lucide-react";

export function CandidateAtAGlanceCard({
  proposalCount,
  quantifiedCount,
  sourceCount,
}: {
  proposalCount: number;
  quantifiedCount: number;
  sourceCount: number;
}) {
  const stats = [
    { icon: FileCheck2, value: proposalCount, label: "propositions documentées" },
    { icon: BookMarked, value: quantifiedCount, label: "mesures chiffrées" },
    { icon: Library, value: sourceCount, label: "sources consultées" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-sm font-semibold">En bref</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <stat.icon size={17} className="text-primary" />
            <p className="mt-2 font-serif text-xl font-semibold leading-none tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1.5 text-xs leading-snug text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
