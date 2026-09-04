import {
  ASSUMPTIONS,
  type CandidateImpact,
  type SimulatorMeasure,
  type UserProfile,
} from "./types";

/**
 * Catalogue des mesures exploitables par le simulateur.
 *
 * Règle absolue : une mesure ne produit un montant en euros que si la
 * proposition sourcée donne elle-même le chiffre (un taux, un seuil, un
 * montant). Sinon elle est listée comme « vous concerne » sans chiffrage —
 * jamais estimée à la louche. Chaque entrée reprend une proposition réelle
 * de src/lib/data/local/proposals.ts, avec la même source.
 */

const isSalaried = (p: UserProfile) =>
  p.employmentStatus === "prive" || p.employmentStatus === "public";

const isWorking = (p: UserProfile) =>
  isSalaried(p) || p.employmentStatus === "independant";

const monthlyFuelSpend = (p: UserProfile) =>
  p.hasCar && p.kmPerYear > 0
    ? (p.kmPerYear / 12 / 100) * ASSUMPTIONS.fuelLitresPer100km * ASSUMPTIONS.fuelPricePerLitre
    : 0;

const eur = (n: number) => Math.round(n);

/** Hausse du SMIC : ne s'applique qu'aux salariés rémunérés en dessous du seuil. */
function smicRaise(
  p: UserProfile,
  targetNet: number,
  label: string
): ReturnType<SimulatorMeasure["evaluate"]> {
  if (!isSalaried(p)) return null;
  if (p.netMonthlyIncome <= 0) return null;
  if (p.netMonthlyIncome >= targetNet) {
    return {
      monthlyEuro: null,
      direction: "incertain",
      detail: `Votre salaire net déclaré (${eur(p.netMonthlyIncome)} €) est déjà supérieur à ${label}. La mesure ne modifie pas directement votre rémunération ; ses effets indirects sur les salaires proches du SMIC ne sont pas chiffrés par la source.`,
    };
  }
  const gain = targetNet - p.netMonthlyIncome;
  return {
    monthlyEuro: gain,
    direction: "gain",
    detail: `${label} − votre salaire net déclaré (${eur(p.netMonthlyIncome)} €) = ${eur(gain)} € par mois, en supposant un temps plein rémunéré au minimum légal.`,
  };
}

/** Position sur l'âge de départ : concerne tout actif, sans chiffrage mensuel. */
function retirementStance(
  p: UserProfile,
  stance: string
): ReturnType<SimulatorMeasure["evaluate"]> {
  if (!isWorking(p)) return null;
  return {
    monthlyEuro: null,
    direction: "incertain",
    detail: `${stance} L'effet sur votre niveau de vie dépend de votre carrière complète et de votre pension future : il ne peut pas être converti en montant mensuel aujourd'hui.`,
  };
}

