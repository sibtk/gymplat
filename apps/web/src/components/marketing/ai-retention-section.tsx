"use client";

import { motion, useInView, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import { Activity, Brain, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

import { ScrollFadeIn } from "./animation-wrapper";
import { GlassCard } from "./glass-card";

/* ---------- Health Score Orb (simplified) ---------- */

function MarketingHealthOrb() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const spring = useSpring(0, { duration: 2400, bounce: 0 });
  const display = useTransform(spring, (v: number) => Math.round(v).toString());

  useEffect(() => {
    if (isInView) spring.set(96);
  }, [isInView, spring]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  // Color transitions: red -> orange -> yellow -> green
  const strokeColor = useTransform(
    spring,
    [0, 58, 62, 73, 77, 83, 87, 96],
    ["#ef4444", "#ef4444", "#f97316", "#f97316", "#eab308", "#eab308", "#4ade80", "#4ade80"],
  );

  // Arc length driven by spring
  const filledLen = useTransform(spring, (v) => circumference * (v / 100));
  const gapLen = useTransform(spring, (v) => circumference * (1 - v / 100));
  const dashArray = useMotionTemplate`${filledLen} ${gapLen}`;

  // Dynamic glow color matches stroke
  const glowFilter = useMotionTemplate`drop-shadow(0 0 12px ${strokeColor}) drop-shadow(0 0 40px ${strokeColor})`;

  const quadrants = [
    { label: "Ret", value: 97, color: "text-green-400" },
    { label: "Rev", value: 94, color: "text-blue-400" },
    { label: "Eng", value: 98, color: "text-emerald-400" },
    { label: "Grw", value: 95, color: "text-amber-400" },
  ];

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* Score ring — glow comes purely from SVG drop-shadow, no extra DOM elements */}
      <div className="relative flex h-52 w-52 items-center justify-center">
        <svg viewBox="0 0 120 120" className="relative h-44 w-44 -rotate-90" style={{ overflow: "visible" }}>
          {/* Track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
          />
          {/* Filled arc with glow */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            style={{
              stroke: strokeColor,
              strokeDasharray: dashArray,
              filter: glowFilter,
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span className="text-4xl font-bold text-peec-dark">{display}</motion.span>
          <span className="text-2xs text-peec-text-muted">Health Score</span>
        </div>
      </div>

      {/* Quadrant scores */}
      <div className="mt-4 flex gap-4">
        {quadrants.map((q) => (
          <div key={q.label} className="text-center">
            <p className={`text-sm font-bold ${q.color}`}>{q.value}</p>
            <p className="text-2xs text-peec-text-muted">{q.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Capabilities ---------- */

const capabilities = [
  {
    icon: Brain,
    title: "Churn Prediction",
    desc: "ML models flag at-risk members weeks before they cancel.",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    accent: "rose" as const,
  },
  {
    icon: Activity,
    title: "Health Score",
    desc: "Real-time composite score across retention, revenue, engagement, and growth.",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    accent: "emerald" as const,
  },
  {
    icon: Zap,
    title: "AI Copilot",
    desc: "One-click interventions — emails, discounts, staff tasks — recommended by AI.",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    accent: "amber" as const,
  },
];

/* ---------- Main Section ---------- */

export function AiRetentionSection() {
  return (
    <section id="ai-retention" className="relative overflow-hidden px-6 py-section">
      {/* Gradient wash background — colored tints */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(16,185,129,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(59,130,246,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-peec">
      <div className="text-center">
        <ScrollFadeIn>
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-peec-text-muted">
            AI Retention Engine
          </p>
          <h2 className="mx-auto mb-4 max-w-2xl text-4xl font-medium tracking-tight text-peec-dark tablet:text-5xl">
            Predict churn. Prevent cancellations.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-peec-text-secondary">
            Machine learning that understands your members and acts before they leave.
          </p>
        </ScrollFadeIn>

        {/* Health Score Orb */}
        <ScrollFadeIn delay={0.1}>
          <div className="mx-auto mb-12 max-w-xs">
            <MarketingHealthOrb />
          </div>
        </ScrollFadeIn>

        {/* Capabilities — card grid */}
        <ScrollFadeIn delay={0.15}>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 tablet:grid-cols-3">
            {capabilities.map((item) => (
              <GlassCard key={item.title} accent={item.accent}>
                <div className="text-left">
                  <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.iconBg}`}>
                    <item.icon className={`h-[18px] w-[18px] ${item.iconColor}`} />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-peec-dark">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-peec-text-secondary">{item.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
      </div>
    </section>
  );
}
