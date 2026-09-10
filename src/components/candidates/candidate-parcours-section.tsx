import { Landmark } from "lucide-react";
import { APPOINTMENT_TYPE_LABELS, type CandidateCareer, type CandidateMandate } from "@/lib/types";
import { CandidateSectionHeader } from "./candidate-section-header";
import { RecordTimeline, sortTimelineEntries, type TimelineEntry } from "./record-timeline";

function careerToEntry(c: CandidateCareer): TimelineEntry {
  return {
    id: c.id,
    title: c.title,
    subtitle: c.organization,
    meta: c.sector,
    start: c.start_date,
    end: c.end_date,
    isOngoing: c.is_ongoing,
    description: c.description,
    sourceName: c.source_name,
    sourceUrl: c.source_url,
    sourceType: c.source_type,
  };
}

function mandateToEntry(m: CandidateMandate): TimelineEntry {
  const meta = [m.territory, m.party_at_time].filter(Boolean).join(" · ") || APPOINTMENT_TYPE_LABELS[m.appointment_type];
  return {
    id: m.id,
    title: m.title,
    subtitle: m.institution,
    meta,
    start: m.start_date,
    end: m.end_date,
    isOngoing: m.is_ongoing,
    sourceName: m.source_name,
    sourceUrl: m.source_url,
    sourceType: m.source_type,
  };
}

/**
 * "Parcours" — deux chronologies verticales distinctes (mandats politiques,
 * puis parcours professionnel), plutôt qu'un tableau fusionné : les deux ont
 * des champs et une temporalité différents, et le mélange forcerait des
 * comparaisons qui n'ont pas de sens (ex. trier un secteur professionnel
 * contre un territoire électoral).
 */
export function CandidateParcoursSection({
  candidateName,
  careers,
  mandates,
}: {
  candidateName: string;
  careers: CandidateCareer[];
  mandates: CandidateMandate[];
}) {
  const mandateEntries = sortTimelineEntries(mandates.map(mandateToEntry));
  const careerEntries = sortTimelineEntries(careers.map(careerToEntry));
  const total = mandateEntries.length + careerEntries.length;

  return (
    <div>
      <CandidateSectionHeader
        icon={Landmark}
        title="Parcours"
        count={total || undefined}
        countLabel={`repère${total > 1 ? "s" : ""} documenté${total > 1 ? "s" : ""}`}
        description={`Les mandats politiques et l'expérience professionnelle réellement exercés par ${candidateName}, avec leurs sources — jamais une période devinée faute de date précise.`}
      />

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-2">Mandats & fonctions</h3>
        <div className="mt-4">
          {mandateEntries.length > 0 ? (
            <RecordTimeline entries={mandateEntries} />
          ) : (
            <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
              Aucun mandat documenté dans Polysia pour ce candidat à ce stade.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-2">Parcours professionnel</h3>
        <div className="mt-4">
          {careerEntries.length > 0 ? (
            <RecordTimeline entries={careerEntries} />
          ) : (
            <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
              Aucune expérience professionnelle documentée dans Polysia pour ce candidat à ce stade.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
