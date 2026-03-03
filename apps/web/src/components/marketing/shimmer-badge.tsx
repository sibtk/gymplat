import { cn } from "@gym/ui";

import type { ReactNode } from "react";

export function ShimmerBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("shimmer-badge", className)}>
      <span className="relative z-10 bg-[#0a0a0a] px-3 py-1 text-xs font-medium text-peec-dark" style={{ borderRadius: "9999px" }}>
        {children}
      </span>
    </span>
  );
}
