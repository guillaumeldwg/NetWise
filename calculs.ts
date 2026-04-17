/**
 * Moteur de calcul pour la comparaison des statuts juridiques freelance.
 *
 * ⚠️  Avertissement : Simulateur simplifié à but démonstratif.
 * Ne prend pas en compte l'Impôt sur le Revenu, la TVA, la CFE,
 * l'ACRE, les options fiscales (IS/IR), la versement libératoire, etc.
 */

export type StatutId = "micro" | "eurl" | "sasu";

export interface StatutResult {
  id: StatutId;
  label: string;
  shortLabel: string;
  description: string;
  beneficeBrut: number; // Assiette avant charges (CA-Frais pour EURL/SASU, CA pour micro)
  chargesSociales: number;
  net: number;
  tauxPrelevement: number; // Part des charges sur l'assiette brute (%)
}

export interface SimulationInputs {
  ca: number;
  frais: number;
}

export interface SimulationResults {
  inputs: SimulationInputs;
  statuts: StatutResult[];
  meilleurStatut: StatutId;
}

/**
 * Clamp une valeur pour ne jamais retourner un négatif.
 * Règle métier : si le Net tombe sous 0, on affiche 0.
 */
const clampPositive = (value: number): number => Math.max(0, value);

/**
 * A. Micro-entreprise (Prestation de services BNC)
 * Les charges sociales se calculent sur le CA, pas sur le bénéfice.
 * Taux cotisations sociales BNC : 21,2%
 */
export const calculerMicro = (ca: number, frais: number): StatutResult => {
  const chargesSociales = ca * 0.212;
  const net = clampPositive(ca - chargesSociales - frais);
  // Pour la représentation graphique, on considère CA-Frais comme assiette affichable
  const beneficeBrut = clampPositive(ca - frais);
  // Charges affichées capées pour rester cohérentes avec le net à 0
  const chargesAffichees = clampPositive(beneficeBrut - net);

  return {
    id: "micro",
    label: "Micro-entreprise (BNC)",
    shortLabel: "Micro-entreprise",
    description: "Prestation de services — Régime simplifié",
    beneficeBrut,
    chargesSociales: chargesAffichees,
    net,
    tauxPrelevement: ca > 0 ? (chargesSociales / ca) * 100 : 0,
  };
};

/**
 * B. EURL (TNS - Travailleur Non Salarié)
 * Rémunération à 100% du bénéfice.
 * Coefficient de charges TNS : 1,45 (≈ 45% de charges sociales sur le net).
 */
export const calculerEURL = (ca: number, frais: number): StatutResult => {
  const beneficeBrut = clampPositive(ca - frais);
  const net = beneficeBrut / 1.45;
  const chargesSociales = beneficeBrut - net;

  return {
    id: "eurl",
    label: "EURL (TNS)",
    shortLabel: "EURL",
    description: "Gérant majoritaire — Travailleur Non Salarié",
    beneficeBrut,
    chargesSociales,
    net,
    tauxPrelevement:
      beneficeBrut > 0 ? (chargesSociales / beneficeBrut) * 100 : 0,
  };
};

/**
 * C. SASU (Assimilé Salarié)
 * Rémunération à 100% du bénéfice.
 * Coefficient de charges Assimilé Salarié : 1,80 (≈ 80% de charges sur le net).
 */
export const calculerSASU = (ca: number, frais: number): StatutResult => {
  const beneficeBrut = clampPositive(ca - frais);
  const net = beneficeBrut / 1.8;
  const chargesSociales = beneficeBrut - net;

  return {
    id: "sasu",
    label: "SASU (Assimilé Salarié)",
    shortLabel: "SASU",
    description: "Président — Régime général de la Sécurité sociale",
    beneficeBrut,
    chargesSociales,
    net,
    tauxPrelevement:
      beneficeBrut > 0 ? (chargesSociales / beneficeBrut) * 100 : 0,
  };
};

/**
 * Calcul orchestré : lance les 3 simulations en parallèle et identifie
 * le statut le plus avantageux (meilleur Net).
 */
export const simulerStatuts = (inputs: SimulationInputs): SimulationResults => {
  const { ca, frais } = inputs;
  const statuts: StatutResult[] = [
    calculerMicro(ca, frais),
    calculerEURL(ca, frais),
    calculerSASU(ca, frais),
  ];

  const meilleur = statuts.reduce((best, current) =>
    current.net > best.net ? current : best,
  );

  return {
    inputs,
    statuts,
    meilleurStatut: meilleur.id,
  };
};

/**
 * Formatter monétaire — format français avec symbole € collé.
 */
export const formatEuros = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
};

/**
 * Formatter pourcentage.
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
};
