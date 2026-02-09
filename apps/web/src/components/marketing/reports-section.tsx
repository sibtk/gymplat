"use client";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const locations = [
  { name: "Downtown", x: 75, y: 15, r: 12, category: "top" },
  { name: "Westside", x: 60, y: 25, r: 10, category: "top" },
  { name: "Northpark", x: 45, y: 35, r: 8, category: "growing" },
  { name: "Eastgate", x: 30, y: 45, r: 9, category: "growing" },
  { name: "Southbay", x: 55, y: 40, r: 7, category: "growing" },
  { name: "Midtown", x: 65, y: 20, r: 11, category: "top" },
  { name: "Harbor", x: 20, y: 55, r: 6, category: "attention" },
  { name: "Uptown", x: 40, y: 30, r: 9, category: "growing" },
  { name: "Central", x: 80, y: 10, r: 14, category: "top" },
  { name: "Lakewood", x: 15, y: 65, r: 5, category: "attention" },
  { name: "Riverside", x: 25, y: 60, r: 6, category: "attention" },
];

const categoryColors: Record<string, string> = {
  top: "#22C55E",
  growing: "#DA314A",
  attention: "#737373",
};

const columns = [
  {
    title: "Powerful exports",
    description:
      "Export member data, financials, and usage reports in CSV, PDF, or Excel.",
  },
  {
    title: "Stripe Dashboard",
    description:
      "Deep Stripe integration pulls payment data across all locations into client-ready dashboards.",
  },
  {
    title: "API",
    description:
      "Connect through our API to automate reporting, streamline workflows, and fit GymPlatform into your stack.",
  },
];

export function ReportsSection() {
  return (
    <SectionContainer id="integrations">
      <AnimationWrapper>
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-peec-red">Integrations</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Create powerful reports
          </h2>
          <p className="text-base text-peec-text-secondary">
            Turn complex gym data into simple, shareable reports for your team and stakeholders.
          </p>
        </div>
      </AnimationWrapper>

      {/* Bubble chart */}
      <AnimationWrapper delay={0.1}>
        <div className="mb-12 rounded-xl border border-peec-border-light bg-white p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-peec-dark">Location Performance</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-xs text-peec-text-tertiary">
                <span className="inline-block h-2 w-2 rounded-full bg-peec-success" />
                Top Performers
              </span>
              <span className="flex items-center gap-1.5 text-xs text-peec-text-tertiary">
                <span className="inline-block h-2 w-2 rounded-full bg-peec-red" />
                Growing
              </span>
              <span className="flex items-center gap-1.5 text-xs text-peec-text-tertiary">
                <span className="inline-block h-2 w-2 rounded-full bg-peec-text-tertiary" />
                Needs Attention
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-0 top-0 flex h-full flex-col justify-between text-xs text-peec-text-tertiary">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>
            <div className="ml-8">
              <svg viewBox="0 0 400 200" className="h-48 w-full tablet:h-64">
                <line x1="0" y1="100" x2="400" y2="100" stroke="#EBEBEB" strokeDasharray="4" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#EBEBEB" strokeDasharray="4" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#EBEBEB" strokeDasharray="4" />

                {locations.map((loc) => (
                  <g key={loc.name}>
                    <circle
                      cx={loc.x * 4}
                      cy={loc.y * 2.5}
                      r={loc.r}
                      fill={categoryColors[loc.category]}
                      opacity={0.6}
                    />
                    <text
                      x={loc.x * 4}
                      y={loc.y * 2.5 + loc.r + 12}
                      textAnchor="middle"
                      className="text-[8px] fill-[#737373]"
                    >
                      {loc.name}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="flex justify-between text-xs text-peec-text-tertiary">
                <span>$0</span>
                <span>$25K</span>
                <span>$50K</span>
                <span>$75K</span>
                <span>$100K</span>
              </div>
              <p className="mt-1 text-center text-xs text-peec-text-tertiary">Revenue</p>
            </div>
          </div>
        </div>
      </AnimationWrapper>

      {/* 3-column features */}
      <StaggerContainer className="grid grid-cols-1 gap-grid-gap tablet:grid-cols-3">
        {columns.map((col) => (
          <StaggerItem key={col.title}>
            <div className="rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
              <h3 className="mb-2 text-base font-semibold text-peec-dark">{col.title}</h3>
              <p className="text-sm leading-relaxed text-peec-text-secondary">{col.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionContainer>
  );
}
