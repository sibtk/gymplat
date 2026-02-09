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
import { useEffect, useState } from "react";

import { AnimationWrapper } from "./animation-wrapper";

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
  { label: "24/7 Access", color: "#171717", values: [65, 68, 70, 72, 75, 78] },
  { label: "Premium", color: "#3b82f6", values: [72, 73, 71, 74, 76, 80] },
  { label: "PT Package", color: "#22c55e", values: [85, 82, 83, 86, 88, 92] },
  { label: "Student", color: "#f59e0b", values: [45, 48, 42, 44, 47, 50] },
  { label: "Corporate", color: "#8b5cf6", values: [55, 58, 60, 62, 58, 55] },
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
  { label: "Base", color: "#3b82f6", percentage: 42 },
  { label: "Standard", color: "#22c55e", percentage: 28 },
  { label: "Premium", color: "#f59e0b", percentage: 15 },
  { label: "Discount", color: "#8b5cf6", percentage: 10 },
  { label: "B2B", color: "#a3a3a3", percentage: 5 },
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
const CHART_PAD = 30;

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
      return "bg-amber-50 text-amber-700";
    case "Base":
      return "bg-blue-50 text-blue-700";
    case "Standard":
      return "bg-green-50 text-green-700";
    default:
      return "bg-stone-100 text-stone-600";
  }
}

// --- COMPONENT ---

