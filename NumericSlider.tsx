"use client";

import { useCallback, type ChangeEvent } from "react";

interface NumericSliderProps {
  label: string;
  icon?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
  helper?: string;
}

/**
 * Slider + input numérique synchronisés.
 * - Le slider émet en direct (onInput/onChange).
 * - Le champ texte accepte la saisie libre et clamp à la sortie.
 */
export function NumericSlider({
  label,
  icon,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "€",
  helper,
}: NumericSliderProps) {
  const handleSliderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d]/g, "");
      const parsed = raw === "" ? 0 : Number(raw);
      onChange(parsed);
    },
    [onChange],
  );

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {icon && <span className="text-indigo-600">{icon}</span>}
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <input
            type="text"
            inputMode="numeric"
            value={value.toLocaleString("fr-FR")}
            onChange={handleInputChange}
            className="w-24 bg-transparent text-right font-mono text-sm font-semibold text-slate-900 outline-none"
            aria-label={`${label} (valeur)`}
          />
          <span className="text-sm font-medium text-slate-400">{suffix}</span>
        </div>
      </div>

      <div className="relative pt-1">
        {/* Track with dynamic fill */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-[width] duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="slider-input relative w-full cursor-pointer appearance-none bg-transparent"
          aria-label={label}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-400">
        <span>
          {min.toLocaleString("fr-FR")} {suffix}
        </span>
        {helper && <span className="text-slate-500">{helper}</span>}
        <span>
          {max.toLocaleString("fr-FR")} {suffix}
        </span>
      </div>
    </div>
  );
}
