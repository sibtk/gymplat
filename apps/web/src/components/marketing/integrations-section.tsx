"use client";

import { motion } from "framer-motion";

import { AnimationWrapper, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const integrations = [
  {
    name: "Stripe",
    description: "Payment processing, billing, and subscriptions.",
    badge: "Payments",
    initials: "St",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Kisi",
    description: "Cloud-based door access control.",
    badge: "Access Control",
    initials: "Ki",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Brivo",
    description: "Smart building access management.",
    badge: "Access Control",
    initials: "Br",
    color: "bg-sky-100 text-sky-700",
  },
  {
    name: "Mindbody",
    description: "Fitness studio scheduling and booking.",
    badge: "Scheduling",
    initials: "Mb",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Google Calendar",
    description: "Sync class schedules automatically.",
    badge: "Scheduling",
    initials: "GC",
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Mailchimp",
    description: "Email marketing and campaigns.",
    badge: "Marketing",
    initials: "Mc",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Twilio",
    description: "SMS notifications and alerts.",
    badge: "Communication",
    initials: "Tw",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Zapier",
    description: "Connect with 5,000+ apps.",
    badge: "Automation",
    initials: "Zp",
    color: "bg-orange-100 text-orange-700",
  },
];

const badgeColors: Record<string, string> = {
  Payments: "bg-purple-50 text-purple-600",
  "Access Control": "bg-blue-50 text-blue-600",
  Scheduling: "bg-green-50 text-green-600",
  Marketing: "bg-amber-50 text-amber-600",
  Communication: "bg-rose-50 text-rose-600",
  Automation: "bg-orange-50 text-orange-600",
};

export function IntegrationsSection() {
  return (
    <SectionContainer id="integrations">
      <AnimationWrapper>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium text-peec-red">Integrations</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Connects with the tools you already use
          </h2>
          <p className="text-base text-peec-text-secondary">
            Seamless integrations with payment processors, access control hardware,
            scheduling tools, and more.
          </p>
        </div>
      </AnimationWrapper>

      <StaggerContainer className="mx-auto grid max-w-4xl grid-cols-2 gap-4 tablet:grid-cols-4">
        {integrations.map((item) => (
          <StaggerItem key={item.name}>
            <motion.div
              className="flex h-full flex-col items-center rounded-xl border border-peec-border-light bg-white p-6 text-center shadow-card transition-shadow hover:shadow-card-hover"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {/* Logo placeholder */}
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${item.color}`}
              >
                {item.initials}
              </div>

              <h3 className="mb-1 text-sm font-semibold text-peec-dark">{item.name}</h3>
              <p className="mb-3 text-xs leading-relaxed text-peec-text-secondary">
                {item.description}
              </p>

              <span
                className={`mt-auto rounded-full px-2.5 py-0.5 text-2xs font-medium ${
                  badgeColors[item.badge] ?? "bg-stone-50 text-stone-600"
                }`}
              >
                {item.badge}
              </span>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <AnimationWrapper>
        <p className="mt-10 text-center text-sm text-peec-text-muted">
          Don&apos;t see your integration? We add new integrations every month.{" "}
          <a href="#" className="font-medium text-peec-dark underline-offset-4 hover:underline">
            Request one &rarr;
          </a>
        </p>
      </AnimationWrapper>
    </SectionContainer>
  );
}
