"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartLine } from "@/lib/mock-data";

// ─── Component ───

interface RetentionChartProps {
  lines: ChartLine[];
  months: string[];
}

export function RetentionChart({ lines, months }: RetentionChartProps) {
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  // Transform data from parallel arrays to Recharts row format
  const data = useMemo(
    () =>
      months.map((month, i) => {
        const row: Record<string, string | number> = { month };
        for (const line of lines) {
          row[line.label] = line.values[i] ?? 0;
        }
        return row;
      }),
    [lines, months],
  );

  const handleMouseMove = useCallback(
    (state: { activeLabel?: string | number }) => {
      if (state.activeLabel != null) {
        setActiveMonth(String(state.activeLabel));
      }
    },
    [],
  );

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-peec-dark">Retention Trends</h3>
          <p className="mt-0.5 text-xs text-peec-text-muted">Member retention by plan type</p>
        </div>
        {/* Legend */}
        <div className="hidden flex-wrap gap-3 tablet:flex">
          {lines.map((line) => (
            <div key={line.label} className="flex items-center gap-1.5 text-xs text-peec-text-secondary">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: line.color }} />
              {line.label}
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveMonth(null)}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={(props: Record<string, unknown>) => {
              const x = Number(props.x);
              const y = Number(props.y);
              const payload = props.payload as { value: string };
              return (
                <text
                  x={x}
                  y={y + 14}
                  textAnchor="middle"
                  className={`text-[11px] ${
                    payload.value === activeMonth
                      ? "fill-peec-dark font-semibold"
                      : "fill-[#a3a3a3]"
                  }`}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <YAxis
            domain={[30, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#a3a3a3" }}
            tickFormatter={(v: number) => `${v}%`}
          />

          {activeMonth && (
            <ReferenceLine
              x={activeMonth}
              stroke="#d4d4d4"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const entries = payload as { name: string; value: number; color: string }[];
              return (
                <div className="rounded-xl border border-peec-border-light bg-white px-4 py-3 shadow-lg">
                  <p className="mb-2 text-xs font-semibold text-peec-dark">{label}</p>
                  {entries.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                      <span
                        className="h-2 w-2 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="w-20 text-peec-text-secondary">{entry.name}</span>
                      <span className="font-medium text-peec-dark">
                        {entry.value}%
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
            cursor={false}
          />

          {lines.map((line) => (
            <Line
              key={line.label}
              type="monotone"
              dataKey={line.label}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: line.color, stroke: "white", strokeWidth: 2 }}
              opacity={0.85}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
