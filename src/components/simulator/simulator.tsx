"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  Info,
  Lock,
} from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { Input, Label, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { computeImpacts } from "@/lib/simulator/measures";
import { DEFAULT_PROFILE, type UserProfile } from "@/lib/simulator/types";
import type { Candidate } from "@/lib/types";

const STATUS_OPTIONS: { value: UserProfile["employmentStatus"]; label: string }[] = [
  { value: "prive", label: "Salarié du privé" },
  { value: "public", label: "Fonctionnaire / agent public" },
  { value: "independant", label: "Indépendant / entrepreneur" },
  { value: "retraite", label: "Retraité" },
  { value: "etudiant", label: "Étudiant" },
  { value: "sans_emploi", label: "Sans emploi" },
];

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "focus-ring flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
            value === opt.value
              ? "border-primary bg-primary-soft text-primary"
              : "border-border-strong bg-card hover:bg-surface"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Simulator({ candidates }: { candidates: Candidate[] }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const set = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const impacts = useMemo(
    () => computeImpacts(profile, candidates.map((c) => c.slug)),
    [profile, candidates]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-10">
      {/* ─── Formulaire ─── */}
      <form
        className="h-fit space-y-5 rounded-[20px] border border-border bg-card p-6 lg:sticky lg:top-24"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <Label htmlFor="income">Revenu net mensuel</Label>
          <Input
            id="income"
            type="number"
            min={0}
            step={50}
            value={profile.netMonthlyIncome}
            onChange={(e) => set("netMonthlyIncome", Number(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="status">Statut professionnel</Label>
          <Select
            id="status"
            value={profile.employmentStatus}
            onChange={(e) =>
              set("employmentStatus", e.target.value as UserProfile["employmentStatus"])
            }
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          {profile.employmentStatus === "public" && (
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={profile.isTeacher}
                onChange={(e) => set("isTeacher", e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Je suis enseignant
            </label>
          )}
        </div>

        <div>
          <Label>Situation du foyer</Label>
          <Segmented
            value={profile.household}
            onChange={(v) => set("household", v)}
            options={[
              { value: "seul", label: "Célibataire" },
              { value: "couple", label: "En couple" },
            ]}
          />
        </div>

        <div>
          <Label htmlFor="children">Enfants à charge</Label>
          <Input
            id="children"
            type="number"
            min={0}
            max={12}
            value={profile.childrenCount}
            onChange={(e) => set("childrenCount", Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Logement</Label>
          <Segmented
            value={profile.housing}
            onChange={(v) => set("housing", v)}
            options={[
              { value: "locataire", label: "Locataire" },
              { value: "proprietaire", label: "Propriétaire" },
              { value: "heberge", label: "Hébergé" },
            ]}
          />
          {profile.housing === "locataire" && (
            <div className="mt-3 space-y-3">
              <div>
                <Label htmlFor="rent">Loyer mensuel</Label>
                <Input
                  id="rent"
                  type="number"
                  min={0}
                  step={25}
                  value={profile.monthlyRent}
                  onChange={(e) => set("monthlyRent", Number(e.target.value))}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={profile.isPoorlyInsulated}
                  onChange={(e) => set("isPoorlyInsulated", e.target.checked)}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Logement classé F ou G (passoire énergétique)
              </label>
            </div>
          )}
        </div>

        <div>
          <Label>Voiture</Label>
          <Segmented
            value={profile.hasCar ? "oui" : "non"}
            onChange={(v) => set("hasCar", v === "oui")}
            options={[
              { value: "oui", label: "Oui" },
              { value: "non", label: "Non" },
            ]}
          />
          {profile.hasCar && (
            <div className="mt-3">
              <Label htmlFor="km">Kilomètres par an</Label>
              <Input
                id="km"
                type="number"
                min={0}
                step={500}
                value={profile.kmPerYear}
                onChange={(e) => set("kmPerYear", Number(e.target.value))}
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="energy">Dépense mensuelle électricité + gaz</Label>
          <Input
            id="energy"
            type="number"
            min={0}
            step={10}
            value={profile.monthlyEnergySpend}
            onChange={(e) => set("monthlyEnergySpend", Number(e.target.value))}
          />
          <p className="mt-1.5 text-xs text-muted-2">
            Valeur indicative par défaut — ajustez-la pour un calcul juste.
          </p>
        </div>

        <p className="flex items-start gap-1.5 border-t border-border pt-4 text-xs text-muted-2">
          <Lock size={12} className="mt-0.5 shrink-0" />
          Tout est calculé dans votre navigateur. Aucune de ces informations n&apos;est envoyée
          ni enregistrée.
        </p>
      </form>

      {/* ─── Résultats ─── */}
      <div>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            Un montant n&apos;est affiché que lorsque la proposition sourcée donne elle-même le
            chiffre (un taux, un seuil, un montant). Les autres mesures qui vous concernent sont
            listées sans estimation, jamais devinées. Le total est donc une{" "}
            <strong className="font-medium text-foreground">somme partielle</strong>, pas
            l&apos;impact d&apos;un programme : un candidat dont les mesures sont plus précisément
            chiffrées affichera mécaniquement plus de lignes. Les candidats sont classés dans
            l&apos;ordre habituel du site, jamais par montant.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {impacts.map((impact) => {
            const candidate = candidates.find((c) => c.slug === impact.candidateSlug);
            if (!candidate) return null;
            return (
              <CandidateImpactCard key={candidate.id} candidate={candidate} impact={impact} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CandidateImpactCard({
  candidate,
  impact,
}: {
  candidate: Candidate;
  impact: ReturnType<typeof computeImpacts>[number];
}) {
  const [open, setOpen] = useState(false);
  const total = Math.round(impact.quantifiedMonthlyTotal);
  const hasFigures = impact.quantified.length > 0;
  const all = [...impact.quantified, ...impact.unquantified];

  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex w-full items-center gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <CandidateAvatar name={candidate.name} color={candidate.party?.color} photoUrl={candidate.photo_url} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{candidate.name}</p>
          <p className="truncate text-sm text-muted">
            {all.length === 0
              ? "Aucune mesure chiffrable ou ciblée sur votre profil"
              : `${impact.quantified.length} mesure${impact.quantified.length > 1 ? "s" : ""} chiffrable${impact.quantified.length > 1 ? "s" : ""} · ${impact.unquantified.length} sans chiffrage possible`}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {hasFigures ? (
            <>
              <p
                className={cn(
                  "font-mono text-xl font-semibold tabular-nums",
                  total >= 0 ? "text-success" : "text-danger"
                )}
              >
                {total >= 0 ? "+" : ""}
                {total} €
              </p>
              <p className="text-xs text-muted-2">par mois, partiel</p>
            </>
          ) : (
            <p className="text-sm text-muted-2">Non chiffrable</p>
          )}
        </div>
        {all.length > 0 && (
          <ChevronDown
            size={18}
            className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")}
          />
        )}
      </button>

      {open && all.length > 0 && (
        <div className="animate-fade-in space-y-3 border-t border-border p-5">
          {all.map(({ measure, outcome }) => {
            const Icon =
              outcome.monthlyEuro === null
                ? HelpCircle
                : outcome.direction === "perte"
                  ? TrendingDown
                  : TrendingUp;
            const tone =
              outcome.monthlyEuro === null
                ? "text-muted-2"
                : outcome.direction === "perte"
                  ? "text-danger"
                  : "text-success";
            return (
              <div key={measure.id} className="rounded-xl border border-border bg-surface/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex items-start gap-2 text-sm font-medium">
                    <Icon size={15} className={cn("mt-0.5 shrink-0", tone)} />
                    {measure.title}
                  </p>
                  {outcome.monthlyEuro !== null && (
                    <span className={cn("shrink-0 font-mono text-sm font-semibold", tone)}>
                      {outcome.direction === "perte" ? "−" : "+"}
                      {Math.round(Math.abs(outcome.monthlyEuro))} €
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{outcome.detail}</p>
                <a
                  href={measure.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  {measure.sourceName}
                  <ExternalLink size={11} />
                </a>
              </div>
            );
          })}

          <Link
            href={`/candidats/${candidate.slug}`}
            className="focus-ring inline-flex text-sm font-medium text-primary hover:underline"
          >
            Voir tout son programme →
          </Link>
        </div>
      )}
    </div>
  );
}
