"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ChartLine } from "@/lib/mock-data";

// ─── Chart helpers (ported from dashboard-preview.tsx) ───

const CHART_W = 600;
const CHART_H = 220;
const CHART_PAD = 35;

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

// ─── Component ───

interface RetentionChartProps {
  lines: ChartLine[];
  months: string[];
}

export function RetentionChart({ lines, months }: RetentionChartProps) {
  const [activeMonth, setActiveMonth] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = chartRef.current?.getBoundingClientRect();
      if (!rect) return;

      const padFrac = CHART_PAD / CHART_W;
      const relX = (e.clientX - rect.left) / rect.width;
      const clamped = Math.max(padFrac, Math.min(1 - padFrac, relX));
      const normalized = (clamped - padFrac) / (1 - 2 * padFrac);
      const index = Math.round(normalized * (months.length - 1));
      setActiveMonth(index);
    },
    [months.length],
  );

  // Auto-advance when not hovering
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveMonth((prev) => (prev + 1) % months.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, months.length]);

  const tooltipXPercent =
    ((CHART_PAD + activeMonth * ((CHART_W - CHART_PAD * 2) / (months.length - 1))) / CHART_W) * 100;

  const tooltipTransform =
    tooltipXPercent < 15
      ? "translateX(-5%)"
      : tooltipXPercent > 85
        ? "translateX(-95%)"
        : "translateX(-50%)";

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-peec-dark">Retention Trends</h3>
          <p className="text-xs text-peec-text-muted">Member retention by plan type</p>
        </div>
        {/* Legend */}
        <div className="hidden flex-wrap gap-3 tablet:flex">
          {lines.map((line) => (
            <div key={line.label} className="flex items-center gap-1.5 text-xs text-peec-text-secondary">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: line.color }} />
              {line.label}
            </div>
          ))}
        </div>
      </div>

      <div
        ref={chartRef}
        className="relative cursor-crosshair"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="h-48 w-full tablet:h-56">
          {/* Horizontal grid lines */}
          {[30, 50, 70, 90].map((v) => {
            const y = CHART_H - CHART_PAD - ((v - 30) / 70) * (CHART_H - CHART_PAD * 2);
            return (
              <g key={v}>
                <line
                  x1={CHART_PAD}
                  y1={y}
                  x2={CHART_W - CHART_PAD}
                  y2={y}
                  stroke="#e5e5e5"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <text x={CHART_PAD - 6} y={y + 3} textAnchor="end" className="fill-peec-text-muted text-[9px]">
                  {v}%
                </text>
              </g>
            );
          })}

          {/* Vertical indicator */}
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
            transition={{ duration: isHovered ? 0.15 : 0.6, ease: "easeInOut" }}
          />

          {/* Smooth chart lines */}
          {lines.map((line) => (
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

          {/* Data points on active month */}
          {lines.map((line) => {
            const pt = toPoint(line.values[activeMonth] ?? 0, activeMonth, months.length);
            return (
              <motion.circle
                key={line.label}
                r="4"
                fill={line.color}
                stroke="white"
                strokeWidth="2"
                animate={{ cx: pt.x, cy: pt.y }}
                transition={{ duration: isHovered ? 0.15 : 0.6, ease: "easeInOut" }}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        <motion.div
          className="pointer-events-none absolute top-0 z-10 rounded-xl border border-peec-border-light bg-white px-4 py-3 shadow-card-hover"
          animate={{ left: `${tooltipXPercent}%` }}
          style={{ transform: tooltipTransform }}
          transition={{ duration: isHovered ? 0.15 : 0.6, ease: "easeInOut" }}
        >
          <p className="mb-2 text-xs font-semibold text-peec-dark">{months[activeMonth]}</p>
          {lines.map((line) => (
            <div key={line.label} className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: line.color }} />
              <span className="w-20 text-peec-text-secondary">{line.label}</span>
              <span className="font-medium text-peec-dark">{line.values[activeMonth] ?? 0}%</span>
            </div>
          ))}
        </motion.div>

        {/* X axis labels */}
        <div className="mt-1 flex justify-between px-8 text-xs text-peec-text-muted">
          {months.map((m, i) => (
            <span key={m} className={i === activeMonth ? "font-medium text-peec-dark" : ""}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
