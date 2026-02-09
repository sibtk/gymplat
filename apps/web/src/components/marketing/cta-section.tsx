"use client";

import { Button } from "@gym/ui";

import { AnimationWrapper } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

export function CtaSection() {
  return (
    <SectionContainer className="bg-white">
      <AnimationWrapper>
        <div className="mx-auto max-w-2xl rounded-2xl border border-peec-border-light bg-peec-light p-10 text-center tablet:p-14">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
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
      </AnimationWrapper>
    </SectionContainer>
  );
}
