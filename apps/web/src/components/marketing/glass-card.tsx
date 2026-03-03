"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { type MouseEvent, useCallback } from "react";

export type AccentColor = "rose" | "blue" | "amber" | "emerald" | "violet" | "cyan" | "multi";

interface GlassCardProps {
  accent?: AccentColor;
  elevated?: boolean;
  className?: string;
  children: React.ReactNode;
}

const accentHighlightColors: Record<AccentColor, string> = {
  rose: "rgba(244,63,94,0.06)",
  blue: "rgba(59,130,246,0.06)",
  amber: "rgba(245,158,11,0.06)",
  emerald: "rgba(16,185,129,0.06)",
  violet: "rgba(139,92,246,0.06)",
  cyan: "rgba(6,182,212,0.06)",
  multi: "rgba(255,255,255,0.04)",
};

export function GlassCard({ accent, elevated = false, className, children }: GlassCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const highlightColor = accent ? accentHighlightColors[accent] : "rgba(255,255,255,0.04)";
  const mouseGradient = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, ${highlightColor}, transparent 40%)`;

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const cardClass = elevated ? "glass-card-elevated" : "glass-card";

  return (
    <div className={className}>
      <div className="group relative h-full">
        {/* Card */}
        <div
          className={`${cardClass} relative h-full overflow-hidden rounded-2xl border border-white/[0.08]`}
          data-accent={accent}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Mouse-tracking highlight */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[2] rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: mouseGradient }}
          />

          {/* Content */}
          <div className="relative z-10 h-full p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
