# Comparateur de Statuts Juridiques pour Freelances

Simulateur en temps réel pour comparer **Micro-entreprise**, **EURL** et **SASU** en France. Calcule automatiquement le revenu net annuel et les charges sociales selon le chiffre d'affaires et les frais professionnels saisis.

> Projet portfolio — profil hybride Finance / Tech.

## Stack

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript (mode strict)
- **Style** : Tailwind CSS
- **Graphiques** : Recharts
- **Icônes** : lucide-react

## Architecture

```
.
├── app/
│   ├── layout.tsx          # Layout racine + métadonnées SEO
│   ├── page.tsx            # Page principale (SPA)
│   └── globals.css         # Styles Tailwind + slider custom
├── components/
│   ├── NumericSlider.tsx   # Slider + input synchronisés
│   ├── StatutCard.tsx      # Carte résumé par statut
│   └── ComparisonChart.tsx # Graphique barres empilées
├── hooks/
│   └── useSimulation.ts    # Hook de simulation réactive
└── lib/
    └── calculs.ts          # Moteur de calcul (logique métier pure)
```

La logique métier est isolée dans `lib/calculs.ts` — fonctions pures, sans dépendance React, facilement testables.

## Formules

| Statut | Assiette | Taux | Revenu net |
|---|---|---|---|
| **Micro-entreprise (BNC)** | Chiffre d'affaires | 21,2 % | `CA - (CA × 0,212) - Frais` |
| **EURL (TNS)** | Bénéfice (CA - Frais) | ~45 % | `Bénéfice / 1,45` |
| **SASU (Assimilé Salarié)** | Bénéfice (CA - Frais) | ~80 % | `Bénéfice / 1,80` |

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement

Compatible Vercel en un clic :

```bash
npm run build
```

## Limitations

Simulateur simplifié à but démonstratif. N'intègre pas :

- Impôt sur le Revenu (IR)
- TVA
- CFE / CVAE
- ACRE (abattement nouveaux créateurs)
- Option IS pour l'EURL
- Versement libératoire pour la micro-entreprise
- Dividendes (SASU / EURL à l'IS)

---

MIT License
