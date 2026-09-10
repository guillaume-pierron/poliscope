import { AlertTriangle, ExternalLink, Scale as ScaleIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { CandidateControversy, CandidateLegalCase } from "@/lib/types";
import { Figures } from "@/components/ui/figures";
import { ControversyStatusBadge, LegalStatusBadge, SourceTypeLabel } from "./record-badges";
import { ReportIssueButton } from "./report-issue-button";
import { CandidateSectionHeader } from "./candidate-section-header";

function LegalCaseCard({ candidateId, legalCase }: { candidateId: string; legalCase: CandidateLegalCase }) {
  const nonFinalNotice =
    legalCase.legal_status === "appeal_pending"
      ? "Une procédure d'appel est en cours — la décision de première instance n'est pas définitive."
      : legalCase.legal_status === "convicted_on_appeal"
        ? "Un pourvoi en cassation est possible ou en cours — cette décision n'est pas définitive."
        : null;
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-2">{legalCase.case_type}</p>
          <h4 className="mt-1 font-medium">{legalCase.title}</h4>
        </div>
        <LegalStatusBadge status={legalCase.legal_status} className="shrink-0" />
      </div>
      {nonFinalNotice && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-accent">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          {nonFinalNotice}
        </p>
      )}
      <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">
        <Figures text={legalCase.summary} />
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-2">
        {legalCase.jurisdiction && <span>{legalCase.jurisdiction}</span>}
        {legalCase.decision_date && <span>Dernière décision : {formatDate(legalCase.decision_date)}</span>}
        <span>Mise à jour le {formatDate(legalCase.last_updated)}</span>
        <SourceTypeLabel type={legalCase.source_type} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {legalCase.source_url ? (
          <a
            href={legalCase.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {legalCase.source_name || "Voir la source"}
            <ExternalLink size={13} />
          </a>
        ) : (
          <span />
        )}
        <ReportIssueButton candidateId={candidateId} recordTable="candidate_legal_cases" recordId={legalCase.id} />
      </div>
    </article>
  );
}

function ControversyCard({ candidateId, controversy }: { candidateId: string; controversy: CandidateControversy }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          {controversy.event_date && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-2">{formatDate(controversy.event_date)}</p>
          )}
          <h4 className="mt-1 font-medium">{controversy.title}</h4>
        </div>
        <ControversyStatusBadge status={controversy.controversy_status} className="shrink-0" />
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">
        <Figures text={controversy.summary} />
      </p>
      {controversy.context && <p className="mt-2 text-sm leading-relaxed text-muted">{controversy.context}</p>}
      {controversy.candidate_response && (
        <div className="mt-3 rounded-lg border border-border bg-surface p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-2">Réponse du candidat</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/85">{controversy.candidate_response}</p>
          {controversy.candidate_response_source_url && (
            <a
              href={controversy.candidate_response_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Source
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-2">
        <span>Mise à jour le {formatDate(controversy.last_updated)}</span>
        <SourceTypeLabel type={controversy.source_type} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {controversy.source_url ? (
          <a
            href={controversy.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {controversy.source_name || "Voir la source"}
            <ExternalLink size={13} />
          </a>
        ) : (
          <span />
        )}
        <ReportIssueButton candidateId={candidateId} recordTable="candidate_controversies" recordId={controversy.id} />
      </div>
    </article>
  );
}

/**
 * "Affaires & controverses" — deux sous-sections strictement séparées : une
 * polémique médiatique n'est jamais une affaire judiciaire, et inversement
 * (voir méthodologie). Un candidat sans rien à afficher ici n'est jamais
 * présenté comme suspect : l'absence se lit "non documenté dans Polysia".
 */
export function CandidateLegalControversiesSection({
  candidateName,
  candidateId,
  legalCases,
  controversies,
}: {
  candidateName: string;
  candidateId: string;
  legalCases: CandidateLegalCase[];
  controversies: CandidateControversy[];
}) {
  const total = legalCases.length + controversies.length;

  return (
    <div>
      <CandidateSectionHeader
        icon={ScaleIcon}
        title="Affaires & controverses"
        count={total || undefined}
        countLabel={`élément${total > 1 ? "s" : ""} documenté${total > 1 ? "s" : ""}`}
        description={`Des faits sourcés sur ${candidateName}, jamais un jugement. Une mise en examen n'est jamais présentée comme une culpabilité établie ; le terme « condamné » n'est utilisé que pour une condamnation effective.`}
      />

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-2">Affaires judiciaires</h3>
        <div className="mt-4 space-y-3">
          {legalCases.length > 0 ? (
            legalCases.map((legalCase) => (
              <LegalCaseCard key={legalCase.id} candidateId={candidateId} legalCase={legalCase} />
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
              Aucune affaire judiciaire documentée dans Polysia pour ce candidat à ce stade.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-2">Controverses documentées</h3>
        <div className="mt-4 space-y-3">
          {controversies.length > 0 ? (
            controversies.map((controversy) => (
              <ControversyCard key={controversy.id} candidateId={candidateId} controversy={controversy} />
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
              Aucune controverse documentée dans Polysia pour ce candidat à ce stade.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
