"use client";

import { Button } from "@gym/ui";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

import { ScrollFadeIn } from "./animation-wrapper";
import { GlassCard } from "./glass-card";

const tiers = [
  {
    name: "Growth",
    monthly: 499,
    description: "For single-location gyms ready to grow.",
    features: [
      "Up to 500 members",
      "1 location",
      "AI churn prediction",
      "Stripe payments + dunning",
      "Class scheduling",
      "Member portal",
      "Email + chat support",
    ],
    primary: false,
  },
  {
    name: "Pro",
    monthly: 1499,
    description: "Full platform with AI retention engine.",
    features: [
      "Up to 2,000 members",
      "Up to 5 locations",
      "Full AI retention + Copilot",
      "Custom mobile app (iOS + Android)",
      "Custom website with booking",
      "Advanced reports + analytics",
      "Stripe payments + automated dunning",
      "Priority support + onboarding",
    ],
    primary: true,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-6 py-section"
    >
      {/* Dot grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0" />

      {/* Floating gradient orb */}
      <motion.div
        className="pointer-events-none absolute -right-48 top-1/3 h-[500px] w-[500px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative mx-auto max-w-peec">
      <ScrollFadeIn>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-peec-text-muted">
            Pricing
          </p>
          <h2 className="mb-4 text-3xl font-medium tracking-tight text-peec-dark tablet:text-4xl">
            Simple pricing that scales with you
          </h2>
          <p className="text-base text-peec-text-secondary">
            No hidden fees. No long-term contracts. Cancel anytime.
          </p>
        </div>
      </ScrollFadeIn>

      {/* Monthly / Annual toggle */}
      <ScrollFadeIn>
        <div className="mb-12 flex flex-col items-center gap-2">
          <span className={`rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 transition-opacity duration-200 ${
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
                annual ? "bg-white/20" : "bg-white/10"
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
      </ScrollFadeIn>

      {/* Pricing columns */}
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-12 tablet:grid-cols-2">
        {tiers.map((tier) => (
          <ScrollFadeIn key={tier.name}>
            {tier.primary ? (
              <GlassCard accent="multi" elevated className="h-full">
                <div className="flex h-full flex-col p-2">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-peec-dark">{tier.name}</h3>
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-2xs font-medium text-emerald-400">
                      Most popular
                    </span>
                  </div>
                  <p className="mb-5 text-sm text-peec-text-secondary">{tier.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-medium text-peec-dark">
                        ${annual ? Math.round(tier.monthly * 0.8) : tier.monthly}
                      </span>
                      <span className="text-sm text-peec-text-muted">/mo</span>
                      {annual && (
                        <span className="ml-2 text-sm text-peec-text-muted line-through">
                          ${tier.monthly}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="pill"
                    className="mb-8 w-full"
                  >
                    Start free trial
                  </Button>

                  <div className="space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span className="text-sm text-peec-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ) : (
              <div className="flex h-full flex-col">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-peec-dark">{tier.name}</h3>
                </div>
                <p className="mb-5 text-sm text-peec-text-secondary">{tier.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-medium text-peec-dark">
                      ${annual ? Math.round(tier.monthly * 0.8) : tier.monthly}
                    </span>
                    <span className="text-sm text-peec-text-muted">/mo</span>
                    {annual && (
                      <span className="ml-2 text-sm text-peec-text-muted line-through">
                        ${tier.monthly}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="secondary-outline"
                  size="pill"
                  className="mb-8 w-full"
                >
                  Start free trial
                </Button>

                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span className="text-sm text-peec-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollFadeIn>
        ))}
      </div>

      {/* Enterprise line */}
      <ScrollFadeIn>
        <p className="mt-16 text-center text-sm text-peec-text-secondary">
          Need more?{" "}
          <a href="#" className="font-medium text-peec-dark underline underline-offset-4 hover:text-white">
            Contact us for enterprise pricing
          </a>
          .
        </p>
      </ScrollFadeIn>
      </div>
    </section>
  );
}
