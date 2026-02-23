"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { DollarSign, Info, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useDashboardStore, useGymStore } from "@/lib/store";

const typeValues: Record<string, { label: string; value: number }> = {
  email: { label: "Email Outreach", value: 45 },
  discount: { label: "Discount Offers", value: 85 },
  staff_task: { label: "Staff Tasks", value: 60 },
  phone_call: { label: "Phone Calls", value: 120 },
  class_recommendation: { label: "Class Recommendations", value: 35 },
  pt_consultation: { label: "PT Consultations", value: 200 },
};

const rangeMultiplier: Record<string, number> = {
  "7d": 0.25,
  "30d": 1,
  "90d": 3,
  "1y": 12,
};

const rangeLabel: Record<string, string> = {
  "7d": "this week",
  "30d": "this month",
  "90d": "this quarter",
  "1y": "this year",
};

export function RevenueImpactTicker() {
  const interventions = useGymStore((s) => s.interventions);
  const dateRange = useDashboardStore((s) => s.dateRange);
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const { revenueSaved, interventionCount, breakdown, periodLabel } = useMemo(() => {
    const multiplier = rangeMultiplier[dateRange] ?? 1;
    const completed = interventions.filter(
      (i) => i.status === "completed" || i.status === "executing",
    );

    const counts: Record<string, number> = {};
    let total = 0;
    for (const intervention of completed) {
      counts[intervention.type] = (counts[intervention.type] ?? 0) + 1;
      switch (intervention.type) {
        case "email":
          total += 45;
          break;
        case "discount":
          total += 85;
          break;
        case "staff_task":
          total += 60;
          break;
        case "phone_call":
          total += 120;
          break;
        case "class_recommendation":
          total += 35;
          break;
        case "pt_consultation":
          total += 200;
          break;
      }
    }

    // Base monthly values scaled by date range
    const baseMonthly = 4820;
    const baseInterventions = 14;
    const historical = Math.round(baseMonthly * multiplier);
    const interventionBase = Math.round(baseInterventions * multiplier);
    const items = Object.entries(typeValues).map(([key, info]) => ({
      label: info.label,
      count: counts[key] ?? 0,
      perUnit: info.value,
      total: (counts[key] ?? 0) * info.value,
    }));

    return {
      revenueSaved: historical + total,
      interventionCount: interventionBase + completed.length,
      breakdown: items,
      periodLabel: rangeLabel[dateRange] ?? "this month",
    };
  }, [interventions, dateRange]);

  const spring = useSpring(0, { duration: 1500, bounce: 0.1 });
  const display = useTransform(spring, (v: number) =>
    `$${Math.round(v).toLocaleString()}`,
  );

  useEffect(() => {
    spring.set(revenueSaved);
  }, [spring, revenueSaved]);

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-peec-border-light bg-white p-5 shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-shadow duration-1000 ${open ? "z-50" : ""}`}
    >
      {/* Background watermark icon */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
        <DollarSign className="h-36 w-36 text-green-500/[0.06]" />
      </div>

      <div className="z-10 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-xs font-medium tracking-wide text-peec-text-muted">
            Revenue Saved
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-0.5 text-peec-text-muted/50 transition-colors hover:bg-stone-100 hover:text-peec-text-secondary"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      <motion.span className="z-10 text-3xl font-bold text-green-600">
        {display}
      </motion.span>

      <p className="z-10 text-2xs text-peec-text-muted">
        from {interventionCount} interventions {periodLabel}
      </p>

      {/* Mini bar chart of intervention types */}
      <div className="z-10 mt-1 flex w-full items-end justify-center gap-1.5">
        {breakdown.map((item) => {
          const maxVal = 200;
          const height = Math.max(8, (item.perUnit / maxVal) * 40);
          return (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-4 rounded-sm bg-green-400/40"
              />
              <span className="text-[7px] leading-none text-peec-text-muted/60">
                {item.label.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Floating popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-peec-border-light bg-white p-4 shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-peec-dark">Revenue Saved</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-0.5 text-peec-text-muted hover:bg-stone-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="mb-3 text-2xs leading-relaxed text-peec-text-secondary">
              Estimated revenue retained by preventing member churn through targeted interventions. Each type has a different average impact based on historical success rates.
            </p>
            <div className="space-y-1.5">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-2xs">
                  <span className="text-peec-text-secondary">{item.label}</span>
                  <span className="font-medium text-peec-dark">
                    ${item.perUnit}/ea
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 border-t border-peec-border-light/50 pt-2">
              <p className="text-2xs text-peec-text-muted">
                Historical baseline + live session impact ({periodLabel})
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
