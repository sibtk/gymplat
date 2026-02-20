"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

// ─── PageEntrance ────────────────────────────────────────────────
// Wraps children in a staggered fade-in container

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.15, staggerChildren: 0.06 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function PageEntrance({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// ─── CardHover ───────────────────────────────────────────────────
// Wraps children with a subtle hover lift effect

export function CardHover({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── AnimatedNumber ──────────────────────────────────────────────
// Spring counter animating from 0 to target value

export function AnimatedNumber({
  value,
  prefix,
  suffix,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(0, { duration: 1000, bounce: 0 });
  const display = useTransform(spring, (latest: number) => {
    const p = prefix ?? "";
    const s = suffix ?? "";
    if (value >= 100) return `${p}${Math.round(latest).toLocaleString()}${s}`;
    if (value >= 10) return `${p}${Math.round(latest)}${s}`;
    return `${p}${latest.toFixed(1)}${s}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

// ─── SlideIn ─────────────────────────────────────────────────────
// Drawer slide animation wrapper

export function SlideIn({
  children,
  direction = "right",
  className,
}: {
  children: ReactNode;
  direction?: "left" | "right";
  className?: string;
}) {
  const xInitial = direction === "right" ? "100%" : "-100%";
  return (
    <motion.div
      initial={{ x: xInitial }}
      animate={{ x: 0 }}
      exit={{ x: xInitial }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── PulseDot ────────────────────────────────────────────────────
// Green pulsing dot for live indicators

export function PulseDot({ className }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-2 w-2 ${className ?? ""}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
    </span>
  );
}

// ─── OrbPulse ────────────────────────────────────────────────────
// Health score orb breathing animation

export function OrbPulse({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ScoreChange ─────────────────────────────────────────────────
// Brief highlight + number spring when a risk score changes

export function ScoreChange({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 1, backgroundColor: "transparent" }}
      animate={{ scale: [1, 1.05, 1], backgroundColor: ["transparent", "rgba(245, 158, 11, 0.1)", "transparent"] }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── InsightSlide ────────────────────────────────────────────────
// Copilot insight cards entering from the side

export function InsightSlide({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── TickerRoll ──────────────────────────────────────────────────
// Revenue ticker number transitions (roll from below)

export function TickerRoll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
