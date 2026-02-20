"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { AnimatedNumber, CardHover } from "@/components/dashboard/motion";

import type { KpiStat } from "@/lib/mock-data";

function parseStatValue(value: string): { num: number; prefix: string; suffix: string } {
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^([^0-9]*)([0-9.]+)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: "" };
  return {
    prefix: match[1] ?? "",
    num: parseFloat(match[2] ?? "0"),
    suffix: match[3] ?? "",
  };
}

interface StatCardProps {
  stat: KpiStat;
}

export function StatCard({ stat }: StatCardProps) {
  const isPositive = stat.trend === "up"
    ? stat.change.startsWith("+")
    : stat.change.startsWith("-");

  const { num, prefix, suffix } = parseStatValue(stat.value);

  return (
    <CardHover>
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <p className="mb-1 text-xs text-peec-text-muted">{stat.label}</p>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-peec-dark">
            <AnimatedNumber value={num} prefix={prefix} suffix={suffix} />
          </p>
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
    </CardHover>
  );
}
