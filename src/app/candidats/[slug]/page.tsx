import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, SplitSquareHorizontal } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { CompatBadge } from "@/components/candidates/compat-badge";
import { ProposalItem } from "@/components/candidates/proposal-item";
import { ButtonLink } from "@/components/ui/button";
import { ORIENTATION_LABELS } from "@/lib/types";
import { getCandidateBySlug, getCandidates, getProposalsForCandidate, getThemes } from "@/lib/data/queries";

export async function generateStaticParams() {
  const candidates = await getCandidates();
  return candidates.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const candidate = await getCandidateBySlug(slug);
  if (!candidate) return {};
  return {
    title: candidate.name,
    description: candidate.biography,
    openGraph: { title: candidate.name, description: candidate.biography },
  };
}

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [candidate, themes] = await Promise.all([getCandidateBySlug(slug), getThemes()]);
  if (!candidate) notFound();

  const proposals = await getProposalsForCandidate(candidate.id);
  const proposalsByTheme = themes
    .map((theme) => ({ theme, items: proposals.filter((p) => p.theme_id === theme.id) }))
    .filter((group) => group.items.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidate.name,
    description: candidate.biography,
    affiliation: candidate.party?.name,
    url: `https://example.org/candidats/${candidate.slug}`,
  };

  return (
    <div className="container-app max-w-3xl py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <CandidateAvatar name={candidate.name} color={candidate.party?.color} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">{candidate.name}</h1>
          <p className="mt-1 text-muted">
            {candidate.party?.name}
            {candidate.party && (
              <span className="text-muted-2"> · {ORIENTATION_LABELS[candidate.party.orientation]}</span>
            )}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-foreground/85">{candidate.biography}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <CompatBadge candidate={candidate} />
            {candidate.official_website && (
              <a
                href={candidate.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
              >
                <Globe size={14} />
                Site officiel (démonstration)
              </a>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href={`/comparer?a=${candidate.slug}`} variant="outline" size="sm">
              <SplitSquareHorizontal size={16} />
              Comparer ce candidat
            </ButtonLink>
            <ButtonLink href="/match" variant="ghost" size="sm">
              Faire mon Match
            </ButtonLink>
          </div>
        </div>
      </div>

      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Ses principales propositions</h2>

      <div className="mt-6 space-y-10">
        {proposalsByTheme.map(({ theme, items }) => (
          <section key={theme.id} id={theme.slug}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-2">
              {theme.name}
            </h3>
            <div className="space-y-3">
              {items.map((proposal) => (
                <ProposalItem key={proposal.id} proposal={proposal} />
              ))}
            </div>
          </section>
        ))}

        {themes
          .filter((theme) => !proposalsByTheme.some((g) => g.theme.id === theme.id))
          .map((theme) => (
            <section key={theme.id} className="rounded-xl border border-dashed border-border p-5">
              <p className="text-sm font-semibold text-muted">{theme.name}</p>
              <p className="mt-1 text-sm text-muted-2">
                Position non renseignée pour ce thème à ce stade.
              </p>
            </section>
          ))}
      </div>

      <div className="mt-12 rounded-xl border border-border bg-surface p-5 text-sm text-muted">
        Candidat de démonstration. Retrouvez le détail du calcul de compatibilité sur la page{" "}
        <Link href="/methodologie" className="underline underline-offset-2">
          méthodologie
        </Link>
        .
      </div>
    </div>
  );
}