export function DashboardPreview() {
  const [activeMonth, setActiveMonth] = useState(3);
  const [typedText, setTypedText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sliding chart tooltip — auto-advance every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMonth((prev) => (prev + 1) % months.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
  const tooltipXPercent =
    ((CHART_PAD + activeMonth * ((CHART_W - CHART_PAD * 2) / (months.length - 1))) / CHART_W) * 100;

  // Clamp transform so tooltip doesn't overflow card edges
  const tooltipTransform =
    tooltipXPercent < 20
      ? "translateX(-10%)"
      : tooltipXPercent > 80
        ? "translateX(-90%)"
        : "translateX(-50%)";

  return (
    <div className="relative pb-section pt-0">
      {/* Dot texture background */}
      <div className="dot-texture pointer-events-none absolute inset-0 opacity-40" />

      {/* Gradient glow behind dashboard */}
      <div className="dashboard-glow pointer-events-none absolute left-1/2 top-1/3 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative mx-auto max-w-6xl px-6">
        <AnimationWrapper delay={0.2}>
          {/* ===== DASHBOARD CARD ===== */}
          <div className="overflow-hidden rounded-2xl border border-peec-border-light bg-white shadow-card-hover">
            <div className="flex">
              {/* ----- Sidebar ----- */}
              <div className="hidden w-[200px] shrink-0 border-r border-peec-border-light bg-stone-50 p-4 tablet:block">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-peec-dark">
                    <span className="text-xs font-bold text-white">G</span>
                  </div>
                  <span className="text-sm font-semibold text-peec-dark">
                    GymPlatform
                  </span>
                </div>

                <div className="mb-4 flex items-center gap-2 rounded-lg border border-peec-border-light bg-white px-3 py-1.5">
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
                          ? "border border-peec-border-light bg-white font-medium text-peec-dark shadow-sm"
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
                <div className="flex flex-wrap items-center gap-2 border-b border-peec-border-light px-4 py-2.5 tablet:px-6">
                  <span className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-peec-dark">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-peec-dark">
                      <span className="text-2xs font-bold text-white">G</span>
                    </span>
                    Iron Temple
                  </span>
                  {["Last 7 days", "All Locations", "All Plans"].map((filter) => (
                    <span
                      key={filter}
                      className="flex items-center gap-1 rounded-full border border-peec-border-light px-3 py-1 text-xs text-peec-text-tertiary"
                    >
                      <span className="h-1 w-1 rounded-full bg-peec-text-muted" />
                      {filter}
                    </span>
                  ))}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="rounded-full border border-peec-border-light p-1.5">
                      <BarChart3 className="h-3 w-3 text-peec-text-tertiary" />
                    </span>
                    <span className="flex items-center gap-1 text-xs text-peec-text-tertiary">
                      <ArrowUpRight className="h-3 w-3" /> Export
                    </span>
                  </div>
                </div>

                <div className="p-4 tablet:p-5">
                  {/* Stats banner */}
                  <div className="mb-4 rounded-xl border border-peec-border-light bg-stone-50/80 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-peec-dark">
                        Overview &middot;{" "}
                        <span className="font-medium">
                          Iron Temple&apos;s retention trending up by 5.2% this month
                        </span>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-peec-text-tertiary">
                        <span>
                          Members:{" "}
                          <strong className="text-peec-dark">847/1K</strong>{" "}
                          <TrendingDown className="inline h-3 w-3 text-red-500" />
                        </span>
                        <span>
                          &middot; Retention:{" "}
                          <strong className="text-peec-dark">92%</strong>{" "}
                          <TrendingUp className="inline h-3 w-3 text-green-500" />
                        </span>
                        <span>
                          &middot; Revenue:{" "}
                          <strong className="text-peec-dark">$42K</strong>{" "}
                          <TrendingUp className="inline h-3 w-3 text-green-500" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chart + Right panels */}
                  <div className="flex gap-4">
                    {/* Left column */}
                    <div className="min-w-0 flex-1">
                      {/* ===== CHART CARD ===== */}
                      <div className="rounded-xl border border-peec-border-light bg-white p-4">
                        {/* Tabs */}
                        <div className="mb-3 flex items-center gap-4">
                          <div className="flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1">
                            <span className="h-1 w-1 rounded-full bg-peec-dark" />
                            <span className="text-xs font-medium text-peec-dark">Retention</span>
                          </div>
                          <span className="text-xs text-peec-text-muted">Revenue</span>
                          <span className="text-xs text-peec-text-muted">Check-ins</span>
                          <div className="ml-auto flex gap-1.5">
                            <span className="rounded border border-peec-border-light p-1">
                              <BarChart3 className="h-3 w-3 text-peec-text-tertiary" />
                            </span>
                            <span className="rounded border border-peec-border-light p-1">
                              <TrendingUp className="h-3 w-3 text-peec-text-tertiary" />
                            </span>
                          </div>
                        </div>

                        {/* SVG Chart */}
                        <div className="relative">
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
                                  stroke="#e5e5e5"
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
                              stroke="#d4d4d4"
                              strokeWidth="1"
                              strokeDasharray="3 3"
                              animate={{
                                x1: toPoint(0, activeMonth, months.length).x,
                                x2: toPoint(0, activeMonth, months.length).x,
                              }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
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
                                  stroke="white"
                                  strokeWidth="2"
                                  animate={{ cx: pt.x, cy: pt.y }}
                                  transition={{
                                    duration: 0.6,
                                    ease: "easeInOut",
                                  }}
                                />
                              );
                            })}
                          </svg>

                          {/* Floating tooltip */}
                          <motion.div
                            className="pointer-events-none absolute top-0 z-10 rounded-xl border border-peec-border-light bg-white px-4 py-3 shadow-card-hover"
                            animate={{ left: `${tooltipXPercent}%` }}
                            style={{ transform: tooltipTransform }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
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
                          <div className="mt-1 flex justify-between px-6 text-xs text-peec-text-muted">
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
                      <div className="mt-4 rounded-xl border border-peec-border-light bg-white p-4">
                        <div className="mb-3 flex items-center gap-0">
                          <span className="rounded-l-lg border border-peec-border-light bg-stone-100 px-3 py-1 text-xs font-medium text-peec-dark">
                            Plans
                          </span>
                          <span className="rounded-r-lg border border-l-0 border-peec-border-light px-3 py-1 text-xs text-peec-text-muted">
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
                                className="border-t border-peec-border-light/50"
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
                                          chartLines[plan.rank - 1]?.color ?? "#a3a3a3",
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
                      <div className="rounded-xl border border-peec-border-light bg-white p-4">
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
                                className="border-t border-peec-border-light/50"
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
                                      className={`ml-1 text-2xs ${loc.delta > 0 ? "text-green-500" : "text-red-500"}`}
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
                      <div className="rounded-xl border border-peec-border-light bg-white p-4">
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
            <div className="rounded-2xl border border-peec-border-light bg-white px-5 py-4 shadow-card-hover">
              <div className="mb-2 min-h-[24px]">
                <span className="text-sm text-peec-text-muted">
                  {typedText}
                </span>
                <span className="animate-blink ml-0.5 inline-block h-4 w-[2px] bg-peec-dark align-middle" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-peec-border-light px-2.5 py-0.5 text-2xs text-peec-text-muted">
                    AI Agent
                  </span>
                  <span className="rounded-full border border-peec-border-light px-2.5 py-0.5 text-2xs text-peec-text-muted">
                    No tags
                  </span>
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-peec-dark text-white"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
}