export const MEASURES: SimulatorMeasure[] = [
  // ─────────────────────────── Marine Le Pen ───────────────────────────
  {
    id: "lepen-tva-energie",
    candidateSlug: "marine-le-pen",
    title: "Baisse de la TVA à 5,5 % sur l'énergie",
    themeSlug: "pouvoir-achat",
    sourceName: "CNEWS (amendement RN au budget 2026)",
    sourceUrl:
      "https://www.cnews.fr/france/2025-10-21/abaissement-de-la-tva-55-quels-produits-sont-concernes-par-lamendement-depose-par",
    evaluate: (p) => {
      const fuel = monthlyFuelSpend(p);
      const energy = Math.max(0, p.monthlyEnergySpend);
      const base = fuel + energy;
      if (base <= 0) return null;
      const saving = base * ASSUMPTIONS.vatSavingRate;
      const parts: string[] = [];
      if (energy > 0) parts.push(`${eur(energy)} € d'électricité et gaz`);
      if (fuel > 0)
        parts.push(
          `${eur(fuel)} € de carburant (${p.kmPerYear.toLocaleString("fr-FR")} km/an, hypothèse ${ASSUMPTIONS.fuelLitresPer100km} L/100 km à ${ASSUMPTIONS.fuelPricePerLitre} €/L)`
        );
      return {
        monthlyEuro: saving,
        direction: "gain",
        detail: `Sur ${parts.join(" et ")}, soit ${eur(base)} € TTC par mois : passer la TVA de 20 % à 5,5 % retire ${eur(saving)} € du prix payé (le prix hors taxe étant inchangé).`,
      };
    },
  },
  {
    id: "lepen-retraite-62",
    candidateSlug: "marine-le-pen",
    title: "Retour à la retraite à 62 ans, 60 ans pour carrières longues",
    themeSlug: "retraites",
    sourceName: "Public Sénat",
    sourceUrl:
      "https://www.publicsenat.fr/actualites/politique/au-rn-la-reforme-des-retraites-divise-jordan-bardella-et-marine-le-pen-sur-le-programme-pour-la-presidentielle-2027",
    evaluate: (p) =>
      retirementStance(p, "Abaissement de l'âge légal à 62 ans, voire 60 ans pour les carrières longues."),
  },

  // ───────────────────────── Jean-Luc Mélenchon ─────────────────────────
  {
    id: "melenchon-smic-1600",
    candidateSlug: "jean-luc-melenchon",
    title: "SMIC à 1 600 euros net et blocage des prix",
    themeSlug: "pouvoir-achat",
    sourceName: "Programme « L'Avenir en commun » 2025 — chapitre 9",
    sourceUrl: "https://melenchon2027.fr/programme2025/livre/chapitre9/s1/",
    evaluate: (p) => smicRaise(p, 1600, "un SMIC porté à 1 600 € net"),
  },
  {
    id: "melenchon-loyers",
    candidateSlug: "jean-luc-melenchon",
    title: "Encadrement des loyers sur tout le territoire",
    themeSlug: "logement",
    sourceName: "Programme « L'Avenir en commun » 2025 — chapitre 7",
    sourceUrl: "https://melenchon2027.fr/programme2025/livre/chapitre7/s5/",
    evaluate: (p) => {
      if (p.housing !== "locataire") return null;
      return {
        monthlyEuro: null,
        direction: "gain",
        detail: `Locataire, vous seriez concerné par un encadrement généralisé des loyers. La source ne fixe pas de plafond chiffré : l'effet sur votre loyer de ${eur(p.monthlyRent)} € ne peut pas être calculé.`,
      };
    },
  },
  {
    id: "melenchon-retraite-60",
    candidateSlug: "jean-luc-melenchon",
    title: "Abroger la réforme Macron et retraite à 60 ans",
    themeSlug: "retraites",
    sourceName: "Programme « L'Avenir en commun » 2025 — chapitre 8",
    sourceUrl: "https://melenchon2027.fr/programme2025/livre/chapitre8/s8/",
    evaluate: (p) => retirementStance(p, "Retour à un départ à 60 ans pour une carrière complète."),
  },

  // ─────────────────────────── François Ruffin ───────────────────────────
  {
    id: "ruffin-smic-1700",
    candidateSlug: "francois-ruffin",
    title: "Porter le SMIC à 1 700 euros nets",
    themeSlug: "pouvoir-achat",
    sourceName: "Orange Actu (dépêche AFP)",
    sourceUrl:
      "https://actu.orange.fr/france/presidentielle-2027-francois-ruffin-lance-sa-campagne-en-se-posant-en-defenseur-des-travailleurs-essentiels-magic-CNT000002oTqjw.html",
    evaluate: (p) => smicRaise(p, 1700, "un SMIC porté à 1 700 € nets"),
  },
  {
    id: "ruffin-prime-1000",
    candidateSlug: "francois-ruffin",
    title: "Prime obligatoire de 1 000 € pour les salariés modestes",
    themeSlug: "pouvoir-achat",
    sourceName: "Orange Actu (dépêche AFP)",
    sourceUrl:
      "https://actu.orange.fr/france/presidentielle-2027-francois-ruffin-lance-sa-campagne-en-se-posant-en-defenseur-des-travailleurs-essentiels-magic-CNT000002oTqjw.html",
    evaluate: (p) => {
      if (!isSalaried(p)) return null;
      return {
        monthlyEuro: null,
        direction: "gain",
        detail:
          "La source annonce une prime obligatoire de 1 000 € pour les « salariés modestes », sans définir le seuil de revenu concerné : impossible de dire si votre salaire y ouvre droit, ni sur quelle période elle serait versée.",
      };
    },
  },
  {
    id: "ruffin-retraite-penibilite",
    candidateSlug: "francois-ruffin",
    title: "Retraite anticipée pour les métiers pénibles",
    themeSlug: "retraites",
    sourceName: "Orange Actu (dépêche AFP)",
    sourceUrl:
      "https://actu.orange.fr/france/presidentielle-2027-francois-ruffin-lance-sa-campagne-en-se-posant-en-defenseur-des-travailleurs-essentiels-magic-CNT000002oTqjw.html",
    evaluate: (p) =>
      retirementStance(p, "Départ anticipé ciblé sur les métiers pénibles (périmètre non précisé par la source)."),
  },

  // ─────────────────────────── Marine Tondelier ──────────────────────────
  {
    id: "tondelier-smic-2000",
    candidateSlug: "marine-tondelier",
    title: "Porter le SMIC à 2 000 euros brut",
    themeSlug: "pouvoir-achat",
    sourceName: "France 24",
    sourceUrl:
      "https://www.france24.com/fr/france/20260827-premier-d%C3%A9bat-de-la-pr%C3%A9sidentielle-2027-les-principales-propositions-des-candidats",
    evaluate: (p) => {
      const targetNet = 2000 * ASSUMPTIONS.netFromGross;
      const outcome = smicRaise(p, targetNet, `un SMIC de 2 000 € brut (~${eur(targetNet)} € net)`);
      if (!outcome) return null;
      return {
        ...outcome,
        detail: `${outcome.detail} Le passage du brut au net repose sur une hypothèse de ~22 % de cotisations salariales (salarié non-cadre) ; la source annonce un montant brut.`,
      };
    },
  },
  {
    id: "tondelier-loyers-passoires",
    candidateSlug: "marine-tondelier",
    title: "Loyers 30 % moins chers pour les passoires énergétiques",
    themeSlug: "logement",
    sourceName: "AFP via Connaissance des Énergies",
    sourceUrl:
      "https://www.connaissancedesenergies.org/afp/location-de-passoires-energetiques-marine-tondelier-plaide-pour-des-loyers-30-moins-chers-260426",
    evaluate: (p) => {
      if (p.housing !== "locataire") return null;
      if (!p.isPoorlyInsulated) {
        return {
          monthlyEuro: null,
          direction: "incertain",
          detail:
            "La mesure vise les logements classés F ou G au DPE. Vous n'avez pas indiqué être dans ce cas : elle ne s'appliquerait pas à votre loyer.",
        };
      }
      const gain = p.monthlyRent * 0.3;
      return {
        monthlyEuro: gain,
        direction: "gain",
        detail: `Votre loyer déclaré (${eur(p.monthlyRent)} €) réduit de 30 % comme le demande la source pour les logements F ou G = ${eur(gain)} € par mois.`,
      };
    },
  },
  {
    id: "tondelier-retraites",
    candidateSlug: "marine-tondelier",
    title: "Opposition à l'âge légal de départ à 64 ans",
    themeSlug: "retraites",
    sourceName: "Public Sénat",
    sourceUrl:
      "https://www.publicsenat.fr/actualites/politique/mobilisation-contre-la-reforme-des-retraites-pour-marine-tondelier-eelv-une",
    evaluate: (p) =>
      retirementStance(p, "Opposition au report de l'âge légal de 62 à 64 ans."),
  },

  // ────────────────────────── Raphaël Glucksmann ─────────────────────────
  {
    id: "glucksmann-salaire-net",
    candidateSlug: "raphael-glucksmann",
    title: "Hausse du salaire net financée par la taxation des héritages",
    themeSlug: "pouvoir-achat",
    sourceName: "Public Sénat",
    sourceUrl:
      "https://www.publicsenat.fr/actualites/politique/fiscalite-ecole-immigration-ce-que-propose-raphael-glucksmann",
    evaluate: (p) => {
      if (!isSalaried(p)) return null;
      return {
        monthlyEuro: null,
        direction: "gain",
        detail:
          "La source donne une enveloppe globale (~15 milliards d'euros redistribués en baisse de prélèvements sur les salaires) mais aucun taux ni barème par salarié : convertir cette enveloppe en gain mensuel pour votre fiche de paie supposerait d'inventer la répartition.",
      };
    },
  },
  {
    id: "glucksmann-retraites",
    candidateSlug: "raphael-glucksmann",
    title: "Retraite modulée selon l'espérance de vie en bonne santé",
    themeSlug: "retraites",
    sourceName: "Public Sénat",
    sourceUrl:
      "https://www.publicsenat.fr/actualites/politique/fiscalite-ecole-immigration-ce-que-propose-raphael-glucksmann",
    evaluate: (p) =>
      retirementStance(
        p,
        "Âge de départ modulé selon la pénibilité et l'espérance de vie en bonne santé du métier, sans retour universel à 60 ans."
      ),
  },

  // ─────────────────────────────── Gabriel Attal ─────────────────────────
  {
    id: "attal-annee-blanche",
    candidateSlug: "gabriel-attal",
    title: "« Année blanche » sur les prestations sociales en 2028",
    themeSlug: "economie",
    sourceName: "Le JDD",
    sourceUrl:
      "https://www.lejdd.fr/politique/presidentielle-le-plan-de-gabriel-attal-pour-redresser-les-finances-publiques-177987",
    evaluate: (p) => {
      const likelyRecipient =
        p.childrenCount > 0 || p.housing === "locataire" || p.employmentStatus === "sans_emploi";
      if (!likelyRecipient) return null;
      return {
        monthlyEuro: null,
        direction: "perte",
        detail:
          "Le gel des prestations sociales en 2028 (hors petites retraites) toucherait les foyers qui perçoivent des allocations — allocations familiales, aides au logement… Poliscope ne vous demande pas le montant de vos prestations, et la source ne fixe pas de perte type : aucun chiffrage n'est possible ici.",
      };
    },
  },
  {
    id: "attal-fonction-publique",
    candidateSlug: "gabriel-attal",
    title: "Suppression de 100 000 postes de fonctionnaires (départs volontaires)",
    themeSlug: "economie",
    sourceName: "Le JDD",
    sourceUrl:
      "https://www.lejdd.fr/politique/presidentielle-le-plan-de-gabriel-attal-pour-redresser-les-finances-publiques-177987",
    evaluate: (p) => {
      if (p.employmentStatus !== "public") return null;
      return {
        monthlyEuro: null,
        direction: "incertain",
        detail:
          "Agent public, vous êtes dans le périmètre de ce plan (100 000 postes en moins par départs volontaires). La source ne précise ni les filières visées ni d'effet sur les rémunérations : rien de chiffrable pour votre situation.",
      };
    },
  },
  {
    id: "attal-retraites",
    candidateSlug: "gabriel-attal",
    title: "Suppression de l'âge légal, capitalisation en complément",
    themeSlug: "retraites",
    sourceName: "Meilleurtaux Placement",
    sourceUrl:
      "https://placement.meilleurtaux.com/retraite/actualites/2026-mai/plan-de-gabriel-attal-retraites-supprimer-age-legal-instaurer-place-modele-hybride.html",
    evaluate: (p) =>
      retirementStance(
        p,
        "Suppression de l'âge légal au profit de la seule durée de cotisation, avec un pilier de capitalisation."
      ),
  },

  // ────────────────────────────── Édouard Philippe ───────────────────────
  {
    id: "philippe-enseignants",
    candidateSlug: "edouard-philippe",
    title: "Hausse de 20 % de la rémunération des enseignants",
    themeSlug: "education",
    sourceName: "franceinfo",
    sourceUrl:
      "https://www.franceinfo.fr/elections/presidentielle/presidentielle-2027-le-candidat-horizons-edouard-philippe-veut-augmenter-de-20-la-remuneration-moyenne-des-enseignants-sur-un-quinquennat_8159927.html",
    evaluate: (p) => {
      if (!p.isTeacher) return null;
      const gain = p.netMonthlyIncome * 0.2;
      return {
        monthlyEuro: gain,
        direction: "gain",
        detail: `+20 % appliqués à votre revenu net déclaré (${eur(p.netMonthlyIncome)} €) = ${eur(gain)} € par mois. La source parle d'une hausse de la rémunération *moyenne* étalée sur un quinquennat : votre hausse réelle dépendrait de votre échelon.`,
      };
    },
  },
  {
    id: "philippe-retraites",
    candidateSlug: "edouard-philippe",
    title: "Relever l'âge légal de départ au-delà de 64 ans",
    themeSlug: "retraites",
    sourceName: "Boursorama / APMnews",
    sourceUrl:
      "https://www.boursorama.com/epargne/retraite/actualites/reforme-des-retraites-les-propositions-d-edouard-philippe-aux-partenaires-sociaux-696742779bab5b90918b3b69dc9b1a02",
    evaluate: (p) =>
      retirementStance(p, "Relèvement de l'âge légal au-delà de 64 ans (65, 66 ou 67 ans selon la source)."),
  },
  {
    id: "philippe-loyers",
    candidateSlug: "edouard-philippe",
    title: "Contre l'encadrement des loyers, droits des propriétaires renforcés",
    themeSlug: "logement",
    sourceName: "Immo Matin",
    sourceUrl:
      "https://www.immomatin.com/franchise/reseaux-franchise/renforcer-le-droit-du-proprietaire-pour-fluidifier-le-marche-edouard-philippe-congres-fnaim-2025.html",
    evaluate: (p) => {
      if (p.housing === "locataire") {
        return {
          monthlyEuro: null,
          direction: "perte",
          detail:
            "Locataire, vous êtes concerné par la fin de l'encadrement des loyers et l'accélération des procédures d'expulsion. La source ne chiffre aucun effet sur le niveau des loyers.",
        };
      }
      if (p.housing === "proprietaire") {
        return {
          monthlyEuro: null,
          direction: "gain",
          detail:
            "Propriétaire, vous êtes concerné par le renforcement des droits du propriétaire, la réforme de l'IFI et la suspension temporaire d'obligations de rénovation énergétique. Aucun montant n'est chiffré par la source.",
        };
      }
      return null;
    },
  },

  // ───────────────────────────── Bruno Retailleau ────────────────────────
  {
    id: "retailleau-travail-gagnant",
    candidateSlug: "bruno-retailleau",
    title: "Plan « Travail gagnant » et revenu d'incitation à l'activité",
    themeSlug: "pouvoir-achat",
    sourceName: "Yahoo Finance France",
    sourceUrl:
      "https://fr.finance.yahoo.com/actualites/travail-gagnant-propositions-chocs-bruno-182132757.html",
    evaluate: (p) => {
      if (!isSalaried(p)) return null;
      return {
        monthlyEuro: null,
        direction: "gain",
        detail:
          "L'exonération de cotisations porte sur les heures travaillées au-delà de 1 623 heures par an. Poliscope ne vous demande pas votre volume d'heures annuel : sans lui, le gain ne peut pas être calculé.",
      };
    },
  },
  {
    id: "retailleau-plafond-aides",
    candidateSlug: "bruno-retailleau",
    title: "Plafond des aides sociales à 70 % du SMIC",
    themeSlug: "pouvoir-achat",
    sourceName: "Yahoo Finance France",
    sourceUrl:
      "https://fr.finance.yahoo.com/actualites/travail-gagnant-propositions-chocs-bruno-182132757.html",
    evaluate: (p) => {
      const likelyRecipient = p.employmentStatus === "sans_emploi" || p.childrenCount > 0;
      if (!likelyRecipient) return null;
      return {
        monthlyEuro: null,
        direction: "perte",
        detail:
          "Le cumul des aides sociales serait plafonné à 70 % du SMIC, et le RSA remplacé par un revenu conditionné à 15 h d'activité hebdomadaire. L'effet dépend du montant de vos prestations, que Poliscope ne collecte pas.",
      };
    },
  },
  {
    id: "retailleau-loyers",
    candidateSlug: "bruno-retailleau",
    title: "Plan « Mieux se loger » : fin de l'encadrement des loyers",
    themeSlug: "logement",
    sourceName: "Journal de l'Agence",
    sourceUrl:
      "https://www.journaldelagence.com/1411841-presidentielle-2027-les-propositions-de-bruno-retailleau-pour-relancer-le-logement",
    evaluate: (p) => {
      if (p.housing === "locataire") {
        return {
          monthlyEuro: null,
          direction: "perte",
          detail:
            "Le plan prévoit la fin de l'encadrement des loyers et des interdictions de location liées au DPE, avec un objectif d'un million de logements supplémentaires. Aucun effet chiffré sur votre loyer n'est donné par la source.",
        };
      }
      if (p.housing === "proprietaire") {
        return {
          monthlyEuro: null,
          direction: "gain",
          detail:
            "Propriétaire, vous êtes concerné par la fin de l'encadrement des loyers et la levée des interdictions de location liées au DPE. La source ne chiffre pas l'effet individuel.",
        };
      }
      return null;
    },
  },
  {
    id: "retailleau-retraites",
    candidateSlug: "bruno-retailleau",
    title: "Indexation de l'âge de départ sur l'espérance de vie",
    themeSlug: "retraites",
    sourceName: "France Info",
    sourceUrl:
      "https://www.franceinfo.fr/elections/presidentielle/dette-publique-retraites-reindustrialisation-ce-qu-il-faut-retenir-du-premier-debat-des-principaux-candidats-a-la-presidentielle_8165342.html",
    evaluate: (p) =>
      retirementStance(
        p,
        "Âge de départ indexé sur l'évolution de l'espérance de vie, donc relevé progressivement."
      ),
  },

  // ───────────────────────────── Xavier Bertrand ─────────────────────────
  {
    id: "bertrand-gafa",
    candidateSlug: "xavier-bertrand",
    title: "Taxer plus fortement les géants du numérique (GAFA)",
    themeSlug: "economie",
    sourceName: "ICI (France 3)",
    sourceUrl:
      "https://www.ici.fr/infos/politique/xavier-bertrand-invite-de-dimanche-en-politique-1547295534",
    evaluate: (p) => {
      if (!isWorking(p)) return null;
      return {
        monthlyEuro: null,
        direction: "gain",
        detail:
          "La source indique que le produit d'une taxation plus lourde des GAFA servirait à réduire cotisations et impôts des Français, sans préciser lesquels ni de quel montant : rien n'est chiffrable au niveau d'un foyer.",
      };
    },
  },
];

/** Applique toutes les mesures à un profil et regroupe par candidat. */
export function computeImpacts(profile: UserProfile, candidateSlugs: string[]): CandidateImpact[] {
  return candidateSlugs.map((slug) => {
    const quantified: CandidateImpact["quantified"] = [];
    const unquantified: CandidateImpact["unquantified"] = [];

    for (const measure of MEASURES.filter((m) => m.candidateSlug === slug)) {
      const outcome = measure.evaluate(profile);
      if (!outcome) continue;
      if (outcome.monthlyEuro === null) unquantified.push({ measure, outcome });
      else quantified.push({ measure, outcome });
    }

    const quantifiedMonthlyTotal = quantified.reduce((sum, item) => {
      const value = item.outcome.monthlyEuro ?? 0;
      return sum + (item.outcome.direction === "perte" ? -value : value);
    }, 0);

    return { candidateSlug: slug, quantified, unquantified, quantifiedMonthlyTotal };
  });
}
