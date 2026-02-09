"use client";

import { ArrowRight } from "lucide-react";

import { AnimationWrapper } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

export function HiringCta() {
  return (
    <SectionContainer id="about">
      <div className="grid grid-cols-1 gap-12 tablet:grid-cols-2">
        <AnimationWrapper>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-peec-red">
              Our mission
            </p>
            <p className="mb-6 text-2xl font-bold leading-snug text-peec-dark tablet:text-3xl">
              We&apos;ve onboarded 500+ gyms and processed $12M in member payments through our
              platform.
            </p>
            <p className="text-base leading-relaxed text-peec-text-secondary">
              Legacy gym software is being replaced by modern, AI-powered platforms — and we&apos;re
              building the category leader.
            </p>
          </div>
        </AnimationWrapper>

        <AnimationWrapper delay={0.15}>
          <div className="flex flex-col justify-center">
            <a
              href="#"
              className="group mb-4 inline-flex items-center gap-2 text-xl font-semibold text-peec-dark hover:text-peec-red"
            >
              Join our team
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="text-base leading-relaxed text-peec-text-secondary">
              Come build with us — a fast-moving team redefining how gyms operate and grow with machine learning.
            </p>
          </div>
        </AnimationWrapper>
      </div>
    </SectionContainer>
  );
}
