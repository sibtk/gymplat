import type { ReactNode } from "react";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded bg-stone-200 ${className ?? ""}`}
    />
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <Shimmer className={`h-3 w-full ${className ?? ""}`} />;
}

export function SkeletonCard({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      {children ?? (
        <div className="space-y-3">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-32" />
          <Shimmer className="h-3 w-20" />
        </div>
      )}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-peec-border-light bg-white">
      {/* Header */}
      <div className="flex gap-4 border-b border-peec-border-light bg-stone-50/50 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className="h-3 w-20" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 border-b border-peec-border-light/50 px-4 py-3 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer key={c} className="h-3 w-20" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <div className="mb-4 space-y-2">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-3 w-48" />
      </div>
      <Shimmer className="h-48 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-4">
      <Shimmer className="mb-2 h-3 w-20" />
      <Shimmer className="h-7 w-28" />
    </div>
  );
}
