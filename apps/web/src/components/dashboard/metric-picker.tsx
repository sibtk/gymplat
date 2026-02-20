"use client";

import { availableMetrics } from "@/lib/report-engine";

import type { MetricId } from "@/lib/report-engine";

interface MetricPickerProps {
  selected: MetricId[];
  onChange: (metrics: MetricId[]) => void;
}

const categories = [
  { id: "member", label: "Members" },
  { id: "revenue", label: "Revenue" },
  { id: "engagement", label: "Engagement" },
  { id: "retention", label: "Retention" },
] as const;

export function MetricPicker({ selected, onChange }: MetricPickerProps) {
  const toggle = (id: MetricId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((m) => m !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const metrics = availableMetrics.filter((m) => m.category === cat.id);
        return (
          <div key={cat.id}>
            <p className="mb-2 text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
              {cat.label}
            </p>
            <div className="space-y-1">
              {metrics.map((metric) => (
                <label key={metric.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={selected.includes(metric.id)}
                    onChange={() => toggle(metric.id)}
                    className="h-3.5 w-3.5 rounded border-peec-border-light"
                  />
                  <span className="text-xs text-peec-dark">{metric.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
