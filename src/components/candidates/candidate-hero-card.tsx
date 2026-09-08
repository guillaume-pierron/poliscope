import Link from "next/link";
import { ArrowLeft, CalendarDays, Globe, Landmark, MapPin, SplitSquareHorizontal } from "lucide-react";
import { CandidateHeroPhoto } from "./candidate-hero-photo";
import { ButtonLink } from "@/components/ui/button";
import { formatBirth } from "@/lib/candidates/birth";
import { ORIENTATION_LABELS } from "@/lib/types";
import type { Candidate } from "@/lib/types";

export function CandidateHeroCard({ candidate }: { candidate: Candidate }) {
  const color = candidate.party?.color ?? "var(--primary)";
  const birth = candidate.birth_date ? formatBirth(candidate.birth_date) : null;

  // Chaque repère n'apparaît que si la biographie sourcée le renseigne : une
  // fiche moins documentée affiche moins de repères, jamais des cases vides.
  // `label` n'est pas affiché — l'icône suffit à l'œil, pas à un lecteur
  // d'écran, à qui il donne le sens du repère.
  const facts = [
    birth && { icon: CalendarDays, label: "Date de naissance", value: birth.date, detail: birth.age },
    candidate.birth_place && {
      icon: MapPin,
      label: "Lieu de naissance",
      value: candidate.birth_place,
      detail: null,
    },
    candidate.current_role && {
      icon: Landmark,
      label: "Fonction actuelle",
      value: candidate.current_role,
      detail: candidate.current_role_detail ?? null,
    },
  ].filter(
    (
      fact
    ): fact is { icon: typeof CalendarDays; label: string; value: string; detail: string | null } =>
      Boolean(fact)
  );

  return (
    <div className="rounded-[24px] border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/candidats"
          className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
        >
          <ArrowLeft size={15} />
          Retour à la liste des candidats
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-sm font-medium text-muted">
          <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: color }} />
          Candidat déclaré
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="shrink-0">
          <div className="relative mx-auto w-fit">
            <CandidateHeroPhoto
              name={candidate.name}
              color={candidate.party?.color}
              photoUrl={candidate.photo_url}
              className="h-40 w-40 rounded-full sm:h-44 sm:w-44"
              ringColor={color}
            />
            {/* Sigle du parti à défaut d'un logo — jamais une abréviation inventée. */}
            {candidate.party?.short_name && (
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 flex h-11 w-11 items-center justify-center rounded-full border-4 border-card text-xs font-bold leading-none text-white"
                style={{ background: color }}
              >
                {candidate.party.short_name}
              </span>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {candidate.party && (
              <div
                className="rounded-xl border-l-[3px] px-3.5 py-2.5"
                style={{
                  borderLeftColor: color,
                  background: `color-mix(in srgb, ${color} 8%, transparent)`,
                }}
              >
                <p className="text-sm font-semibold leading-snug">{candidate.party.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {ORIENTATION_LABELS[candidate.party.orientation]}
                </p>
              </div>
            )}

            {/* Sous l'encart du parti plutôt qu'en bout de la rangée de
                boutons, où il passait seul à la ligne. */}
            {candidate.official_website && (
              <a
                href={candidate.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-border-strong px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <Globe size={15} className="shrink-0" />
                Site officiel
              </a>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-balance font-serif text-[1.9rem] font-semibold leading-tight tracking-tight sm:text-[2.25rem]">
            {candidate.name}
          </h1>
          {candidate.party && (
            <p className="mt-1 text-muted">
              {candidate.party.name}
              {" · "}
              <span className="text-muted-2">{ORIENTATION_LABELS[candidate.party.orientation]}</span>
            </p>
          )}

          <p className="mt-4 leading-relaxed text-foreground/85">{candidate.biography}</p>

          {facts.length > 0 && (
            <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-4">
              {facts.map(({ icon: Icon, label, value, detail }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <Icon size={17} className="mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-sm font-medium leading-snug">
                      {value}
                      {detail && <span className="mt-0.5 block font-normal text-muted">{detail}</span>}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href="/match" variant="accent">
              Découvrir mon Match
            </ButtonLink>
            <ButtonLink href={`/comparer?a=${candidate.slug}`} variant="outline">
              <SplitSquareHorizontal size={16} />
              Comparer ce candidat
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
