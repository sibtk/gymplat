"use client";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Owner, Iron Temple Fitness",
    quote:
      "GymPlatform shows exactly how your gym is performing in real time with AI-driven insights we never had before.",
  },
  {
    name: "Lisa Park",
    role: "GM, Peak Performance",
    quote:
      "We pinpointed which classes drive retention and saw a 3x increase in bookings within the first quarter.",
  },
  {
    name: "Amy Foster",
    role: "Founder, FlexZone Fitness",
    quote:
      "Our member retention jumped from 76% to 92% within 3 months. The AI insights are a game changer.",
  },
];

export function Testimonials() {
  return (
    <SectionContainer>
      <AnimationWrapper>
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-peec-red">Testimonials</p>
          <h2 className="text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Trusted by gym owners nationwide
          </h2>
        </div>
      </AnimationWrapper>

      <StaggerContainer className="grid grid-cols-1 gap-6 tablet:grid-cols-3">
        {testimonials.map((t) => (
          <StaggerItem key={t.name}>
            <div className="rounded-xl border border-peec-border-light bg-white p-6 shadow-card">
              <blockquote className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-peec-dark">{t.name}</p>
                <p className="text-xs text-peec-text-tertiary">{t.role}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionContainer>
  );
}
