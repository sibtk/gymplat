"use client";

import { Star } from "lucide-react";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Owner, Iron Temple Fitness",
    quote:
      "Ledger shows exactly how your gym is performing in real time with AI-driven insights we never had before.",
    initials: "SC",
    color: "bg-blue-100 text-blue-700",
    metric: "+16% retention",
    metricColor: "bg-green-50 text-green-700",
  },
  {
    name: "Jason Rivera",
    role: "Head Trainer, Summit Athletics",
    quote:
      "The AI copilot saves me hours every week. It flags at-risk members and drafts the outreach for me — I just hit approve.",
    initials: "JR",
    color: "bg-indigo-100 text-indigo-700",
    metric: "5hrs saved/week",
    metricColor: "bg-blue-50 text-blue-700",
  },
  {
    name: "Amy Foster",
    role: "Founder, FlexZone Fitness",
    quote:
      "Our member retention jumped from 76% to 92% within 3 months. The AI insights are a game changer.",
    initials: "AF",
    color: "bg-amber-100 text-amber-700",
    metric: "76% → 92%",
    metricColor: "bg-green-50 text-green-700",
  },
  {
    name: "Marcus Thompson",
    role: "Operations Director, 24Seven Gyms (12 locations)",
    quote:
      "Managing 12 locations used to mean 12 separate spreadsheets. Now I see everything in one dashboard with automated franchise billing.",
    initials: "MT",
    color: "bg-green-100 text-green-700",
    metric: "$12K saved/mo",
    metricColor: "bg-green-50 text-green-700",
  },
];

function StarRating() {
  return (
    <div className="mb-3 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
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

      <StaggerContainer className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
        {testimonials.map((t) => (
          <StaggerItem key={t.name}>
            <div className="relative rounded-xl border border-l-2 border-peec-border-light border-l-peec-dark bg-white p-6 shadow-card">
              {/* Metric badge */}
              <span
                className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-2xs font-medium ${t.metricColor}`}
              >
                {t.metric}
              </span>

              <span className="mb-2 block text-4xl font-bold leading-none text-peec-border-light">
                &ldquo;
              </span>

              <StarRating />

              <blockquote className="mb-5 text-sm leading-relaxed text-peec-text-secondary">
                {t.quote}
              </blockquote>

              <div className="flex items-center gap-3">
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

      {/* Aggregate proof strip */}
      <AnimationWrapper>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-peec-text-muted tablet:gap-10">
          <span className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-peec-dark">4.9/5</span> average rating
          </span>
          <span className="hidden h-4 w-px bg-peec-border-light tablet:block" />
          <span>
            <span className="font-medium text-peec-dark">500+</span> gyms
          </span>
          <span className="hidden h-4 w-px bg-peec-border-light tablet:block" />
          <span>
            <span className="font-medium text-peec-dark">92%</span> customer retention
          </span>
        </div>
      </AnimationWrapper>
    </SectionContainer>
  );
}
