"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info, TrendingDown, TrendingUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  explanation?: string;
}

export function StatCard({ stat, explanation }: StatCardProps) {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const isPositive = stat.trend === "up"
    ? stat.change.startsWith("+")
    : stat.change.startsWith("-");

  const { num, prefix, suffix } = parseStatValue(stat.value);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <CardHover className={open ? "relative z-50" : ""}>
      <div className="relative rounded-xl border border-peec-border-light bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="mb-1.5 text-xs text-peec-text-muted">{stat.label}</p>
          {explanation && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full p-0.5 text-peec-text-muted/50 transition-colors hover:bg-stone-100 hover:text-peec-text-secondary"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold text-peec-dark">
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

        {/* Floating popup */}
        <AnimatePresence>
          {open && explanation && (
            <motion.div
              ref={popupRef}
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-peec-border-light bg-white p-4 shadow-lg"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-peec-dark">{stat.label}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded p-0.5 text-peec-text-muted hover:bg-stone-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-2xs leading-relaxed text-peec-text-secondary">
                {explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardHover>
  );
}
