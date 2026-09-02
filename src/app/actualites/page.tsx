import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/home/newsletter-form";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Bientôt disponible : décryptages neutres de l'actualité de la présidentielle 2027.",
};

export default function ActualitesPage() {
  return (
    <div className="container-app flex max-w-lg flex-col items-center py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Newspaper size={24} />
      </span>
      <div className="mt-6 flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Actualités</h1>
        <Badge variant="accent">Bientôt disponible</Badge>
      </div>
      <p className="mt-3 text-muted">
        Des décryptages factuels et non partisans de la campagne, reliés aux fiches candidats et
        aux thématiques du site, arriveront prochainement.
      </p>
      <NewsletterForm className="mt-8 w-full max-w-sm" />
    </div>
  );
}
