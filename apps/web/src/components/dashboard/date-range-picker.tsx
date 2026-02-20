"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useDashboardStore } from "@/lib/store";

import type { DateRange } from "@/lib/store";

const options: { label: string; value: DateRange }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last year", value: "1y" },
];

export function DateRangePicker() {
  const dateRange = useDashboardStore((s) => s.dateRange);
  const setDateRange = useDashboardStore((s) => s.setDateRange);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === dateRange)?.label ?? "Last 30 days";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg border border-peec-border-light bg-white px-3 py-1.5 text-xs text-peec-text-secondary transition-colors hover:bg-stone-50"
      >
        {selectedLabel}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-peec-border-light bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setDateRange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-2 text-left text-xs transition-colors hover:bg-stone-50 ${
                dateRange === opt.value
                  ? "font-medium text-peec-dark"
                  : "text-peec-text-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
