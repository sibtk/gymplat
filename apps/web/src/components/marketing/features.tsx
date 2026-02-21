"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  Calendar,
  CreditCard,
  KeyRound,
  MessageSquareText,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AnimationWrapper, BlurFadeIn } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

// Mini chart data for AI Churn card
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

// Mini member list for Member Management card
function MiniMemberList() {
  const members = [
    { name: "Sarah J.", plan: "Premium", status: "Active" },
    { name: "Mike T.", plan: "24/7 Access", status: "Active" },
    { name: "Lisa K.", plan: "PT Package", status: "At Risk" },
  ];

  return (
    <div className="space-y-1">
      {members.map((m) => (
        <div key={m.name} className="flex items-center justify-between rounded-lg bg-stone-50 px-2.5 py-1.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-stone-200" />
            <span className="text-[10px] font-medium text-stone-900">{m.name}</span>
          </div>
          <span className="text-[9px] text-stone-400">{m.plan}</span>
          <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-medium ${
            m.status === "Active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
          }`}>
            {m.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// Mini week calendar for Class Scheduling card
function MiniWeekCalendar() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const classes = [
    { day: 0, top: "10%", height: "22%", label: "HIIT", color: "bg-peec-dark/10 border-l-2 border-l-peec-dark" },
    { day: 1, top: "30%", height: "18%", label: "Yoga", color: "bg-blue-50 border-l-2 border-l-blue-400" },
    { day: 2, top: "15%", height: "25%", label: "Spin", color: "bg-green-50 border-l-2 border-l-green-400" },
    { day: 3, top: "45%", height: "20%", label: "Strength", color: "bg-amber-50 border-l-2 border-l-amber-400" },
    { day: 4, top: "20%", height: "22%", label: "CrossFit", color: "bg-purple-50 border-l-2 border-l-purple-400" },
  ];

  return (
    <div>
      <div className="mb-1 grid grid-cols-5 gap-1">
        {days.map((d) => (
          <span key={d} className="text-center text-[8px] text-peec-text-muted">{d}</span>
        ))}
      </div>
      <div className="grid h-24 grid-cols-5 gap-1">
        {days.map((_, di) => (
          <div key={di} className="relative rounded bg-stone-50/50">
            {classes
              .filter((c) => c.day === di)
              .map((c) => (
                <div
                  key={c.label}
                  className={`absolute inset-x-0 flex items-center justify-center rounded ${c.color}`}
                  style={{ top: c.top, height: c.height }}
                >
                  <span className="text-[7px] font-medium text-stone-700">{c.label}</span>
                </div>
              ))}
          </div>
        ))}
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

      {/* Bento Grid — 3 cols, 3 rows */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 tablet:grid-rows-3">
        {/* AI Churn Prediction — tall card, spans 2 rows */}
        <BlurFadeIn delay={0} className="tablet:row-span-2">
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-peec-light">
              <Brain className="h-5 w-5 text-peec-dark" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">AI Churn Prediction</h3>
            <p className="mb-6 text-sm leading-relaxed text-peec-text-secondary">
              ML models analyze check-in patterns, payment history, and engagement signals to flag
              at-risk members — weeks before they cancel.
            </p>

            {/* Risk alerts */}
            <div className="mb-4 space-y-2">
              {[
                { name: "Sarah J.", risk: 87, label: "High" },
                { name: "Mike T.", risk: 62, label: "Medium" },
                { name: "Lisa K.", risk: 91, label: "Critical" },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-2 rounded-lg bg-stone-50/80 px-3 py-2">
                  <div className="h-5 w-5 rounded-full bg-stone-200" />
                  <span className="flex-1 text-xs font-medium text-peec-dark">{m.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-10 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className={`h-full rounded-full ${m.risk >= 80 ? "bg-red-400" : "bg-amber-400"}`}
                        style={{ width: `${m.risk}%` }}
                      />
                    </div>
                    <span className={`text-2xs font-medium ${
                      m.risk >= 80 ? "text-red-500" : "text-amber-500"
                    }`}>
                      {m.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

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

        {/* Stripe Payments */}
        <BlurFadeIn delay={0.1}>
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">Stripe Payments</h3>
            <p className="text-sm leading-relaxed text-peec-text-secondary">
              Automated billing, dunning, and revenue tracking through Stripe. PCI compliant out of
              the box.
            </p>
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
                +12
              </span>
            </div>
          </motion.div>
        </BlurFadeIn>

        {/* 24/7 Access Control */}
        <BlurFadeIn delay={0.15}>
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <KeyRound className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">24/7 Access Control</h3>
            <p className="text-sm leading-relaxed text-peec-text-secondary">
              Integrate with Kisi, Brivo, QR codes, and key fobs. Access suspends automatically when
              payments fail.
            </p>
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

        {/* Member Management — wide card, spans 2 cols */}
        <BlurFadeIn delay={0.2} className="tablet:col-span-2">
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">Member Management</h3>
            <p className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
              Full member lifecycle — profiles, plans, check-in history, and engagement tracking. Add
              members individually or import in bulk.
            </p>
            <div className="mt-auto">
              <MiniMemberList />
            </div>
          </motion.div>
        </BlurFadeIn>

        {/* Class Scheduling — wide card, spans 2 cols */}
        <BlurFadeIn delay={0.25} className="tablet:col-span-2">
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
              <Calendar className="h-5 w-5 text-teal-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">
              Class Scheduling &amp; Communication
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
              Manage classes, track attendance, and run targeted campaigns — all from one place.
            </p>
            <div className="mt-auto">
              <MiniWeekCalendar />
            </div>
          </motion.div>
        </BlurFadeIn>

        {/* Reporting & Analytics */}
        <BlurFadeIn delay={0.3}>
          <motion.div
            className="flex h-full flex-col rounded-xl border border-peec-border-light bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-peec-dark">Reports &amp; Analytics</h3>
            <p className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
              Custom reports, revenue dashboards, and trend analysis with AI-powered insights.
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
