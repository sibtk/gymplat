"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

import { PulseDot } from "@/components/dashboard/motion";
import { useDashboardStore } from "@/lib/store";

export function CheckedInCounter() {
  const checkedInCount = useDashboardStore((s) => s.checkedInCount);
  const incrementCheckedIn = useDashboardStore((s) => s.incrementCheckedIn);
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(0, { duration: 600, bounce: 0 });
  const display = useTransform(spring, (latest: number) =>
    Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    spring.set(checkedInCount);
  }, [spring, checkedInCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.random() < 0.5 ? -1 : 1;
      incrementCheckedIn(delta);
    }, 20000);
    return () => clearInterval(interval);
  }, [incrementCheckedIn]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-peec-border-light bg-white px-3 py-1.5 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
      <PulseDot />
      <span className="text-xs text-peec-dark">
        <span className="font-semibold">
          <motion.span ref={ref}>{display}</motion.span>
        </span>{" "}
        members checked in right now
      </span>
    </div>
  );
}
