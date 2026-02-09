"use client";

import { Brain } from "lucide-react";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const recommendations = [
  {
    insight: "ML detected 23 at-risk members this week",
    action: "Send win-back campaign",
  },
  {
    insight: "Churn probability spiked for Tuesday check-ins",
    action: "Add a popular class",
  },
  {
    insight: "PT Package has 94% satisfaction score",
    action: "Consider raising the price",
  },
  {
    insight: "Corporate memberships growing 12% MoM",
    action: "Launch corporate landing page",
  },
  {
    insight: "AI predicts evening demand increase",
    action: "Add a second evening slot",
  },
];

const features = [
  {
    title: "Set up Membership Plans",
    description:
      "Plans are the foundation of your gym's revenue. Create and organize the membership tiers that drive your business.",
  },
  {
    title: "AI Churn Prediction",
    description:
      "Our machine learning engine analyzes visit patterns, payment behavior, and engagement signals to flag members likely to cancel — so you can intervene early.",
  },
  {
    title: "Multi-Location Intelligence",
    description:
      "See how each location performs against the others. AI benchmarks your metrics across your portfolio and highlights underperformers.",
  },
  {
    title: "Smart Access Control",
    description:
      "Configure door access across Kisi, Brivo, QR codes, and key fobs. Access is automatically suspended when payments fail.",
  },
  {
    title: "Revenue Optimization",
    description:
      "AI identifies upsell patterns, underperforming plans, and pricing opportunities based on member behavior and market data.",
  },
];

export function BentoFeatures() {
  return (
    <SectionContainer id="features">
      <AnimationWrapper>
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-peec-red">Key features</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Turn gym operations into growth with AI-powered insights
          </h2>
          <p className="text-base text-peec-text-secondary">
            Automate the busywork, let machine learning surface what matters, and act before members churn.
          </p>
        </div>
      </AnimationWrapper>

      <StaggerContainer className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <div className="rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
              <h3 className="mb-2 text-base font-semibold text-peec-dark">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-peec-text-secondary">
                {feature.description}
              </p>
            </div>
          </StaggerItem>
        ))}

        {/* Act on AI Insights — special card with recommendations */}
        <StaggerItem>
          <div className="rounded-xl border border-peec-red/20 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-peec-red" />
              <h3 className="text-base font-semibold text-peec-dark">Act on AI Insights</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
              Machine learning generates actionable recommendations every week to boost retention and revenue.
            </p>
            <div className="space-y-2">
              {recommendations.map((rec) => (
                <div
                  key={rec.insight}
                  className="flex items-start justify-between gap-2 rounded-lg bg-peec-light p-3"
                >
                  <p className="text-xs text-peec-text-secondary">{rec.insight}</p>
                  <span className="shrink-0 rounded-full bg-peec-red px-2 py-0.5 text-xs text-white">
                    {rec.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </SectionContainer>
  );
}
