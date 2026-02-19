"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";

import { BlurFadeIn } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const stats = [
  { value: 2500, suffix: "+", label: "Members Managed", showArrow: true },
  { value: 35, suffix: "%", label: "Less Churn", showArrow: true },
  { value: 92, suffix: "%", label: "Avg Retention", showArrow: false },
  { value: 1.2, suffix: "M+", prefix: "$", label: "Revenue Processed", showArrow: false },
];

function AnimatedNumber({
  value,
  suffix,
  prefix,
}: {
  value: number;
  suffix: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (latest: number) => {
    if (value >= 100) return `${prefix ?? ""}${Math.round(latest).toLocaleString()}${suffix}`;
    if (value >= 10) return `${prefix ?? ""}${Math.round(latest)}${suffix}`;
    return `${prefix ?? ""}${latest.toFixed(1)}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function StatsSection() {
  return (
    <SectionContainer>
      <div className="grid grid-cols-2 gap-6 tablet:grid-cols-4">
        {stats.map((stat, i) => (
          <BlurFadeIn key={stat.label} delay={i * 0.1}>
            <div className="text-center">
              <p className="mb-1 text-4xl font-bold tracking-tight text-peec-dark tablet:text-5xl">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </p>
              <p className="flex items-center justify-center gap-1 text-sm text-peec-text-secondary">
                {stat.showArrow && (
                  <ArrowUp className="h-3 w-3 text-green-500" />
                )}
                {stat.label}
              </p>
            </div>
          </BlurFadeIn>
        ))}
      </div>
    </SectionContainer>
  );
}
