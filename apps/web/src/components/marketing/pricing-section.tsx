"use client";

import { Button } from "@gym/ui";
import { Check, Minus } from "lucide-react";
import { useState } from "react";

import { AnimationWrapper, BlurFadeIn } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const tiers = [
  {
    name: "Growth",
    monthly: 499,
    description: "For single-location gyms ready to grow with AI-powered management.",
    features: [
      "Up to 500 members",
      "1 location",
      "AI churn prediction",
      "Stripe payments + dunning",
      "Class scheduling",
      "Custom branded member portal",
      "Email + chat support",
    ],
    excluded: ["Custom mobile app", "Custom website", "AI Copilot"],
    cta: "Start Free Trial",
    ctaVariant: "outlinePill" as const,
    popular: false,
  },
  {
    name: "Pro",
    monthly: 1499,
    description: "Full platform with custom apps, websites, and AI retention engine.",
    features: [
      "Up to 2,000 members",
      "Up to 5 locations",
      "Full AI retention engine + Copilot",
      "Custom branded mobile app (iOS + Android)",
      "Custom-built website with booking",
      "Stripe payments + automated dunning",
      "Advanced reports + analytics",
      "Priority support + onboarding",
    ],
    excluded: ["Custom ML models"],
    cta: "Start Free Trial",
    ctaVariant: "cta" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    description: "White-glove service for franchise networks and premium facilities.",
    features: [
      "Unlimited members + locations",
      "Full AI + custom ML models",
      "Custom mobile app + website design",
      "Automated franchise billing + revenue splits",
      "Owner dashboard per location",
      "Dedicated account manager",
      "Custom integrations + API access",
      "SLA guarantee + 99.9% uptime",
      "On-site onboarding + training",
    ],
    excluded: [],
    cta: "Contact Sales",
    ctaVariant: "outlinePill" as const,
    popular: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <SectionContainer id="pricing">
      <AnimationWrapper>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium text-peec-red">Pricing</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Simple pricing that scales with you
          </h2>
          <p className="text-base text-peec-text-secondary">
            No hidden fees. No long-term contracts. Cancel anytime.
          </p>
        </div>
      </AnimationWrapper>

      {/* Monthly / Annual toggle */}
      <AnimationWrapper>
        <div className="mb-10 flex flex-col items-center gap-2">
          {/* Save badge — always takes space to prevent layout shift */}
          <span className={`rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 transition-opacity duration-200 ${
            annual ? "opacity-100" : "opacity-0"
          }`}>
            Save 20%
          </span>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${!annual ? "text-peec-dark" : "text-peec-text-muted"}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
                annual ? "bg-peec-dark" : "bg-stone-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  annual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-peec-dark" : "text-peec-text-muted"}`}>
              Annual
            </span>
          </div>
        </div>
      </AnimationWrapper>

      {/* Pricing cards */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 tablet:grid-cols-3">
        {tiers.map((tier, i) => (
          <BlurFadeIn key={tier.name} delay={i * 0.1}>
            <div
              className={`relative flex h-full flex-col rounded-xl border bg-white p-8 shadow-card ${
                tier.popular
                  ? "border-2 border-peec-dark tablet:-mt-4 tablet:mb-4"
                  : "border-peec-border-light"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-peec-dark px-4 py-1 text-2xs font-medium text-white">
                  Most Popular
                </span>
              )}

              <h3 className="mb-1 text-lg font-semibold text-peec-dark">{tier.name}</h3>
              <p className="mb-5 text-sm text-peec-text-secondary">{tier.description}</p>

              <div className="mb-6">
                {tier.monthly ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-peec-dark">
                      ${annual ? Math.round(tier.monthly * 0.8) : tier.monthly}
                    </span>
                    <span className="text-sm text-peec-text-muted">/mo</span>
                    {annual && (
                      <span className="ml-2 text-sm text-peec-text-muted line-through">
                        ${tier.monthly}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold text-peec-dark">Custom</span>
                    <p className="mt-1 text-sm text-peec-text-muted">Tailored to your needs</p>
                  </div>
                )}
              </div>

              <Button
                variant={tier.ctaVariant}
                size="pill"
                className="mb-8 w-full"
              >
                {tier.cta}
              </Button>

              <div className="space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-sm text-peec-text-secondary">{feature}</span>
                  </div>
                ))}
                {tier.excluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-stone-300" />
                    <span className="text-sm text-peec-text-muted">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </BlurFadeIn>
        ))}
      </div>
    </SectionContainer>
  );
}
