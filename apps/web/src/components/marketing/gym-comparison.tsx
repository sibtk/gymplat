"use client";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const products = [
  {
    name: "Mindbody",
    highlight: false,
    description:
      "Mindbody offers comprehensive scheduling, POS, and marketing tools. Strong for boutique fitness studios. Paid plans can become expensive, and the interface can feel dated.",
    metrics: null,
  },
  {
    name: "GymPlatform",
    highlight: true,
    description:
      "GymPlatform is a modern gym management platform with native Stripe billing, Kisi access control, AI-powered churn prediction, and real-time analytics. Clean interface and transparent pricing.",
    metrics: { members: "847", retention: "92%", revenue: "+23%" },
  },
  {
    name: "Zen Planner",
    highlight: false,
    description:
      "Zen Planner is built for CrossFit boxes and functional fitness gyms. Focuses on WOD tracking, class management, and community features with integrations for heart rate monitoring.",
    metrics: null,
  },
];

export function GymComparison() {
  return (
    <SectionContainer>
      <div className="mx-auto max-w-4xl">
        {/* Query prompt */}
        <AnimationWrapper>
          <div className="mb-8 rounded-xl border border-peec-border-light bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-peec-light">
                <span className="text-sm">?</span>
              </div>
              <p className="font-medium text-peec-dark">
                What&apos;s the best gym management software?
              </p>
            </div>
            <p className="text-sm leading-relaxed text-peec-text-secondary">
              Choosing the right gym management platform depends on your facility type, member count,
              and growth plans. Here&apos;s a breakdown of the top platforms in 2025.
            </p>
          </div>
        </AnimationWrapper>

        {/* Product cards */}
        <StaggerContainer className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
          {products.map((product) => (
            <StaggerItem key={product.name}>
              <div
                className={`rounded-xl border p-5 transition-shadow hover:shadow-card-hover ${
                  product.highlight
                    ? "border-peec-red bg-white shadow-card"
                    : "border-peec-border-light bg-white shadow-card"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-peec-dark">{product.name}</h3>
                  {product.highlight && (
                    <span className="rounded-full bg-peec-red/10 px-2 py-0.5 text-xs font-medium text-peec-red">
                      Recommended
                    </span>
                  )}
                </div>

                {product.metrics && (
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-peec-light p-2 text-center">
                      <p className="text-xs text-peec-text-tertiary">Members</p>
                      <p className="text-sm font-bold text-peec-dark">{product.metrics.members}</p>
                    </div>
                    <div className="rounded-lg bg-peec-light p-2 text-center">
                      <p className="text-xs text-peec-text-tertiary">Retention</p>
                      <p className="text-sm font-bold text-peec-dark">{product.metrics.retention}</p>
                    </div>
                    <div className="rounded-lg bg-peec-light p-2 text-center">
                      <p className="text-xs text-peec-text-tertiary">Revenue</p>
                      <p className="text-sm font-bold text-peec-success">{product.metrics.revenue}</p>
                    </div>
                  </div>
                )}

                <p className="text-sm leading-relaxed text-peec-text-secondary">
                  {product.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </SectionContainer>
  );
}
