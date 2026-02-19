"use client";

import { motion } from "framer-motion";
import { Brain, CreditCard, KeyRound, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";

import { AnimationWrapper, BlurFadeIn } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

// Mini chart data for the AI Churn card
const miniChartValues = [65, 72, 68, 75, 82, 88, 85, 92];

function MiniChart() {
  const width = 200;
  const height = 60;
  const pad = 8;

  const points = miniChartValues.map((v, i) => {
    const x = pad + (i / (miniChartValues.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - 50) / 50) * (height - pad * 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171717" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#171717" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad},${height - pad} ${points.join(" ")} ${width - pad},${height - pad}`}
        fill="url(#chartFill)"
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Typing animation for AI Insights card
const insightPrompts = [
  "Which members are at risk of churning?",
  "Show me this month's revenue breakdown",
  "What classes have the best retention?",
];

function TypingPrompt() {
  const [text, setText] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentPrompt = insightPrompts[promptIdx] ?? "";

    if (!deleting) {
      if (text.length < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setText(currentPrompt.slice(0, text.length + 1));
        }, 45);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (text.length > 0) {
      const timeout = setTimeout(() => setText(text.slice(0, -1)), 25);
      return () => clearTimeout(timeout);
    }

    setDeleting(false);
    setPromptIdx((prev) => (prev + 1) % insightPrompts.length);
    return undefined;
  }, [text, deleting, promptIdx]);

  return (
    <div className="rounded-xl border border-peec-border-light bg-stone-50/80 px-4 py-3">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 shrink-0 text-peec-text-muted" />
        <span className="text-sm text-peec-text-muted">{text}</span>
        <span className="animate-blink inline-block h-4 w-[2px] shrink-0 bg-peec-dark" />
      </div>
    </div>
  );
}

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

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 tablet:grid-rows-2">
        {/* AI Churn Prediction — large card, spans 2 rows */}
        <BlurFadeIn delay={0} className="tablet:row-span-2">
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-peec-light">
              <Brain className="h-5 w-5 text-peec-dark" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">
              AI Churn Prediction
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-peec-text-secondary">
              ML models analyze check-in patterns, payment history, and engagement signals to flag at-risk members — weeks before they cancel.
            </p>
            {/* Mini chart visual */}
            <div className="mt-auto rounded-lg border border-peec-border-light bg-stone-50/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-2xs font-medium text-peec-text-muted">Retention Trend</span>
                <span className="text-2xs font-semibold text-green-600">+5.2%</span>
              </div>
              <div className="h-[60px]">
                <MiniChart />
              </div>
            </div>
          </motion.div>
        </BlurFadeIn>

        {/* Stripe Payments — medium card */}
        <BlurFadeIn delay={0.1}>
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">
              Stripe Payments
            </h3>
            <p className="text-sm leading-relaxed text-peec-text-secondary">
              Automated billing, dunning, and revenue tracking through Stripe. PCI compliant out of the box — no card data touches your servers.
            </p>
            {/* Mini visual — payment indicators */}
            <div className="mt-auto flex gap-2 pt-4">
              {["Visa", "MC", "Amex"].map((card) => (
                <span
                  key={card}
                  className="rounded border border-peec-border-light bg-stone-50 px-2 py-1 text-2xs font-medium text-peec-text-muted"
                >
                  {card}
                </span>
              ))}
              <span className="rounded border border-peec-border-light bg-stone-50 px-2 py-1 text-2xs font-medium text-peec-text-muted">
                +12 more
              </span>
            </div>
          </motion.div>
        </BlurFadeIn>

        {/* 24/7 Access Control — medium card */}
        <BlurFadeIn delay={0.15}>
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <KeyRound className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">
              24/7 Access Control
            </h3>
            <p className="text-sm leading-relaxed text-peec-text-secondary">
              Integrate with Kisi, Brivo, QR codes, and key fobs. Access is automatically suspended when payments fail.
            </p>
            {/* Mini visual — access indicators */}
            <div className="mt-auto flex items-center gap-3 pt-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-2xs text-peec-text-muted">12 doors online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-stone-300" />
                <span className="text-2xs text-peec-text-muted">0 offline</span>
              </div>
            </div>
          </motion.div>
        </BlurFadeIn>

        {/* AI Insights — wide card, spans 2 cols */}
        <BlurFadeIn delay={0.2} className="tablet:col-span-2">
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <MessageSquareText className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">
              AI Insights
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
              Ask questions about your gym in plain English. Get instant answers powered by your data.
            </p>
            <div className="mt-auto">
              <TypingPrompt />
            </div>
          </motion.div>
        </BlurFadeIn>
      </div>
    </SectionContainer>
  );
}
