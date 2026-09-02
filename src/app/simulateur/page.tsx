import type { Metadata } from "next";
import { Wallet, Users, Home, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label, Select } from "@/components/ui/input";
import { NewsletterForm } from "@/components/home/newsletter-form";

export const metadata: Metadata = {
  title: "Simulateur d'impact économique",
  description:
    "Bientôt disponible : estimez l'impact des programmes candidats sur votre budget personnel.",
};

const fields = [
  { icon: Wallet, label: "Revenu net mensuel du foyer" },
  { icon: Users, label: "Situation familiale et nombre d'enfants" },
  { icon: Home, label: "Propriétaire ou locataire" },
  { icon: Car, label: "Type de véhicule et trajet domicile-travail" },
];

export default function SimulateurPage() {
  return (
    <div className="container-app max-w-2xl py-10 md:py-16">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Simulateur d&apos;impact économique
        </h1>
        <Badge variant="accent">Bientôt disponible</Badge>
      </div>
      <p className="mt-3 max-w-xl text-muted">
        Estimez, en fonction de votre situation, l&apos;impact concret des mesures économiques de
        chaque candidat sur votre budget. Ce module est en cours de construction.
      </p>

      <div className="mt-10 rounded-xl border border-dashed border-border-strong bg-surface p-6">
        <p className="mb-5 text-sm font-medium text-muted">Aperçu du formulaire à venir</p>
        <div className="space-y-4 opacity-60">
          {fields.map((field) => (
            <div key={field.label}>
              <Label className="flex items-center gap-2">
                <field.icon size={15} />
                {field.label}
              </Label>
              <Select disabled>
                <option>À venir</option>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-sm font-semibold">Être prévenu du lancement</p>
        <NewsletterForm className="mt-3 max-w-sm" />
      </div>
    </div>
  );
}
