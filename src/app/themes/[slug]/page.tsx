import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ProposalItem } from "@/components/candidates/proposal-item";
import { ThemeIcon } from "@/lib/theme-icons";
import { ButtonLink } from "@/components/ui/button";
import { getCandidates, getProposals, getThemeBySlug, getThemes } from "@/lib/data/queries";

export async function generateStaticParams() {
  const themes = await getThemes();
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);
  if (!theme) return {};
  return { title: theme.name, description: theme.description };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);
  if (!theme) notFound();

  const [candidates, proposals] = await Promise.all([getCandidates(), getProposals()]);
  const themeProposals = proposals.filter((p) => p.theme_id === theme.id);

  return (
    <div className="container-app max-w-3xl py-10 md:py-16">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <ThemeIcon icon={theme.icon} className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{theme.name}</h1>
          <p className="text-muted">{theme.description}</p>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {candidates.map((candidate) => {
          const items = themeProposals.filter((p) => p.candidate_id === candidate.id);
          return (
            <section key={candidate.id}>
              <div className="mb-3 flex items-center gap-2.5">
                <CandidateAvatar name={candidate.name} color={candidate.party?.color} size="sm" />
                <p className="font-semibold">{candidate.name}</p>
              </div>
              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((p) => (
                    <ProposalItem key={p.id} proposal={p} />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-2">
                  Position non renseignée pour ce thème.
                </p>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-10">
        <ButtonLink href="/match" variant="outline">
          Découvrir ma proximité sur ce thème
        </ButtonLink>
      </div>
    </div>
  );
}
