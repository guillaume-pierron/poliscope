import { splitFigures } from "@/lib/figures";

/**
 * Rend un texte en accentuant ses grandeurs chiffrées, pour qu'un lecteur
 * pressé aille à l'essentiel sans lire le paragraphe entier. La règle de
 * sélection est mécanique et documentée dans lib/figures.ts — jamais un choix
 * éditorial sur ce qui « compte » dans la phrase d'un candidat.
 *
 * `font-semibold` sans changement de couleur : le contraste du poids suffit à
 * accrocher l'œil, alors qu'une couleur d'accent laisserait croire à un
 * jugement de valeur sur le chiffre mis en avant.
 */
export function Figures({ text }: { text: string }) {
  return (
    <>
      {splitFigures(text).map((segment, i) =>
        segment.isFigure ? (
          <strong key={i} className="font-semibold text-foreground">
            {segment.text}
          </strong>
        ) : (
          segment.text
        )
      )}
    </>
  );
}
