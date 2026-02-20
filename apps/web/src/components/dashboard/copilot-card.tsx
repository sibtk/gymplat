"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import { useGymStore } from "@/lib/store";

import type { CopilotInsight } from "@/lib/retention/types";

const iconMap = {
  risk_alert: AlertTriangle,
  opportunity: Sparkles,
  trend: BarChart3,
  action_needed: Bell,
  milestone: Trophy,
} as const;

const colorMap = {
  risk_alert: "text-red-500",
  opportunity: "text-purple-500",
  trend: "text-blue-500",
  action_needed: "text-amber-500",
  milestone: "text-green-500",
} as const;

const bgMap = {
  risk_alert: "bg-red-50",
  opportunity: "bg-purple-50",
  trend: "bg-blue-50",
  action_needed: "bg-amber-50",
  milestone: "bg-green-50",
} as const;

interface CopilotCardProps {
  insight: CopilotInsight;
  onAction?: (insight: CopilotInsight) => void;
}

export function CopilotCard({ insight, onAction }: CopilotCardProps) {
  const dismissCopilotInsight = useGymStore((s) => s.dismissCopilotInsight);
  const Icon = iconMap[insight.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl border border-purple-100 bg-gradient-to-r from-white to-purple-50/30 p-3.5"
    >
      <button
        type="button"
        onClick={() => dismissCopilotInsight(insight.id)}
        className="absolute right-2 top-2 rounded-full p-0.5 text-peec-text-muted opacity-0 transition-opacity hover:bg-stone-100 group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>

      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bgMap[insight.type]}`}>
          <Icon className={`h-4 w-4 ${colorMap[insight.type]}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-peec-dark">{insight.title}</p>
          <p className="mt-0.5 text-2xs text-peec-text-muted leading-relaxed">
            {insight.description}
          </p>

          {insight.actionLabel && (
            <button
              type="button"
              onClick={() => onAction?.(insight)}
              className="mt-2 rounded-lg bg-peec-dark px-3 py-1 text-2xs font-medium text-white transition-colors hover:bg-stone-700"
            >
              {insight.actionLabel}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
