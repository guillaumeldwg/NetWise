"use client";

import { useMemo, useState, useCallback } from "react";
import {
  simulerStatuts,
  type SimulationResults,
  type SimulationInputs,
} from "@/lib/calculs";

export const DEFAULTS = {
  ca: 70_000,
  frais: 10_000,
} as const;

export const BOUNDS = {
  ca: { min: 0, max: 150_000, step: 1_000 },
  frais: { min: 0, max: 50_000, step: 500 },
} as const;

interface UseSimulationReturn {
  inputs: SimulationInputs;
  results: SimulationResults;
  setCA: (value: number) => void;
  setFrais: (value: number) => void;
  reset: () => void;
}

/**
 * Hook principal : gère l'état des inputs et recalcule les 3 statuts à la volée.
 * Memoize pour éviter les recalculs inutiles.
 */
export const useSimulation = (): UseSimulationReturn => {
  const [ca, setCAState] = useState<number>(DEFAULTS.ca);
  const [frais, setFraisState] = useState<number>(DEFAULTS.frais);

  const setCA = useCallback((value: number) => {
    const clamped = Math.max(BOUNDS.ca.min, Math.min(BOUNDS.ca.max, value));
    setCAState(Number.isFinite(clamped) ? clamped : 0);
  }, []);

  const setFrais = useCallback((value: number) => {
    const clamped = Math.max(
      BOUNDS.frais.min,
      Math.min(BOUNDS.frais.max, value),
    );
    setFraisState(Number.isFinite(clamped) ? clamped : 0);
  }, []);

  const reset = useCallback(() => {
    setCAState(DEFAULTS.ca);
    setFraisState(DEFAULTS.frais);
  }, []);

  const inputs = useMemo<SimulationInputs>(() => ({ ca, frais }), [ca, frais]);
  const results = useMemo<SimulationResults>(
    () => simulerStatuts(inputs),
    [inputs],
  );

  return { inputs, results, setCA, setFrais, reset };
};
