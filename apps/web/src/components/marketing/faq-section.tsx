"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { AnimationWrapper } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const faqs = [
  {
    question: "How do I get started with GymPlatform?",
    answer:
      "Set up a workspace with your gym name and location, then configure your membership plans and access rules. Within 24 hours, your AI-powered dashboard will show real-time member and revenue insights.",
  },
  {
    question: "How does the AI churn prediction work?",
    answer:
      "Our machine learning model analyzes check-in frequency, payment patterns, class attendance, and app engagement to score every member's churn risk from 0-100. When a member crosses the risk threshold, you're alerted automatically with recommended interventions.",
  },
  {
    question: "Can I segment analytics by location, plan type, or member group?",
    answer:
      "Yes. You can filter results by location, membership plan, member tags (e.g., corporate, student), and time period, allowing you to compare performance across segments.",
  },
  {
    question: "How often is the data refreshed?",
    answer:
      "Member check-ins, payments, and access events sync in real-time. AI risk scores update daily. Analytics dashboards refresh every 5 minutes with a visible countdown to the next update.",
  },
  {
    question: "How does access control integration work?",
    answer:
      "GymPlatform integrates directly with Kisi and Brivo hardware. When a member's payment fails or membership expires, their door access is automatically suspended in real-time.",
  },
  {
    question: "How do I migrate from my current gym software?",
    answer:
      "We offer free data migration from Mindbody, Zen Planner, Wodify, and other major platforms. Our team handles the import — typically completed within 48 hours. Your AI models start training on day one.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-peec-border-light">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-base font-medium text-peec-dark">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-peec-text-tertiary transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm leading-relaxed text-peec-text-secondary">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <SectionContainer>
      <AnimationWrapper>
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
              FAQs
            </h2>
            <p className="text-base text-peec-text-secondary">
              Get answers to the most common questions about gym management and GymPlatform.
            </p>
          </div>
          <div>
            {faqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </AnimationWrapper>
    </SectionContainer>
  );
}
