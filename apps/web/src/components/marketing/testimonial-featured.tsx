"use client";

import { Quote } from "lucide-react";

import { AnimationWrapper } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

export function TestimonialFeatured() {
  return (
    <SectionContainer className="bg-white">
      <AnimationWrapper>
        <div className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto mb-6 h-8 w-8 text-peec-red/30" />
          <blockquote className="mb-8 text-xl font-medium leading-relaxed text-peec-dark tablet:text-2xl">
            &ldquo;Metrics like member retention, revenue per square foot, and peak utilization are
            hard to track — which is why GymPlatform is so powerful: it shows exactly how your gym
            is performing in real time with AI-driven insights we never had before.&rdquo;
          </blockquote>
          <div>
            <p className="font-semibold text-peec-dark">Sarah Chen</p>
            <p className="text-sm text-peec-text-tertiary">Owner, Iron Temple Fitness — Austin, TX</p>
          </div>
        </div>
      </AnimationWrapper>
    </SectionContainer>
  );
}
