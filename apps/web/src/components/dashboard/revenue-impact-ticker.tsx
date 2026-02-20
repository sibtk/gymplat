"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { DollarSign } from "lucide-react";
import { useEffect, useMemo } from "react";

import { useGymStore } from "@/lib/store";

export function RevenueImpactTicker() {
  const interventions = useGymStore((s) => s.interventions);

  const { revenueSaved, interventionCount } = useMemo(() => {
    const completed = interventions.filter(
      (i) => i.status === "completed" || i.status === "executing",
    );

    // Estimate revenue impact based on interventions
    let total = 0;
    for (const intervention of completed) {
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

    // Base value from simulated historical data
    const historical = 48200;
    return { revenueSaved: historical + total, interventionCount: 142 + completed.length };
  }, [interventions]);

  const spring = useSpring(0, { duration: 1500, bounce: 0.1 });
  const display = useTransform(spring, (v: number) =>
    `$${Math.round(v).toLocaleString()}`,
  );

  useEffect(() => {
    spring.set(revenueSaved);
  }, [spring, revenueSaved]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-peec-border-light bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
          <DollarSign className="h-4 w-4 text-green-600" />
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-peec-text-muted">
          Revenue Saved
        </p>
      </div>

      <motion.span className="text-3xl font-bold text-green-600">
        {display}
      </motion.span>

      <p className="text-2xs text-peec-text-muted">
        from {interventionCount} interventions this month
      </p>
    </motion.div>
  );
}
