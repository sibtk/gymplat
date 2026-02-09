"use client";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const metrics = [
  {
    title: "AI-Powered Retention",
    description:
      "Our ML model analyzes check-in patterns, payment history, and engagement signals to predict which members are at risk of churning — weeks before they cancel.",
    stat: "92%",
    statLabel: "avg retention rate",
  },
  {
    title: "Revenue Intelligence",
    description:
      "Understand your gym's revenue trajectory across subscriptions, one-time payments, and merchandise. AI surfaces upsell opportunities you'd otherwise miss.",
    stat: "+23%",
    statLabel: "revenue growth",
  },
  {
    title: "Engagement Scoring",
    description:
      "Every member gets a real-time engagement score based on visit frequency, class attendance, and interaction patterns — so you know exactly who needs attention.",
    stat: "847",
    statLabel: "active members tracked",
  },
];

export function MetricsSection() {
  return (
    <SectionContainer>
      <AnimationWrapper>
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-peec-red">AI-Driven Analytics</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Understand how your gym performs — before problems emerge
          </h2>
          <p className="text-base text-peec-text-secondary">
            Machine learning models trained on thousands of gym data points surface the metrics that actually matter for retention and growth.
          </p>
        </div>
      </AnimationWrapper>

      <StaggerContainer className="grid grid-cols-1 gap-grid-gap tablet:grid-cols-3">
        {metrics.map((metric) => (
          <StaggerItem key={metric.title}>
            <div className="group rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-peec-dark">{metric.title}</h3>
                <div className="text-right">
                  <p className="text-2xl font-bold text-peec-red">{metric.stat}</p>
                  <p className="text-xs text-peec-text-tertiary">{metric.statLabel}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-peec-text-secondary">{metric.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionContainer>
  );
}
