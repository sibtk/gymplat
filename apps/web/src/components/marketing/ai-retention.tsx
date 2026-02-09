"use client";

import { BarChart3, Brain, Mail, Target, TrendingDown, UserCheck } from "lucide-react";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const pipeline = [
  {
    icon: BarChart3,
    title: "Data Collection",
    description: "Check-in frequency, payment history, class attendance, app usage, and engagement patterns feed into the model continuously.",
  },
  {
    icon: Brain,
    title: "ML Risk Scoring",
    description: "Our model scores every member from 0-100 based on churn probability. Scores update daily as new behavioral data arrives.",
  },
  {
    icon: TrendingDown,
    title: "At-Risk Detection",
    description: "Members crossing the risk threshold are flagged automatically. You see them before they've even thought about cancelling.",
  },
  {
    icon: UserCheck,
    title: "Automated Intervention",
    description: "Trigger personalized win-back emails, staff follow-up tasks, or special offers — automatically based on risk level.",
  },
  {
    icon: Mail,
    title: "Campaign A/B Testing",
    description: "Test different retention messages against each other. The system learns which campaigns work best for each member segment.",
  },
  {
    icon: Target,
    title: "Outcome Tracking",
    description: "See exactly which interventions prevented cancellations. Track the ROI of every retention campaign in real time.",
  },
];

const stats = [
  { value: "35%", label: "reduction in churn" },
  { value: "2.4x", label: "faster intervention" },
  { value: "89%", label: "prediction accuracy" },
  { value: "$18K", label: "avg monthly revenue saved" },
];

export function AiRetention() {
  return (
    <SectionContainer id="ai-retention" className="bg-white">
      <AnimationWrapper>
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-peec-red/20 bg-peec-red/5 px-4 py-1.5">
            <Brain className="h-4 w-4 text-peec-red" />
            <span className="text-sm font-medium text-peec-red">AI-Powered Retention Engine</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Predict churn before it happens
          </h2>
          <p className="mx-auto max-w-2xl text-base text-peec-text-secondary">
            Our machine learning pipeline analyzes thousands of behavioral signals to identify at-risk members and automatically trigger the right intervention at the right time.
          </p>
        </div>
      </AnimationWrapper>

      {/* Stats bar */}
      <AnimationWrapper delay={0.1}>
        <div className="mb-12 grid grid-cols-2 gap-4 tablet:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-peec-border-light bg-peec-light/50 p-4 text-center">
              <p className="text-2xl font-bold text-peec-red">{stat.value}</p>
              <p className="text-xs text-peec-text-tertiary">{stat.label}</p>
            </div>
          ))}
        </div>
      </AnimationWrapper>

      {/* Pipeline grid */}
      <StaggerContainer className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3" staggerDelay={0.08}>
        {pipeline.map((step, i) => (
          <StaggerItem key={step.title}>
            <div className="group rounded-xl border border-peec-border-light bg-peec-light/30 p-6 transition-all hover:border-peec-red/20 hover:bg-white hover:shadow-card">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-peec-red/10 transition-colors group-hover:bg-peec-red/20">
                  <step.icon className="h-4 w-4 text-peec-red" />
                </div>
                <span className="text-xs font-medium text-peec-text-tertiary">Step {i + 1}</span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-peec-dark">{step.title}</h3>
              <p className="text-sm leading-relaxed text-peec-text-secondary">{step.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Bottom callout */}
      <AnimationWrapper delay={0.2}>
        <div className="mt-12 rounded-xl border border-peec-red/20 bg-peec-red/5 p-6 text-center tablet:p-8">
          <p className="text-lg font-medium text-peec-dark">
            &ldquo;Gyms using our AI retention engine see an average of{" "}
            <span className="text-peec-red font-bold">35% reduction in monthly churn</span>{" "}
            within the first 90 days.&rdquo;
          </p>
          <p className="mt-2 text-sm text-peec-text-tertiary">
            Based on data from 500+ gyms on the GymPlatform network
          </p>
        </div>
      </AnimationWrapper>
    </SectionContainer>
  );
}
