"use client";

import { AnimatePresence, motion, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import { Info, TrendingDown, TrendingUp, Minus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { GymHealthScore } from "@/lib/retention/types";

interface HealthScoreOrbProps {
  healthScore: GymHealthScore;
}

function scoreColorClass(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

const TrendIcon = ({ trend }: { trend: GymHealthScore["trend"] }) => {
  if (trend === "improving") return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (trend === "declining") return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-peec-text-muted" />;
};

const componentDetails: Record<string, { full: string; description: string }> = {
  Ret: { full: "Retention", description: "Percentage of members who remain active month-over-month. Higher scores indicate strong member loyalty and low churn." },
  Rev: { full: "Revenue", description: "Revenue health based on MRR growth, average revenue per member, and payment collection rate." },
  Eng: { full: "Engagement", description: "How actively members use the gym — check-in frequency, class attendance, and facility utilization." },
  Grw: { full: "Growth", description: "Net member growth rate factoring in new sign-ups, reactivations, and cancellations." },
};

export function HealthScoreOrb({ healthScore }: HealthScoreOrbProps) {
  const { overall, components, trend } = healthScore;
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  const springValue = useSpring(0, { duration: 1800, bounce: 0 });
  const displayNumber = useTransform(springValue, (v: number) => Math.round(v));

  // Color transitions: red → orange → yellow → green
  const strokeColor = useTransform(
    springValue,
    [0, 58, 62, 73, 77, 83, 87, 100],
    ["#ef4444", "#ef4444", "#f97316", "#f97316", "#eab308", "#eab308", "#22c55e", "#22c55e"],
  );

  // Arc length via motion template
  const filledLen = useTransform(springValue, (v: number) => circumference * (v / 100));
  const gapLen = useTransform(springValue, (v: number) => circumference * (1 - v / 100));
  const dashArray = useMotionTemplate`${filledLen} ${gapLen}`;

  // Glow fades in at green zone
  const glowOpacity = useTransform(springValue, [0, 75, 100], [0, 0, 0.25]);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    springValue.set(overall);
  }, [springValue, overall]);

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

  const quadrants = [
    { label: "Ret", value: components.retention },
    { label: "Rev", value: components.revenue },
    { label: "Eng", value: components.engagement },
    { label: "Grw", value: components.growth },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative flex h-full flex-col items-center gap-3 rounded-2xl border border-peec-border-light bg-white p-5 ${open ? "z-50" : ""}`}
    >
      <div className="flex w-full items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-peec-text-muted">
          Gym Health Score
        </p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-0.5 text-peec-text-muted/50 transition-colors hover:bg-stone-100 hover:text-peec-text-secondary"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* SVG Orb */}
      <div className="relative flex items-center justify-center">
        {/* Animated glow */}
        <motion.div
          className="absolute inset-[-16px] rounded-full"
          style={{
            opacity: glowOpacity,
            background: "radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.08) 50%, transparent 70%)",
          }}
        />

        <svg width="148" height="148" viewBox="0 0 148 148" className="-rotate-90">
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="8"
          />
          <motion.circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ stroke: strokeColor, strokeDasharray: dashArray }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            ref={ref}
            className={`text-3xl font-bold ${scoreColorClass(overall)}`}
          >
            {displayNumber}
          </motion.span>
          <div className="flex items-center gap-1">
            <TrendIcon trend={trend} />
            <span className="text-2xs capitalize text-peec-text-muted">{trend}</span>
          </div>
        </div>
      </div>

      {/* Quadrant indicators */}
      <div className="grid w-full grid-cols-4 gap-1">
        {quadrants.map((q) => (
          <div key={q.label} className="flex flex-col items-center">
            <span className="text-2xs text-peec-text-muted">{q.label}</span>
            <span className={`text-xs font-semibold ${scoreColorClass(q.value)}`}>
              {q.value}
            </span>
          </div>
        ))}
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
              <p className="text-xs font-medium text-peec-dark">Gym Health Score</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-0.5 text-peec-text-muted hover:bg-stone-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="mb-3 text-2xs leading-relaxed text-peec-text-secondary">
              A composite score (0–100) measuring overall gym performance. Scores above 80 indicate a healthy business; below 60 needs attention.
            </p>
            <div className="space-y-2">
              {quadrants.map((q) => {
                const detail = componentDetails[q.label];
                return (
                  <div key={q.label} className="flex gap-2">
                    <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${q.value >= 80 ? "bg-green-500" : q.value >= 60 ? "bg-amber-500" : "bg-red-500"}`} />
                    <div>
                      <p className="text-2xs font-medium text-peec-dark">
                        {detail?.full ?? q.label}: {q.value}/100
                      </p>
                      <p className="text-2xs text-peec-text-muted">
                        {detail?.description ?? ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
