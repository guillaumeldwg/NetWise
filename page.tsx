"use client";

import {
  Euro,
  Receipt,
  RotateCcw,
  Calculator,
  Sparkles,
  Info,
} from "lucide-react";
import { useSimulation, BOUNDS } from "@/hooks/useSimulation";
import { NumericSlider } from "@/components/NumericSlider";
import { StatutCard } from "@/components/StatutCard";
import { ComparisonChart } from "@/components/ComparisonChart";
import { formatEuros } from "@/lib/calculs";

export default function Home() {
  const { inputs, results, setCA, setFrais, reset } = useSimulation();
  const meilleur = results.statuts.find(
    (s) => s.id === results.meilleurStatut,
  );

  return (
    <main className="min-h-screen">
      {/* Subtle background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-indigo-50/80 via-slate-50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Header */}
        <header className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
              <Calculator
                className="h-5 w-5 text-white"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              FinTech · Simulateur 2026
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-normal tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Comparateur de Statuts Freelance
          </h1>

          <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            Ajustez votre chiffre d&apos;affaires et vos frais pour comparer{" "}
            <span className="font-semibold text-slate-900">
              Micro-entreprise
            </span>
            , <span className="font-semibold text-slate-900">EURL</span> et{" "}
            <span className="font-semibold text-slate-900">SASU</span> en temps
            réel. Identifiez le statut qui maximise votre revenu net.
          </p>
        </header>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ---------- INPUTS PANEL ---------- */}
          <section
            aria-labelledby="config-title"
            className="lg:col-span-4 xl:col-span-3"
          >
            <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2
                  id="config-title"
                  className="text-sm font-semibold uppercase tracking-wide text-slate-900"
                >
                  Configuration
                </h2>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                  aria-label="Réinitialiser aux valeurs par défaut"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Réinitialiser
                </button>
              </div>

              <div className="space-y-8">
                <NumericSlider
                  label="Chiffre d'Affaires Annuel"
                  icon={<Euro className="h-4 w-4" strokeWidth={2.5} />}
                  value={inputs.ca}
                  min={BOUNDS.ca.min}
                  max={BOUNDS.ca.max}
                  step={BOUNDS.ca.step}
                  onChange={setCA}
                />

                <NumericSlider
                  label="Frais Professionnels Annuels"
                  icon={<Receipt className="h-4 w-4" strokeWidth={2.5} />}
                  value={inputs.frais}
                  min={BOUNDS.frais.min}
                  max={BOUNDS.frais.max}
                  step={BOUNDS.frais.step}
                  onChange={setFrais}
                />
              </div>

              {/* Computed benefit preview */}
              <div className="mt-8 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium uppercase tracking-wide text-slate-500">
                    Bénéfice brut (CA - Frais)
                  </span>
                </div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {formatEuros(Math.max(0, inputs.ca - inputs.frais))}
                </div>
              </div>

              {/* Hint */}
              {meilleur && (
                <div className="mt-4 flex gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-900">
                  <Sparkles
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600"
                    strokeWidth={2.2}
                  />
                  <p>
                    À ce niveau, <strong>{meilleur.shortLabel}</strong> offre le
                    meilleur revenu net :{" "}
                    <strong className="font-mono tabular-nums">
                      {formatEuros(meilleur.net)}
                    </strong>
                    .
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ---------- RESULTS ---------- */}
          <section
            aria-labelledby="results-title"
            className="lg:col-span-8 xl:col-span-9"
          >
            <h2 id="results-title" className="sr-only">
              Résultats de la simulation
            </h2>

            {/* Cards row */}
            <div className="grid gap-4 sm:grid-cols-3">
              {results.statuts.map((statut) => (
                <div key={statut.id} className="animate-slide-up">
                  <StatutCard
                    statut={statut}
                    isBest={statut.id === results.meilleurStatut}
                  />
                </div>
              ))}
            </div>

            {/* Chart card */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Répartition Net / Charges
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Chaque barre représente le bénéfice total, décomposé entre
                    revenu net (indigo) et charges sociales (gris).
                  </p>
                </div>
              </div>

              <ComparisonChart statuts={results.statuts} />
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-14 border-t border-slate-200 pt-6">
          <div className="flex flex-col items-start gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" strokeWidth={2} />
              Note : Simulateur simplifié à but démonstratif (hors Impôt sur le
              Revenu et TVA).
            </p>
            <p className="text-slate-400">
              Taux indicatifs · Micro BNC 21,2 % · EURL ~45 % · SASU ~80 %
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
