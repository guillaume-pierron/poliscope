import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Match",
  description:
    "Répondez à quelques questions et découvrez quels candidats correspondent le plus à vos positions. Aucun compte requis, aucune donnée envoyée à un serveur.",
};

export default function MatchLayout({ children }: LayoutProps<"/match">) {
  return children;
}
