"use client";

import { Check, TrendingUp } from "lucide-react";
import { formatEuros, formatPercent, type StatutResult } from "@/lib/calculs";

interface StatutCardProps {
  statut: StatutResult;
  isBest: boolean;
}

const ACCENT_BY_STATUT: Record<
  StatutResult["id"],
  { bar: string; dot: string; label: string }
> = {
  micro: {
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    label: "text-emerald-700",
  },
  eurl: {
    bar: "bg-indigo-500",
    dot: "bg-indigo-500",
    label: "text-indigo-700",
  },
  sasu: {
    bar: "bg-sky-500",
    dot: "bg-sky-500",
    label: "text-sky-700",
  },
};

export function StatutCard({ statut, isBest }: StatutCardProps) {
  const accent = ACCENT_BY_STATUT[statut.id];

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${
        isBest
          ? "border-indigo-500 ring-2 ring-indigo-100"
          : "border-slate-200"
      }`}
    >
      {/* Top accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`} />

      {/* "Meilleur" badge */}
      {isBest && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
          <Check className="h-3 w-3" strokeWidth={3} />
          Optimal
        </div>
      )}

      {/* Header */}
      <div className="mb-5 flex items-start gap-2">
        <div className={`mt-1.5 h-2 w-2 rounded-full ${accent.dot}`} />
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {statut.shortLabel}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">{statut.description}</p>
        </div>
      </div>

      {/* Net Annuel — hero metric */}
      <div className="mb-4">
        <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Revenu Net Annuel
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-4xl">
            {formatEuros(statut.net)}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-slate-400 tabular-nums">
          ≈ {formatEuros(statut.net / 12)} / mois
        </div>
      </div>

      {/* Divider */}
      <div className="my-2 h-px bg-slate-100" />

      {/* Breakdown */}
      <dl className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Charges sociales</dt>
          <dd className="font-mono font-medium text-slate-700 tabular-nums">
            {formatEuros(statut.chargesSociales)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Taux effectif</dt>
          <dd className={`flex items-center gap-1 font-mono font-medium tabular-nums ${accent.label}`}>
            <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
            {formatPercent(statut.tauxPrelevement)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
