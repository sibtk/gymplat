"use client";

import { Star } from "lucide-react";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Owner, Iron Temple Fitness",
    quote:
      "GymPlatform shows exactly how your gym is performing in real time with AI-driven insights we never had before.",
    initials: "SC",
    color: "bg-blue-100 text-blue-700",
    featured: true,
  },
  {
    name: "Lisa Park",
    role: "GM, Peak Performance",
    quote:
      "We pinpointed which classes drive retention and saw a 3x increase in bookings within the first quarter.",
    initials: "LP",
    color: "bg-green-100 text-green-700",
    featured: false,
  },
  {
    name: "Amy Foster",
    role: "Founder, FlexZone Fitness",
    quote:
      "Our member retention jumped from 76% to 92% within 3 months. The AI insights are a game changer.",
    initials: "AF",
    color: "bg-amber-100 text-amber-700",
    featured: false,
  },
];

function StarRating() {
  return (
    <div className="mb-3 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  );
}

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
            <div
              className={`rounded-xl border-l-2 border-peec-dark bg-white p-6 shadow-card ${
                t.featured
                  ? "border border-l-2 border-peec-border-light border-l-peec-dark tablet:-mt-2 tablet:mb-2"
                  : "border border-l-2 border-peec-border-light border-l-peec-dark"
              }`}
            >
              {/* Pull-quote decorative mark */}
              <span className="mb-2 block text-4xl font-bold leading-none text-peec-border-light">
                &ldquo;
              </span>

              <StarRating />

              <blockquote className="mb-5 text-sm leading-relaxed text-peec-text-secondary">
                {t.quote}
              </blockquote>

              <div className="flex items-center gap-3">
                {/* Avatar circle with initials */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${t.color}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-peec-dark">{t.name}</p>
                  <p className="text-xs text-peec-text-tertiary">{t.role}</p>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionContainer>
  );
}
