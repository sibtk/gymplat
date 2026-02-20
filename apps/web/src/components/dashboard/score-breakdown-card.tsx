"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import type { RiskAssessment } from "@/lib/retention/types";

interface ScoreBreakdownCardProps {
  assessment: RiskAssessment;
}

function riskLevelColor(level: string): string {
  switch (level) {
    case "critical": return "bg-red-500";
    case "high": return "bg-orange-500";
    case "elevated": return "bg-amber-500";
    case "moderate": return "bg-yellow-400";
    case "low": return "bg-green-500";
    default: return "bg-stone-400";
  }
}

function riskLevelTextColor(level: string): string {
  switch (level) {
    case "critical": return "text-red-600";
    case "high": return "text-orange-600";
    case "elevated": return "text-amber-600";
    case "moderate": return "text-yellow-600";
    case "low": return "text-green-600";
    default: return "text-stone-600";
  }
}

const categoryLabels: Record<string, string> = {
  visit_frequency: "Visit Frequency",
  payment: "Payment",
  engagement: "Engagement",
  lifecycle: "Lifecycle",
};

export function ScoreBreakdownCard({ assessment }: ScoreBreakdownCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-peec-border-light bg-white">
      {/* Collapsed view */}
      <button
        type="button"
        className="flex w-full items-center gap-3 p-4 text-left"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {/* Score badge */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${riskLevelColor(assessment.riskLevel)}`}>
          <span className="text-sm font-bold text-white">{assessment.compositeScore}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-peec-dark">{assessment.explanation.summary}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className={`text-2xs font-medium capitalize ${riskLevelTextColor(assessment.riskLevel)}`}>
              {assessment.riskLevel} risk
            </span>
            <span className="text-2xs text-peec-text-muted">
              {Math.round(assessment.confidence * 100)}% confidence
            </span>
          </div>
        </div>

        {expanded
          ? <ChevronUp className="h-4 w-4 shrink-0 text-peec-text-muted" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-peec-text-muted" />
        }
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-peec-border-light/50 px-4 pb-4 pt-3">
              {/* Category scores */}
              <div className="space-y-2">
                {(["visit_frequency", "payment", "engagement", "lifecycle"] as const).map((cat) => {
                  const score = assessment.categoryScores[cat];
                  const signals = assessment.signals.filter((s) => s.category === cat);

                  return (
                    <div key={cat}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-2xs font-medium text-peec-text-secondary">
                          {categoryLabels[cat]}
                        </span>
                        <span className="text-2xs font-semibold text-peec-dark">{score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-stone-100">
                        <motion.div
                          className={`h-full rounded-full ${
                            score >= 60 ? "bg-red-400" : score >= 35 ? "bg-amber-400" : "bg-green-400"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                        />
                      </div>
                      {/* Individual signals */}
                      <div className="mt-1 space-y-0.5">
                        {signals.map((signal) => (
                          <div key={signal.id} className="flex items-center justify-between px-1">
                            <span className="text-2xs text-peec-text-muted">{signal.label}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-2xs ${
                                signal.trend === "improving"
                                  ? "text-green-500"
                                  : signal.trend === "declining"
                                    ? "text-red-500"
                                    : "text-peec-text-muted"
                              }`}>
                                {signal.trend === "improving" ? "+" : signal.trend === "declining" ? "-" : "="}
                              </span>
                              <span className="text-2xs font-medium text-peec-text-secondary">{signal.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation factors */}
              {assessment.explanation.factors.length > 0 && (
                <div>
                  <p className="mb-1 text-2xs font-medium text-peec-text-secondary">Impact Breakdown</p>
                  {assessment.explanation.factors
                    .filter((f) => f.impact > 5)
                    .slice(0, 5)
                    .map((factor) => (
                      <div key={factor.signal} className="flex items-center justify-between py-0.5">
                        <span className="text-2xs text-peec-text-muted">{factor.description}</span>
                        <span className="text-2xs font-medium text-peec-dark">{factor.impact}%</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
