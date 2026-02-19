"use client";

import { Button } from "@gym/ui";
import { Brain, Shield, TrendingUp } from "lucide-react";

import { BlurFadeIn, FadeIn } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

export function Hero() {
  return (
    <SectionContainer className="relative overflow-hidden pb-12 pt-16 tablet:pb-20 tablet:pt-24">
      {/* Dot grid pattern background */}
      <div className="dot-texture pointer-events-none absolute inset-0 opacity-30" />

      {/* Radial gradient glow behind hero text */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,162,158,0.2)_0%,rgba(168,162,158,0.05)_50%,transparent_70%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <FadeIn>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-peec-border-light bg-white px-4 py-1.5 shadow-[0_0_12px_rgba(23,23,23,0.06),0_4px_4px_rgba(23,23,23,0.04)]">
            <Brain className="h-4 w-4 text-peec-dark" />
            <span className="text-sm text-peec-text-secondary">
              AI-powered retention engine built in
            </span>
          </div>
        </FadeIn>

        <BlurFadeIn delay={0.1}>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-peec-dark tablet:text-6xl desktop:text-7xl">
            Gym management platform for{" "}
            <span className="text-peec-text-tertiary">modern fitness</span> businesses
          </h1>
        </BlurFadeIn>

        <BlurFadeIn delay={0.2}>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-peec-text-secondary">
            Track, manage, and grow your gym with{" "}
            <span className="font-medium text-peec-dark">AI-driven member retention</span>,{" "}
            <span className="font-medium text-peec-dark">Stripe payment processing</span>, and{" "}
            <span className="font-medium text-peec-dark">24/7 access control</span> — all in one platform.
          </p>
        </BlurFadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center justify-center gap-3 tablet:flex-row">
            <Button variant="outlinePill" size="pill">
              Talk to Sales
            </Button>
            <Button variant="cta" size="pill">
              Start Free Trial
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-6 text-sm text-peec-text-tertiary">
            <span className="flex items-center gap-1.5">
              <Brain className="h-4 w-4" />
              Churn prediction
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              Revenue analytics
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              PCI compliant
            </span>
          </div>
        </FadeIn>
      </div>
    </SectionContainer>
  );
}
