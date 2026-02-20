"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useEffect, useRef } from "react";

import type { GymHealthScore } from "@/lib/retention/types";

interface HealthScoreOrbProps {
  healthScore: GymHealthScore;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function scoreColorClass(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function scoreGlowClass(score: number): string {
  if (score >= 80) return "shadow-[0_0_40px_rgba(34,197,94,0.3)]";
  if (score >= 60) return "shadow-[0_0_40px_rgba(245,158,11,0.3)]";
  return "shadow-[0_0_40px_rgba(239,68,68,0.3)]";
}

const TrendIcon = ({ trend }: { trend: GymHealthScore["trend"] }) => {
  if (trend === "improving") return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (trend === "declining") return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-peec-text-muted" />;
};

export function HealthScoreOrb({ healthScore }: HealthScoreOrbProps) {
  const { overall, components, trend } = healthScore;
  const color = scoreColor(overall);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  const springValue = useSpring(0, { duration: 1200, bounce: 0.15 });
  const dashOffset = useTransform(
    springValue,
    (v: number) => circumference - (v / 100) * circumference,
  );
  const displayNumber = useTransform(springValue, (v: number) => Math.round(v));

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    springValue.set(overall);
  }, [springValue, overall]);

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
      className={`flex flex-col items-center gap-3 rounded-2xl border border-peec-border-light bg-white p-6 ${scoreGlowClass(overall)} transition-shadow duration-1000`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-peec-text-muted">
        Gym Health Score
      </p>

      {/* SVG Orb */}
      <div className="relative flex items-center justify-center">
        <svg width="148" height="148" viewBox="0 0 148 148">
          {/* Background circle */}
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="8"
          />
          {/* Animated progress arc */}
          <motion.circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset }}
            transform="rotate(-90 74 74)"
          />
        </svg>

        {/* Center content */}
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
    </motion.div>
  );
}
