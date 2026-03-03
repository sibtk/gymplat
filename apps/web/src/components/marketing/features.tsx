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

import { ScrollFadeIn, StaggerContainer, StaggerItem } from "./animation-wrapper";
import { GlassCard } from "./glass-card";
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
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
        <filter id="miniGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points={`${pad},${height - pad} ${points.join(" ")} ${width - pad},${height - pad}`}
        fill="url(#chartFill)"
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#miniGlow)"
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
    <div className="glass-surface rounded-xl px-4 py-3">
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
        <div key={m.name} className="glass-surface flex items-center justify-between rounded-lg px-2.5 py-1.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-white/10" />
            <span className="text-[10px] font-medium text-peec-dark">{m.name}</span>
          </div>
          <span className="text-[9px] text-peec-text-muted">{m.plan}</span>
          <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-medium ${
            m.status === "Active" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"
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
    { day: 0, top: "10%", height: "22%", label: "HIIT", color: "bg-white/[0.06] border-l-2 border-l-peec-dark" },
    { day: 1, top: "30%", height: "18%", label: "Yoga", color: "bg-blue-500/10 border-l-2 border-l-blue-400" },
    { day: 2, top: "15%", height: "25%", label: "Spin", color: "bg-green-500/10 border-l-2 border-l-green-400" },
    { day: 3, top: "45%", height: "20%", label: "Strength", color: "bg-amber-500/10 border-l-2 border-l-amber-400" },
    { day: 4, top: "20%", height: "22%", label: "CrossFit", color: "bg-purple-500/10 border-l-2 border-l-purple-400" },
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
          <div key={di} className="relative rounded bg-white/[0.02]">
            {classes
              .filter((c) => c.day === di)
              .map((c) => (
                <div
                  key={c.label}
                  className={`absolute inset-x-0 flex items-center justify-center rounded ${c.color}`}
                  style={{ top: c.top, height: c.height }}
                >
                  <span className="text-[7px] font-medium text-peec-text-secondary">{c.label}</span>
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
    <SectionContainer id="features" className="relative overflow-hidden">
      {/* Dot grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0" />

      {/* Floating gradient orbs */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 60, -20, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -50, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />

      <ScrollFadeIn>
        <div className="relative mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-peec-text-muted">
            Features
          </p>
          <h2 className="mb-4 text-3xl font-medium tracking-tight text-peec-dark tablet:text-4xl">
            Everything you need to run a modern gym
          </h2>
          <p className="text-base text-peec-text-secondary">
            Automate the busywork. Let AI surface what matters. Act before members churn.
          </p>
        </div>
      </ScrollFadeIn>

      {/* Bento Grid */}
      <StaggerContainer className="relative grid grid-cols-1 gap-8 tablet:grid-cols-3 tablet:grid-rows-3">
        {/* AI Churn Prediction — tall card, spans 2 rows */}
        <StaggerItem className="tablet:row-span-2">
          <GlassCard accent="rose" className="h-full">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                <Brain className="h-5 w-5 text-rose-400" />
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
                  <div key={m.name} className="glass-surface flex items-center gap-2 rounded-lg px-3 py-2">
                    <div className="h-5 w-5 rounded-full bg-white/10" />
                    <span className="flex-1 text-xs font-medium text-peec-dark">{m.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-10 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${m.risk >= 80 ? "bg-red-400" : "bg-amber-400"}`}
                          style={{ width: `${m.risk}%` }}
                        />
                      </div>
                      <span className={`text-2xs font-medium ${
                        m.risk >= 80 ? "text-red-400" : "text-amber-400"
                      }`}>
                        {m.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto glass-surface rounded-lg p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xs font-medium text-peec-text-muted">Retention Trend</span>
                  <span className="text-2xs font-semibold text-green-400">+5.2%</span>
                </div>
                <div className="h-[60px]">
                  <MiniChart />
                </div>
              </div>
            </div>
          </GlassCard>
        </StaggerItem>

        {/* Stripe Payments */}
        <StaggerItem>
          <GlassCard accent="blue" className="h-full">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <CreditCard className="h-5 w-5 text-blue-400" />
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
                    className="glass-surface rounded px-2 py-1 text-2xs font-medium text-peec-text-muted"
                  >
                    {card}
                  </span>
                ))}
                <span className="glass-surface rounded px-2 py-1 text-2xs font-medium text-peec-text-muted">
                  +12
                </span>
              </div>
            </div>
          </GlassCard>
        </StaggerItem>

        {/* 24/7 Access Control */}
        <StaggerItem>
          <GlassCard accent="amber" className="h-full">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <KeyRound className="h-5 w-5 text-amber-400" />
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
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="text-2xs text-peec-text-muted">0 offline</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </StaggerItem>

        {/* Member Management — wide card, spans 2 cols */}
        <StaggerItem className="tablet:col-span-2">
          <GlassCard accent="emerald" className="h-full">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-peec-dark">Member Management</h3>
              <p className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
                Full member lifecycle — profiles, plans, check-in history, and engagement tracking. Add
                members individually or import in bulk.
              </p>
              <div className="mt-auto">
                <MiniMemberList />
              </div>
            </div>
          </GlassCard>
        </StaggerItem>

        {/* Class Scheduling — wide card, spans 2 cols */}
        <StaggerItem className="tablet:col-span-2">
          <GlassCard accent="violet" className="h-full">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Calendar className="h-5 w-5 text-violet-400" />
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
            </div>
          </GlassCard>
        </StaggerItem>

        {/* Reporting & Analytics */}
        <StaggerItem>
          <GlassCard accent="cyan" className="h-full">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-peec-dark">Reports &amp; Analytics</h3>
              <p className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
                Custom reports, revenue dashboards, and trend analysis with AI-powered insights.
              </p>
              <div className="mt-auto">
                <TypingPrompt />
              </div>
            </div>
          </GlassCard>
        </StaggerItem>
      </StaggerContainer>
    </SectionContainer>
  );
}
