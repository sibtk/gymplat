import { TrendingDown, TrendingUp } from "lucide-react";

import type { KpiStat } from "@/lib/mock-data";

interface StatCardProps {
  stat: KpiStat;
}

export function StatCard({ stat }: StatCardProps) {
  const isPositive = stat.trend === "up"
    ? stat.change.startsWith("+")
    : stat.change.startsWith("-");

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-4 shadow-card">
      <p className="mb-1 text-xs text-peec-text-tertiary">{stat.label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-peec-dark">{stat.value}</p>
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {stat.change}
        </div>
      </div>
    </div>
  );
}
