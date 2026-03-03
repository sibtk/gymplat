"use client";

import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ScrollFadeIn } from "./animation-wrapper";

// --- DATA ---

const sidebarPages = [
  { label: "Overview", active: true },
  { label: "Members", active: false },
  { label: "Classes", active: false },
  { label: "Payments", active: false },
  { label: "AI Insights", active: false },
  { label: "Settings", active: false },
];

const chartLines = [
  { label: "24/7 Access", color: "#e5e5e5", values: [65, 68, 70, 72, 75, 78] },
  { label: "Premium", color: "#60a5fa", values: [72, 73, 71, 74, 76, 80] },
  { label: "PT Package", color: "#4ade80", values: [85, 82, 83, 86, 88, 92] },
  { label: "Student", color: "#fbbf24", values: [45, 48, 42, 44, 47, 50] },
  { label: "Corporate", color: "#a78bfa", values: [55, 58, 60, 62, 58, 55] },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const locationsData = [
  { rank: 1, name: "Downtown", retention: "92%", members: 847, score: 86 },
  { rank: 2, name: "Westside", retention: "88%", members: 623, score: 62, delta: -0.2 },
  { rank: 3, name: "Eastgate", retention: "95%", members: 341, score: 89, delta: 0.3 },
  { rank: 4, name: "Campus", retention: "78%", members: 512, score: 76, delta: -0.3 },
  { rank: 5, name: "Business Park", retention: "82%", members: 234, score: 88, delta: 0.4 },
];

const plansTableData = [
  { rank: 1, name: "24/7 Access", type: "Base", share: "42%", avgRetention: "78%" },
  { rank: 2, name: "Premium", type: "Standard", share: "28%", avgRetention: "88%" },
  { rank: 3, name: "PT Package", type: "Premium", share: "15%", avgRetention: "92%" },
  { rank: 4, name: "Student", type: "Discount", share: "10%", avgRetention: "50%" },
];

const planDistribution = [
  { label: "Base", color: "#60a5fa", percentage: 42 },
  { label: "Standard", color: "#4ade80", percentage: 28 },
  { label: "Premium", color: "#fbbf24", percentage: 15 },
  { label: "Discount", color: "#a78bfa", percentage: 10 },
  { label: "B2B", color: "#737373", percentage: 5 },
];

const aiPrompts = [
  "Show me members at risk of churning this month",
  "Compare revenue across all locations",
  "Which classes have the highest retention?",
  "Generate a win-back campaign for inactive members",
  "Predict next month's revenue growth",
];

// --- CHART HELPERS ---

const CHART_W = 500;
const CHART_H = 180;
const CHART_PAD = 0;

function toPoint(value: number, index: number, total: number) {
  const xStep = (CHART_W - CHART_PAD * 2) / (total - 1);
  const x = CHART_PAD + index * xStep;
  const y = CHART_H - CHART_PAD - ((value - 30) / 70) * (CHART_H - CHART_PAD * 2);
  return { x, y };
}

function smoothPath(values: number[]): string {
  const points = values.map((v, i) => toPoint(v, i, values.length));
  if (points.length < 2) return "";

  const first = points[0] as { x: number; y: number };
  let d = `M ${first.x.toFixed(1)},${first.y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)] as { x: number; y: number };
    const p1 = points[i] as { x: number; y: number };
    const p2 = points[i + 1] as { x: number; y: number };
    const p3 = points[Math.min(points.length - 1, i + 2)] as { x: number; y: number };

    const tension = 0.25;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  return d;
}

// --- TYPE BADGE COLOR ---

function typeBadgeClass(type: string): string {
  switch (type) {
    case "Premium":
      return "bg-amber-500/15 text-amber-400";
    case "Base":
      return "bg-blue-500/15 text-blue-400";
    case "Standard":
      return "bg-green-500/15 text-green-400";
    default:
      return "bg-white/5 text-peec-text-tertiary";
  }
}

// --- COMPONENT ---

export function DashboardPreview() {
  const [activeMonth, setActiveMonth] = useState(3);
  const [typedText, setTypedText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChartHovered, setIsChartHovered] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleChartMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = chartRef.current?.getBoundingClientRect();
      if (!rect) return;

      const relX = (e.clientX - rect.left) / rect.width;
      const index = Math.round(Math.max(0, Math.min(1, relX)) * (months.length - 1));
      setActiveMonth(index);
    },
    [],
  );

  // Fallback auto-advance when not hovering
  useEffect(() => {
    if (isChartHovered) return;
    const interval = setInterval(() => {
      setActiveMonth((prev) => (prev + 1) % months.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isChartHovered]);

  // Typing animation
  useEffect(() => {
    const currentPrompt = aiPrompts[promptIndex] ?? "";

    if (!isDeleting) {
      if (typedText.length < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setTypedText(currentPrompt.slice(0, typedText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (typedText.length > 0) {
      const timeout = setTimeout(() => {
        setTypedText(typedText.slice(0, -1));
      }, 30);
      return () => clearTimeout(timeout);
    }

    setIsDeleting(false);
    setPromptIndex((prev) => (prev + 1) % aiPrompts.length);
    return undefined;
  }, [typedText, isDeleting, promptIndex]);

  // Tooltip x position (percentage)
  const tooltipXPercent = (activeMonth / (months.length - 1)) * 100;

  return (
    <div className="relative pb-section pt-0">
      <div className="relative mx-auto max-w-6xl px-6">
        <ScrollFadeIn delay={0.2}>
          {/* ===== DASHBOARD CARD ===== */}
          <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/[0.08]">
            {/* Shine line across top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="flex">
              {/* ----- Sidebar ----- */}
              <div className="hidden w-[200px] shrink-0 border-r border-white/[0.06] p-4 tablet:block" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                    <span className="text-xs font-bold text-peec-dark">I</span>
                  </div>
                  <span className="text-sm font-semibold text-peec-dark">
                    INVINCIBLE
                  </span>
                </div>

                <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
                  <Search className="h-3 w-3 text-peec-text-tertiary" />
                  <span className="text-xs text-peec-text-muted">Quick Actions</span>
                </div>

                <p className="mb-2 text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                  Pages
                </p>
                <nav className="flex flex-col gap-0.5">
                  {sidebarPages.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                        item.active
                          ? "border border-white/[0.08] bg-white/[0.05] font-medium text-peec-dark"
                          : "text-peec-text-tertiary"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* ----- Main Content ----- */}
              <div className="min-w-0 flex-1">
                {/* Top filter bar */}
                <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-4 py-2.5 tablet:px-6">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-peec-dark">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-white/10">
                      <span className="text-2xs font-bold text-peec-dark">I</span>
                    </span>
                    INVINCIBLE
                  </span>
                  {["Last 7 days", "All Locations", "All Plans"].map((filter) => (
                    <span
                      key={filter}
                      className="flex items-center gap-1 rounded-full border border-white/[0.06] px-3 py-1 text-xs text-peec-text-tertiary"
                    >
                      <span className="h-1 w-1 rounded-full bg-peec-text-muted" />
                      {filter}
                    </span>
                  ))}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="rounded-full border border-white/[0.06] p-1.5">
                      <BarChart3 className="h-3 w-3 text-peec-text-tertiary" />
                    </span>
                    <span className="flex items-center gap-1 text-xs text-peec-text-tertiary">
                      <ArrowUpRight className="h-3 w-3" /> Export
                    </span>
                  </div>
                </div>

                <div className="p-4 tablet:p-5">
                  {/* Stats banner */}
                  <div className="mb-4 rounded-xl border border-white/[0.06] px-4 py-3 glass-surface">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-peec-dark">
                        Overview &middot;{" "}
                        <span className="font-medium">
                          INVINCIBLE&apos;s retention trending up by 5.2% this month
                        </span>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-peec-text-tertiary">
                        <span>
                          Members:{" "}
                          <strong className="text-peec-dark">847/1K</strong>{" "}
                          <TrendingDown className="inline h-3 w-3 text-red-400" />
                        </span>
                        <span>
                          &middot; Retention:{" "}
                          <strong className="text-peec-dark">92%</strong>{" "}
                          <TrendingUp className="inline h-3 w-3 text-green-400" />
                        </span>
                        <span>
                          &middot; Revenue:{" "}
                          <strong className="text-peec-dark">$42K</strong>{" "}
                          <TrendingUp className="inline h-3 w-3 text-green-400" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chart + Right panels */}
                  <div className="flex gap-4">
                    {/* Left column */}
                    <div className="min-w-0 flex-1">
                      {/* ===== CHART CARD ===== */}
                      <div className="rounded-xl border border-white/[0.06] p-4 glass-surface">
                        {/* Tabs */}
                        <div className="mb-3 flex items-center gap-4">
                          <div className="flex items-center gap-1 rounded-full bg-white/[0.08] px-3 py-1">
                            <span className="h-1 w-1 rounded-full bg-emerald-400" />
                            <span className="text-xs font-medium text-peec-dark">Retention</span>
                          </div>
                          <span className="text-xs text-peec-text-muted">Revenue</span>
                          <span className="text-xs text-peec-text-muted">Check-ins</span>
                          <div className="ml-auto flex gap-1.5">
                            <span className="rounded border border-white/[0.06] p-1">
                              <BarChart3 className="h-3 w-3 text-peec-text-tertiary" />
                            </span>
                            <span className="rounded border border-white/[0.06] p-1">
                              <TrendingUp className="h-3 w-3 text-peec-text-tertiary" />
                            </span>
                          </div>
                        </div>

                        {/* SVG Chart */}
                        <div
                          ref={chartRef}
                          className="relative cursor-crosshair"
                          onMouseEnter={() => setIsChartHovered(true)}
                          onMouseMove={handleChartMouseMove}
                          onMouseLeave={() => setIsChartHovered(false)}
                        >
                          <svg
                            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                            className="h-40 w-full"
                          >
                            {/* Horizontal grid lines */}
                            {[30, 50, 70, 90].map((v) => {
                              const y =
                                CHART_H -
                                CHART_PAD -
                                ((v - 30) / 70) * (CHART_H - CHART_PAD * 2);
                              return (
                                <line
                                  key={v}
                                  x1={CHART_PAD}
                                  y1={y}
                                  x2={CHART_W - CHART_PAD}
                                  y2={y}
                                  stroke="rgba(255,255,255,0.06)"
                                  strokeWidth="0.5"
                                  strokeDasharray="4 4"
                                />
                              );
                            })}

                            {/* Animated vertical indicator */}
                            <motion.line
                              x1={0}
                              y1={CHART_PAD}
                              x2={0}
                              y2={CHART_H - CHART_PAD}
                              stroke="rgba(255,255,255,0.15)"
                              strokeWidth="1"
                              strokeDasharray="3 3"
                              animate={{
                                x1: toPoint(0, activeMonth, months.length).x,
                                x2: toPoint(0, activeMonth, months.length).x,
                              }}
                              transition={{ duration: isChartHovered ? 0.15 : 0.6, ease: "easeInOut" }}
                            />

                            {/* Smooth chart lines */}
                            {chartLines.map((line) => (
                              <path
                                key={line.label}
                                d={smoothPath(line.values)}
                                fill="none"
                                stroke={line.color}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={0.8}
                              />
                            ))}

                            {/* Animated data points on active month */}
                            {chartLines.map((line) => {
                              const pt = toPoint(
                                line.values[activeMonth] ?? 0,
                                activeMonth,
                                months.length,
                              );
                              return (
                                <motion.circle
                                  key={line.label}
                                  r="4"
                                  fill={line.color}
                                  stroke="rgba(10,10,10,0.9)"
                                  strokeWidth="2"
                                  animate={{ cx: pt.x, cy: pt.y }}
                                  transition={{
                                    duration: isChartHovered ? 0.15 : 0.6,
                                    ease: "easeInOut",
                                  }}
                                />
                              );
                            })}
                          </svg>

                          {/* Floating tooltip */}
                          <motion.div
                            className="pointer-events-none absolute top-0 z-10 w-[180px] rounded-xl border border-white/[0.08] px-4 py-3"
                            style={{
                              background: "rgba(10,10,10,0.92)",
                              backdropFilter: "blur(16px)",
                              WebkitBackdropFilter: "blur(16px)",
                              boxShadow: "0 8px 32px -8px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.06)",
                              transform: "translateX(-50%)",
                            }}
                            animate={{ left: `${tooltipXPercent}%` }}
                            transition={{ duration: isChartHovered ? 0.15 : 0.6, ease: "easeInOut" }}
                          >
                            <p className="mb-2 text-xs font-semibold text-peec-dark">
                              {months[activeMonth]} 2025
                            </p>
                            {chartLines.map((line) => (
                              <div
                                key={line.label}
                                className="flex items-center gap-2 text-xs"
                              >
                                <span
                                  className="h-2 w-2 rounded-sm"
                                  style={{ backgroundColor: line.color }}
                                />
                                <span className="w-20 text-peec-text-secondary">
                                  {line.label}
                                </span>
                                <span className="font-medium text-peec-dark">
                                  &middot; {line.values[activeMonth] ?? 0}%
                                </span>
                              </div>
                            ))}
                          </motion.div>

                          {/* X axis labels */}
                          <div className="mt-1 flex justify-between text-xs text-peec-text-muted">
                            {months.map((m, i) => (
                              <span
                                key={m}
                                className={
                                  i === activeMonth
                                    ? "font-medium text-peec-dark"
                                    : ""
                                }
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ===== PLANS TABLE ===== */}
                      <div className="mt-4 rounded-xl border border-white/[0.06] p-4 glass-surface">
                        <div className="mb-3 flex items-center gap-0">
                          <span className="rounded-l-lg border border-white/[0.08] bg-white/[0.06] px-3 py-1 text-xs font-medium text-peec-dark">
                            Plans
                          </span>
                          <span className="rounded-r-lg border border-l-0 border-white/[0.06] px-3 py-1 text-xs text-peec-text-muted">
                            Locations
                          </span>
                        </div>
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-2xs text-peec-text-muted">
                              <th className="pb-2 font-normal">#</th>
                              <th className="pb-2 font-normal">Plan</th>
                              <th className="pb-2 font-normal">Type</th>
                              <th className="pb-2 font-normal">Share</th>
                              <th className="pb-2 font-normal">Avg. Retention</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plansTableData.map((plan) => (
                              <tr
                                key={plan.name}
                                className="border-t border-white/[0.04]"
                              >
                                <td className="py-2 text-xs text-peec-text-muted">
                                  {plan.rank}
                                </td>
                                <td className="py-2">
                                  <span className="flex items-center gap-1.5 text-xs text-peec-dark">
                                    <span
                                      className="h-3 w-3 rounded"
                                      style={{
                                        backgroundColor:
                                          chartLines[plan.rank - 1]?.color ?? "#737373",
                                      }}
                                    />
                                    {plan.name}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-2xs font-medium ${typeBadgeClass(plan.type)}`}
                                  >
                                    {plan.type}
                                  </span>
                                </td>
                                <td className="py-2 text-xs text-peec-text-secondary">
                                  {plan.share}
                                </td>
                                <td className="py-2 text-xs text-peec-text-secondary">
                                  {plan.avgRetention}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="hidden w-[280px] shrink-0 space-y-4 tablet:block">
                      {/* ===== LOCATION PERFORMANCE TABLE ===== */}
                      <div className="rounded-xl border border-white/[0.06] p-4 glass-surface">
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-sm font-semibold text-peec-dark">
                            Location Performance
                          </p>
                          <ArrowUpRight className="h-4 w-4 text-peec-text-muted" />
                        </div>
                        <p className="mb-3 text-2xs text-peec-text-muted">
                          Compare across your locations
                        </p>

                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-2xs text-peec-text-muted">
                              <th className="pb-2 font-normal">#</th>
                              <th className="pb-2 font-normal">Location</th>
                              <th className="pb-2 font-normal">Retention</th>
                              <th className="pb-2 font-normal">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {locationsData.map((loc) => (
                              <tr
                                key={loc.name}
                                className="border-t border-white/[0.04]"
                              >
                                <td className="py-1.5 text-2xs text-peec-text-muted">
                                  {loc.rank}
                                </td>
                                <td className="py-1.5">
                                  <span className="text-xs text-peec-dark">
                                    {loc.name}
                                  </span>
                                </td>
                                <td className="py-1.5">
                                  <span className="text-xs text-peec-dark">
                                    {loc.retention}
                                  </span>
                                  {loc.delta !== undefined && (
                                    <span
                                      className={`ml-1 text-2xs ${loc.delta > 0 ? "text-green-400" : "text-red-400"}`}
                                    >
                                      {loc.delta > 0 ? "\u2191" : "\u2193"}{" "}
                                      {Math.abs(loc.delta)}
                                    </span>
                                  )}
                                </td>
                                <td className="py-1.5 text-xs text-peec-text-secondary">
                                  | {loc.score}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* ===== PLAN DISTRIBUTION DONUT ===== */}
                      <div className="rounded-xl border border-white/[0.06] p-4 glass-surface">
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-sm font-semibold text-peec-dark">
                            Plans by Type
                          </p>
                          <ArrowUpRight className="h-4 w-4 text-peec-text-muted" />
                        </div>
                        <p className="mb-3 text-2xs text-peec-text-muted">
                          Member distribution by plan
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="relative h-24 w-24 shrink-0">
                            <svg
                              viewBox="0 0 120 120"
                              className="h-full w-full -rotate-90"
                            >
                              {(() => {
                                const circumference = 2 * Math.PI * 45;
                                let offset = 0;
                                return planDistribution.map((segment) => {
                                  const dashLength =
                                    (segment.percentage / 100) * circumference;
                                  const currentOffset = offset;
                                  offset += dashLength;
                                  return (
                                    <circle
                                      key={segment.label}
                                      cx="60"
                                      cy="60"
                                      r="45"
                                      fill="none"
                                      stroke={segment.color}
                                      strokeWidth="12"
                                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                                      strokeDashoffset={-currentOffset}
                                    />
                                  );
                                });
                              })()}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold text-peec-dark">
                                42%
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {planDistribution.map((s) => (
                              <span
                                key={s.label}
                                className="flex items-center gap-1.5 text-2xs text-peec-text-secondary"
                              >
                                <span
                                  className="h-2 w-2 rounded-sm"
                                  style={{ backgroundColor: s.color }}
                                />
                                {s.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== AI PROMPT OVERLAY ===== */}
          <div className="relative -mt-6 mx-auto max-w-xl">
            <div
              className="glass-card rounded-2xl border border-white/[0.08] px-5 py-4"
              data-accent="emerald"
            >
              <div className="relative z-10 mb-2 min-h-[24px]">
                <span className="text-sm text-peec-text-muted">
                  {typedText}
                </span>
                <span className="animate-blink ml-0.5 inline-block h-4 w-[2px] bg-peec-dark align-middle" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/[0.06] px-2.5 py-0.5 text-2xs text-peec-text-muted">
                    AI Agent
                  </span>
                  <span className="rounded-full border border-white/[0.06] px-2.5 py-0.5 text-2xs text-peec-text-muted">
                    No tags
                  </span>
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-peec-dark"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </div>
  );
}
