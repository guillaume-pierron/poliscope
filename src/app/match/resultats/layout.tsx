import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vos résultats",
  description: "Découvrez les candidats dont les positions sont les plus proches des vôtres.",
};

export default function ResultatsLayout({ children }: LayoutProps<"/match/resultats">) {
  return children;
}
