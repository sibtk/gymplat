"use client";

import { Brain, CreditCard, KeyRound } from "lucide-react";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

import type { LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Brain,
    title: "AI Churn Prediction",
    description:
      "ML models analyze check-in patterns, payment history, and engagement signals to flag at-risk members — weeks before they cancel.",
  },
  {
    icon: CreditCard,
    title: "Stripe Payments",
    description:
      "Automated billing, dunning, and revenue tracking through Stripe. PCI compliant out of the box — no card data touches your servers.",
  },
  {
    icon: KeyRound,
    title: "24/7 Access Control",
    description:
      "Integrate with Kisi, Brivo, QR codes, and key fobs. Access is automatically suspended when payments fail.",
  },
];

export function Features() {
  return (
    <SectionContainer id="features">
      <AnimationWrapper>
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-peec-red">Features</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Everything you need to run a modern gym
          </h2>
          <p className="text-base text-peec-text-secondary">
            Automate the busywork. Let AI surface what matters. Act before members churn.
          </p>
        </div>
      </AnimationWrapper>

      <StaggerContainer className="grid grid-cols-1 gap-6 tablet:grid-cols-3">
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <div className="rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-peec-light">
                <feature.icon className="h-5 w-5 text-peec-dark" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-peec-dark">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-peec-text-secondary">
                {feature.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionContainer>
  );
}
