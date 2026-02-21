"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { AnimationWrapper } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const faqs = [
  {
    question: "How long does setup take?",
    answer:
      "Most gyms are fully set up within 24 hours. Our team handles data migration from your existing system, including member records, billing history, and class schedules.",
  },
  {
    question: "Do I need to change my payment processor?",
    answer:
      "No. Ledger integrates directly with Stripe. If you're not on Stripe yet, we'll help you set up an account \u2014 it takes about 15 minutes.",
  },
  {
    question: "How does the AI churn prediction work?",
    answer:
      "Our models analyze check-in frequency, payment history, class attendance, and engagement patterns to generate a risk score for each member. High-risk members get flagged with recommended interventions you can approve with one click.",
  },
  {
    question: "Can I use Ledger for multiple locations?",
    answer:
      "Yes. Pro supports up to 5 locations with unified reporting. Enterprise supports unlimited locations with automated franchise billing and consolidated dashboards.",
  },
  {
    question: "What access control hardware do you support?",
    answer:
      "We integrate with Kisi, Brivo, and QR code systems out of the box. Custom hardware integrations are available on Enterprise plans.",
  },
  {
    question: "What are the payment processing fees?",
    answer:
      "Ledger charges just 0.8% of each transaction total on top of standard Stripe processing fees (2.9% + 30\u00A2). For example, on a $100 membership payment, Ledger\u2019s fee is only 80 cents. No hidden fees, no monthly minimums.",
  },
  {
    question: "Is there a contract or commitment?",
    answer:
      "No long-term contracts. All plans are month-to-month. You can cancel anytime from your account settings.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "You own your data. We provide a full data export in CSV and JSON formats. Your data is retained for 30 days after cancellation, then permanently deleted.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full border-b border-peec-border-light px-1 py-5 text-left"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-peec-dark">{question}</h3>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-peec-text-muted" />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-sm leading-relaxed text-peec-text-secondary">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function FaqSection() {
  return (
    <SectionContainer>
      <AnimationWrapper>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium text-peec-red">FAQ</p>
          <h2 className="text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Common questions
          </h2>
        </div>
      </AnimationWrapper>

      <div className="mx-auto max-w-2xl">
        {faqs.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </SectionContainer>
  );
}
