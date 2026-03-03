"use client";

import { Button } from "@gym/ui";
import { motion } from "framer-motion";

import { FadeIn } from "./animation-wrapper";
import { ShimmerBadge } from "./shimmer-badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20 tablet:pb-20 tablet:pt-28">
      {/* Mesh gradient — colored radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 40% 40% at 30% 10%, rgba(59,130,246,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 40% 40% at 70% 10%, rgba(139,92,246,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(16,185,129,0.02) 0%, transparent 70%)",
          }}
        />

        {/* Floating gradient orbs */}
        <motion.div
          className="absolute -left-40 top-1/4 h-[600px] w-[600px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 80, -30, 0], y: [0, -50, 40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          }}
          animate={{ x: [0, -60, 40, 0], y: [0, 60, -30, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <FadeIn>
          <div className="mb-4 flex justify-center">
            <ShimmerBadge>Now in Early Access</ShimmerBadge>
          </div>
          <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-peec-text-muted">
            The system for gym management
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="mb-6 text-5xl font-medium tracking-tight text-peec-dark tablet:text-7xl desktop:text-8xl">
            Stop losing members.
            <br />
            <span className="text-peec-text-tertiary">Start predicting churn.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="mx-auto mb-8 max-w-xl text-lg text-peec-text-secondary">
            AI-powered gym management that predicts churn before cancellation.
          </p>
        </FadeIn>

        <FadeIn delay={0.24}>
          <Button variant="primary" size="pill">
            Get started free
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
