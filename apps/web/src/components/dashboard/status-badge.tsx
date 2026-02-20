"use client";

import { PulseDot } from "@/components/dashboard/motion";

interface StatusBadgeProps {
  status: "active" | "at-risk" | "churned" | "critical" | "paused";
}

const styles: Record<StatusBadgeProps["status"], string> = {
  active: "bg-green-50 text-green-700",
  "at-risk": "bg-amber-50 text-amber-700",
  critical: "bg-red-50 text-red-700",
  churned: "bg-stone-100 text-stone-600",
  paused: "bg-blue-50 text-blue-700",
};

const labels: Record<StatusBadgeProps["status"], string> = {
  active: "Active",
  "at-risk": "At Risk",
  critical: "Critical",
  churned: "Churned",
  paused: "Paused",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium ${styles[status]}`}
    >
      {status === "active" ? (
        <span className="mr-1.5">
          <PulseDot />
        </span>
      ) : (
        <span
          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
            status === "at-risk"
              ? "bg-amber-500"
              : status === "critical"
                ? "bg-red-500"
                : status === "paused"
                  ? "bg-blue-500"
                  : "bg-stone-400"
          }`}
        />
      )}
      {labels[status]}
    </span>
  );
}
