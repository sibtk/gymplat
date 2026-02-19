"use client";

import { Button } from "@gym/ui";

import { AnimationWrapper } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

export function CtaSection() {
  return (
    <SectionContainer className="bg-white">
      <AnimationWrapper>
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-peec-border-light bg-peec-light p-10 text-center tablet:p-14">
          {/* Dot texture background */}
          <div className="dot-texture pointer-events-none absolute inset-0 opacity-20" />

          {/* Radial glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,162,158,0.15)_0%,transparent_70%)]" />

          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-5xl">
              Find out how to grow your gym
            </h2>
            <p className="mb-8 text-base text-peec-text-secondary">
              Join 500+ gyms using AI-powered retention to reduce churn and grow revenue.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 tablet:flex-row">
              <Button variant="cta" size="pill">
                Start free trial
              </Button>
              <Button
                variant="outlinePill"
                size="pill"
                className="border-peec-border-light text-peec-dark hover:bg-white"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </SectionContainer>
  );
}
