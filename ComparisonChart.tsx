"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  type TooltipProps,
} from "recharts";
import { formatEuros, type StatutResult } from "@/lib/calculs";

interface ComparisonChartProps {
  statuts: StatutResult[];
}

interface ChartDatum {
  name: string;
  id: StatutResult["id"];
  Net: number;
  Charges: number;
}

const NET_COLOR = "#4f46e5"; // indigo-600
const CHARGES_COLOR = "#cbd5e1"; // slate-300

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;

  const net = (payload.find((p) => p.dataKey === "Net")?.value ?? 0) as number;
  const charges = (payload.find((p) => p.dataKey === "Charges")?.value ??
    0) as number;
  const total = net + charges;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-900">{label}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-slate-600">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: NET_COLOR }}
            />
            Revenu net
          </span>
          <span className="font-mono font-semibold text-slate-900 tabular-nums">
            {formatEuros(net)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-slate-600">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: CHARGES_COLOR }}
            />
            Charges sociales
          </span>
          <span className="font-mono font-semibold text-slate-900 tabular-nums">
            {formatEuros(charges)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-6 border-t border-slate-100 pt-1.5">
          <span className="font-medium text-slate-700">Total</span>
          <span className="font-mono font-bold text-slate-900 tabular-nums">
            {formatEuros(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

const axisFormatter = (value: number): string => {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
  return `${value}€`;
};

export function ComparisonChart({ statuts }: ComparisonChartProps) {
  const data: ChartDatum[] = statuts.map((s) => ({
    name: s.shortLabel,
    id: s.id,
    Net: Math.round(s.net),
    Charges: Math.round(s.chargesSociales),
  }));

  // Trouve l'index de la barre qui a le meilleur Net pour l'highlight
  const bestIndex = data.reduce(
    (bestIdx, current, idx, arr) =>
      current.Net > (arr[bestIdx]?.Net ?? 0) ? idx : bestIdx,
    0,
  );

  return (
    <div className="h-[340px] w-full sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 16, left: 0, bottom: 8 }}
          barSize={72}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#475569", fontSize: 13, fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={axisFormatter}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "#f1f5f9", opacity: 0.6 }}
          />
          <Legend
            iconType="circle"
            iconSize={9}
            wrapperStyle={{
              fontSize: "12px",
              color: "#475569",
              paddingTop: "12px",
            }}
          />
          <Bar
            dataKey="Charges"
            stackId="stack"
            fill={CHARGES_COLOR}
            radius={[0, 0, 8, 8]}
            name="Charges sociales"
          />
          <Bar
            dataKey="Net"
            stackId="stack"
            radius={[8, 8, 0, 0]}
            name="Revenu net"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={NET_COLOR}
                opacity={index === bestIndex ? 1 : 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
