"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  Brain,
  Check,
  DollarSign,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { BlurFadeIn, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

/* ---------- Health Score Orb (marketing version, no store) ---------- */

function MarketingHealthOrb() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v: number) => Math.round(v).toString());

  useEffect(() => {
    if (isInView) spring.set(86);
  }, [isInView, spring]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * 0.86;

  const quadrants = [
    { label: "Ret", value: 88, color: "text-green-600" },
    { label: "Rev", value: 76, color: "text-blue-600" },
    { label: "Eng", value: 92, color: "text-emerald-600" },
    { label: "Grw", value: 68, color: "text-amber-600" },
  ];

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* Orb */}
      <div className="relative flex h-44 w-44 items-center justify-center">
        <div className="absolute inset-0 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.25)]" />
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="7"
          />
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="7"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={isInView ? { strokeDasharray: `${filled} ${circumference - filled}` } : {}}
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
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

/* ---------- Mini Risk Heatmap ---------- */

const heatmapData = [
  [0, 1, 0, 2, 1, 0, 0],
  [1, 2, 1, 2, 2, 1, 0],
  [0, 1, 2, 3, 2, 1, 0],
  [0, 0, 1, 2, 1, 0, 0],
];

const heatColors = ["bg-green-100", "bg-green-300", "bg-amber-300", "bg-red-400"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MiniHeatmap() {
  return (
    <div>
      <div className="mb-2 flex gap-1 pl-8">
        {days.map((d) => (
          <span key={d} className="flex-1 text-center text-[8px] text-peec-text-muted">{d}</span>
        ))}
      </div>
      <div className="space-y-1">
        {heatmapData.map((row, ri) => (
          <div key={ri} className="flex items-center gap-1">
            <span className="w-7 text-right text-[8px] text-peec-text-muted">
              {["6AM", "12PM", "6PM", "9PM"][ri]}
            </span>
            {row.map((val, ci) => (
              <div
                key={ci}
                className={`h-5 flex-1 rounded-sm ${heatColors[val]}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Mini Copilot Queue ---------- */

const interventions = [
  { member: "Sarah J.", action: "Send win-back email", risk: "high" },
  { member: "Mike T.", action: "Offer 10% discount", risk: "medium" },
  { member: "Lisa K.", action: "Schedule check-in call", risk: "high" },
];

function MiniCopilotQueue() {
  return (
    <div className="space-y-2">
      {interventions.map((item) => (
        <div
          key={item.member}
          className="flex items-center justify-between rounded-lg border border-peec-border-light bg-stone-50/50 px-3 py-2"
        >
          <div>
            <p className="text-xs font-medium text-peec-dark">{item.action}</p>
            <p className="text-[10px] text-peec-text-muted">
              {item.member} &middot;{" "}
              <span className={item.risk === "high" ? "text-red-500" : "text-amber-500"}>
                {item.risk} risk
              </span>
            </p>
          </div>
          <div className="flex gap-1">
            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Check className="h-3 w-3" />
            </button>
            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-stone-400">
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Mini Revenue Impact ---------- */

function MiniRevenueImpact() {
  return (
    <div className="text-center">
      <div className="mb-3 flex items-center justify-center gap-2">
        <DollarSign className="h-5 w-5 text-green-500" />
        <span className="text-2xl font-bold text-peec-dark">$4,820</span>
      </div>
      <p className="mb-3 text-xs text-peec-text-secondary">saved this month from 14 interventions</p>
      <div className="flex items-end justify-center gap-1.5">
        {[35, 55, 42, 68, 50, 75, 60, 82, 70, 90, 78, 95].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-t bg-green-400/70"
            style={{ height: `${h * 0.4}px` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Section ---------- */

export function AiRetentionSection() {
  return (
    <SectionContainer id="ai-retention">
      {/* Part A: Split layout */}
      <div className="mb-16 flex flex-col items-center gap-12 tablet:flex-row tablet:gap-16">
        {/* Text */}
        <BlurFadeIn className="flex-1">
          <p className="mb-2 text-sm font-medium text-peec-red">AI Retention Engine</p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Predict churn. Prevent cancellations.{" "}
            <span className="text-peec-text-tertiary">Grow revenue.</span>
          </h2>

          <div className="space-y-5">
            {[
              {
                icon: Brain,
                title: "Churn Prediction",
                desc: "ML models analyze visit patterns, payment history, and engagement to flag at-risk members weeks before they cancel.",
              },
              {
                icon: Activity,
                title: "Health Score",
                desc: "A real-time composite score (0\u2013100) that tells you exactly how your gym is performing across retention, revenue, engagement, and growth.",
              },
              {
                icon: Zap,
                title: "AI Copilot",
                desc: "Automated intervention recommendations \u2014 emails, discounts, staff tasks \u2014 that you can approve with one click.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-peec-light">
                  <item.icon className="h-5 w-5 text-peec-dark" />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-peec-dark">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-peec-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </BlurFadeIn>

        {/* Health Score Orb visual */}
        <BlurFadeIn delay={0.2} className="shrink-0">
          <div className="rounded-2xl border border-peec-border-light bg-white p-8 shadow-card">
            <MarketingHealthOrb />
          </div>
        </BlurFadeIn>
      </div>

      {/* Part B: Three-card showcase */}
      <StaggerContainer className="grid grid-cols-1 gap-6 tablet:grid-cols-3">
        <StaggerItem>
          <div className="rounded-xl border border-peec-border-light bg-white p-6 shadow-card">
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-peec-dark" />
              <h4 className="text-sm font-semibold text-peec-dark">Risk Heatmap</h4>
            </div>
            <p className="mb-4 text-xs text-peec-text-secondary">
              Visualize when your members are most at risk, by day and time.
            </p>
            <MiniHeatmap />
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="rounded-xl border border-peec-border-light bg-white p-6 shadow-card">
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-peec-dark" />
              <h4 className="text-sm font-semibold text-peec-dark">AI Copilot</h4>
            </div>
            <p className="mb-4 text-xs text-peec-text-secondary">
              One-click interventions recommended by the AI.
            </p>
            <MiniCopilotQueue />
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="rounded-xl border border-peec-border-light bg-white p-6 shadow-card">
            <div className="mb-1 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <h4 className="text-sm font-semibold text-peec-dark">Revenue Saved</h4>
            </div>
            <p className="mb-4 text-xs text-peec-text-secondary">
              Track the dollar impact of every intervention.
            </p>
            <MiniRevenueImpact />
          </div>
        </StaggerItem>
      </StaggerContainer>
    </SectionContainer>
  );
}
