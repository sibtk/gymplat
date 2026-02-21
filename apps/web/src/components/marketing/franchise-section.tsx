"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Calculator,
  FileCheck,
  GitBranch,
  Globe,
  TrendingUp,
} from "lucide-react";

import { AnimationWrapper, BlurFadeIn, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const benefits = [
  {
    icon: Calculator,
    title: "Automated Franchise Billing",
    description:
      "No more cutting checks or chasing invoices. Revenue splits, royalty fees, and payouts happen automatically through Stripe.",
  },
  {
    icon: FileCheck,
    title: "Consolidated Reporting",
    description:
      "One dashboard shows every location\u2019s revenue, retention, and member counts. No manual spreadsheets.",
  },
  {
    icon: GitBranch,
    title: "Per-Location AI",
    description:
      "Each location gets its own Health Score and churn predictions, with roll-up views for the franchise owner.",
  },
  {
    icon: Globe,
    title: "Centralized Management",
    description:
      "Set brand standards, pricing templates, and communication campaigns across all locations from one place.",
  },
  {
    icon: Building2,
    title: "Location Onboarding",
    description:
      "Spin up new locations in minutes. Clone plans, settings, and integrations from your existing sites.",
  },
  {
    icon: TrendingUp,
    title: "Performance Benchmarking",
    description:
      "Compare locations side-by-side. See which franchisees are outperforming and replicate what works.",
  },
];

function FranchiseVisual() {
  const locations = [
    { name: "Downtown", members: 312, revenue: "$18.4K", health: 91, color: "bg-green-400" },
    { name: "Westside", members: 245, revenue: "$14.2K", health: 84, color: "bg-green-400" },
    { name: "North Park", members: 198, revenue: "$11.8K", health: 78, color: "bg-amber-400" },
    { name: "Eastgate", members: 167, revenue: "$9.6K", health: 72, color: "bg-amber-400" },
  ];

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-peec-dark">Franchise Overview</p>
          <p className="text-[10px] text-peec-text-muted">4 locations &middot; 922 total members</p>
        </div>
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
          All synced
        </span>
      </div>

      <div className="space-y-2">
        {locations.map((loc) => (
          <div
            key={loc.name}
            className="flex items-center gap-3 rounded-lg bg-stone-50/80 px-3 py-2.5"
          >
            <div className={`h-2 w-2 rounded-full ${loc.color}`} />
            <div className="flex-1">
              <p className="text-xs font-medium text-peec-dark">{loc.name}</p>
            </div>
            <span className="text-[10px] text-peec-text-muted">{loc.members} members</span>
            <span className="text-[10px] font-medium text-peec-dark">{loc.revenue}</span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-8 overflow-hidden rounded-full bg-stone-200">
                <div
                  className={`h-full rounded-full ${loc.health >= 80 ? "bg-green-400" : "bg-amber-400"}`}
                  style={{ width: `${loc.health}%` }}
                />
              </div>
              <span className="text-[9px] text-peec-text-muted">{loc.health}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom aggregate */}
      <div className="mt-3 flex items-center justify-between border-t border-peec-border-light pt-3">
        <span className="text-[10px] font-medium text-peec-dark">Total Revenue</span>
        <span className="text-sm font-bold text-peec-dark">$54,000/mo</span>
      </div>
    </div>
  );
}

export function FranchiseSection() {
  return (
    <SectionContainer>
      {/* Split: text left, visual right */}
      <div className="mb-14 flex flex-col items-center gap-12 tablet:flex-row tablet:gap-16">
        <BlurFadeIn className="flex-1">
          <p className="mb-2 text-sm font-medium text-peec-red">Multi-Location &amp; Franchise</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Scale without the spreadsheets
          </h2>
          <p className="mb-6 text-base leading-relaxed text-peec-text-secondary">
            Running a franchise shouldn&apos;t mean manual accounting, cutting checks, and chasing
            down location reports. Ledger automates everything — revenue splits, royalty billing,
            consolidated reporting — so you can focus on growing, not bookkeeping.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Automated payouts", "Revenue splits", "Royalty tracking", "Multi-location AI"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-peec-border-light bg-peec-light px-3 py-1 text-xs font-medium text-peec-dark"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </BlurFadeIn>

        <BlurFadeIn delay={0.2} className="w-full max-w-md shrink-0">
          <FranchiseVisual />
        </BlurFadeIn>
      </div>

      {/* Benefits grid */}
      <AnimationWrapper>
        <h3 className="mb-8 text-center text-lg font-semibold text-peec-dark">
          Built for franchise operators
        </h3>
      </AnimationWrapper>

      <StaggerContainer className="mx-auto grid max-w-4xl grid-cols-1 gap-4 tablet:grid-cols-3">
        {benefits.map((b) => (
          <StaggerItem key={b.title}>
            <motion.div
              className="rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-peec-light">
                <b.icon className="h-4 w-4 text-peec-dark" />
              </div>
              <h4 className="mb-1.5 text-sm font-semibold text-peec-dark">{b.title}</h4>
              <p className="text-sm leading-relaxed text-peec-text-secondary">{b.description}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionContainer>
  );
}
