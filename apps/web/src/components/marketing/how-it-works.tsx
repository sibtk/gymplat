"use client";

import { motion } from "framer-motion";
import { KeyRound, Rocket, Upload } from "lucide-react";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const steps = [
  {
    icon: KeyRound,
    number: "1",
    title: "Sign Up & Connect",
    description:
      "Create your account and connect your Stripe account. We handle PCI compliance so you never touch card data.",
  },
  {
    icon: Upload,
    number: "2",
    title: "Import & Configure",
    description:
      "Import your member list, set up plans, and configure your access control hardware. Our team helps with migration.",
  },
  {
    icon: Rocket,
    number: "3",
    title: "Launch & Grow",
    description:
      "Go live with AI-powered retention monitoring from day one. The copilot starts flagging at-risk members within the first week.",
  },
];

export function HowItWorks() {
  return (
    <SectionContainer>
      <AnimationWrapper>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium text-peec-red">Getting Started</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Up and running in under 24 hours
          </h2>
          <p className="text-base text-peec-text-secondary">
            No complex setup. No IT team required. We handle the heavy lifting so you can focus on your members.
          </p>
        </div>
      </AnimationWrapper>

      <StaggerContainer className="relative mx-auto grid max-w-4xl grid-cols-1 gap-8 tablet:grid-cols-3 tablet:gap-6">
        {/* Connecting line (visible on tablet+) */}
        <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden tablet:block">
          <div className="mx-auto h-[2px] w-[60%] border-t-2 border-dashed border-peec-border-light" />
        </div>

        {steps.map((step) => (
          <StaggerItem key={step.number}>
            <motion.div
              className="relative flex flex-col items-center rounded-xl border border-peec-border-light bg-white p-8 text-center shadow-card"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {/* Number circle */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-peec-dark text-lg font-bold text-white">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-peec-light">
                <step.icon className="h-5 w-5 text-peec-dark" />
              </div>

              <h3 className="mb-2 text-base font-semibold text-peec-dark">{step.title}</h3>
              <p className="text-sm leading-relaxed text-peec-text-secondary">{step.description}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionContainer>
  );
}
