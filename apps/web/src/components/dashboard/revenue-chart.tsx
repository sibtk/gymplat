"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RevenueDataPoint } from "@/lib/mock-data";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-peec-dark">Monthly Recurring Revenue</h3>
        <p className="text-xs text-peec-text-muted">Revenue trend over the last 12 months</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#a3a3a3" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#a3a3a3" }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const entries = payload as { value: number }[];
              const point = entries[0];
              return (
                <div className="rounded-lg border border-peec-border-light bg-white px-3 py-2 shadow-lg">
                  <p className="text-xs font-semibold text-peec-dark">{label}</p>
                  <p className="text-xs text-peec-text-secondary">
                    MRR: ${point?.value.toLocaleString()}
                  </p>
                </div>
              );
            }}
            cursor={{ fill: "rgba(0,0,0,0.04)", radius: 4 }}
          />
          <Bar
            dataKey="mrr"
            fill="#171717"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
