"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, Hash, MoreHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ScrollFadeIn } from "./animation-wrapper";

/* ─── Data Types ──────────────────────────────────────────────── */

interface SpecTableRow {
  readonly label: string;
  readonly value: string;
}

interface SpecSubSection {
  readonly heading: string;
  readonly type: "table" | "list";
  readonly rows?: ReadonlyArray<SpecTableRow>;
  readonly items?: ReadonlyArray<string>;
}

interface TechSpec {
  readonly number: string;
  readonly title: string;
  readonly category: string;
  readonly badge?: string;
  readonly description: string;
  readonly sections: ReadonlyArray<SpecSubSection>;
}

/* ─── Spec Content ────────────────────────────────────────────── */

const TECH_SPECS: ReadonlyArray<TechSpec> = [
  {
    number: "1.1",
    title: "AI Retention Engine",
    category: "Intelligence",
    description:
      "Machine-learning churn prediction that analyzes check-in frequency, payment history, engagement patterns, and class attendance to flag at-risk members before they cancel.",
    sections: [
      {
        heading: "Model Inputs",
        type: "table",
        rows: [
          { label: "Check-in frequency", value: "Rolling 30 / 60 / 90-day windows" },
          { label: "Payment history", value: "Late payments, failed charges, downgrades" },
          { label: "Engagement score", value: "App opens, class bookings, PT sessions" },
          { label: "Class attendance", value: "Booking-to-attendance ratio" },
        ],
      },
      {
        heading: "Outputs",
        type: "table",
        rows: [
          { label: "Churn risk score", value: "0–100, updated daily" },
          { label: "Risk tier", value: "Low / Medium / High / Critical" },
          { label: "Primary driver", value: "Top contributing factor" },
          { label: "Recommended action", value: "AI-generated intervention" },
        ],
      },
      {
        heading: "Automated Interventions",
        type: "list",
        items: [
          "Personalized re-engagement emails triggered at risk thresholds",
          "Staff task creation for high-value at-risk members",
          "Discount offer workflows with A/B testing",
          "Win-back campaigns for recently cancelled members",
          "Freeze-instead-of-cancel nudges during cancellation flow",
        ],
      },
    ],
  },
  {
    number: "1.2",
    title: "Stripe Billing",
    category: "Payments",
    description:
      "Native Stripe Connect integration handling the full subscription lifecycle — sign-up, upgrades, downgrades, pauses, cancellations, and smart dunning — with PCI Level 1 compliance out of the box.",
    sections: [
      {
        heading: "Billing Features",
        type: "table",
        rows: [
          { label: "Recurring billing", value: "Weekly, monthly, annual cycles" },
          { label: "Proration", value: "Automatic on mid-cycle plan changes" },
          { label: "Smart dunning", value: "Configurable retry schedule + member alerts" },
          { label: "Multi-currency", value: "USD, CAD, GBP, EUR, AUD" },
          { label: "Tax handling", value: "Stripe Tax auto-calculation" },
        ],
      },
      {
        heading: "Revenue Operations",
        type: "table",
        rows: [
          { label: "Connect payouts", value: "Automatic splits to gym bank accounts" },
          { label: "Invoicing", value: "Branded PDF invoices + email delivery" },
          { label: "Refunds", value: "Full, partial, and credit-based refunds" },
          { label: "Revenue recognition", value: "Deferred revenue tracking" },
        ],
      },
    ],
  },
  {
    number: "1.3",
    title: "Access Control",
    category: "Hardware",
    description:
      "Integrates with Kisi, Brivo, and generic relay hardware for 24/7 unmanned access. Members use QR codes or key fobs; the system auto-suspends door access on failed payments.",
    sections: [
      {
        heading: "Supported Hardware",
        type: "table",
        rows: [
          { label: "Kisi", value: "Cloud-managed smart locks + readers" },
          { label: "Brivo", value: "Enterprise access panels + mobile credentials" },
          { label: "QR code", value: "Dynamic rotating codes via member app" },
          { label: "Key fobs / cards", value: "HID, MIFARE, NFC compatible" },
        ],
      },
      {
        heading: "Automation Rules",
        type: "list",
        items: [
          "Auto-suspend access on payment failure after grace period",
          "Reinstate access immediately on successful retry",
          "Time-restricted access by plan tier (e.g., off-peak only)",
          "Guest pass QR codes with expiration",
          "Real-time door event logging and anomaly alerts",
        ],
      },
    ],
  },
  {
    number: "1.4",
    title: "Analytics & Reports",
    category: "Insights",
    description:
      "Over 50 pre-built metrics across revenue, retention, attendance, and operations. An AI copilot lets staff ask questions in plain English and get instant chart responses.",
    sections: [
      {
        heading: "Metrics Library",
        type: "table",
        rows: [
          { label: "Revenue", value: "MRR, ARR, ARPU, LTV, churn rate" },
          { label: "Retention", value: "30/60/90-day, cohort analysis" },
          { label: "Attendance", value: "Daily visits, peak hours, class fill rates" },
          { label: "Operations", value: "Staff utilization, equipment usage" },
        ],
      },
      {
        heading: "AI Copilot",
        type: "table",
        rows: [
          { label: "Natural language", value: '"Show me revenue by plan this quarter"' },
          { label: "Auto-visualization", value: "Bar, line, pie charts generated on demand" },
          { label: "Export", value: "PNG, CSV, PDF with one click" },
          { label: "Scheduled reports", value: "Daily/weekly email digests" },
        ],
      },
    ],
  },
  {
    number: "1.5",
    title: "Mobile App",
    category: "Coming Soon",
    badge: "Coming Soon",
    description:
      "White-label iOS and Android app for members — QR check-in, class booking, payment management, and push notifications, all branded to your gym.",
    sections: [
      {
        heading: "Member Features",
        type: "table",
        rows: [
          { label: "QR check-in", value: "Scan-to-enter at any door" },
          { label: "Class booking", value: "Browse schedule, book, waitlist" },
          { label: "Payment management", value: "Update card, view invoices, pause plan" },
          { label: "Push notifications", value: "Class reminders, promotions, alerts" },
        ],
      },
      {
        heading: "Gym Branding",
        type: "table",
        rows: [
          { label: "Custom icon & splash", value: "Your logo on the home screen" },
          { label: "Color theming", value: "Match your brand palette" },
          { label: "Custom domain", value: "app.yourgym.com deep links" },
          { label: "App Store listing", value: "Published under your developer account" },
        ],
      },
    ],
  },
  {
    number: "1.6",
    title: "Multi-Location",
    category: "Scale",
    description:
      "Unified dashboard for franchise and multi-gym operators. Cross-location member transfers, centralized campaigns, and per-location P&L reporting.",
    sections: [
      {
        heading: "Operations",
        type: "table",
        rows: [
          { label: "Unified dashboard", value: "All locations in one view" },
          { label: "Member transfers", value: "Seamless cross-location moves" },
          { label: "Centralized campaigns", value: "Send to all or selected locations" },
          { label: "Role-based access", value: "Owner, regional manager, location staff" },
        ],
      },
      {
        heading: "Financials",
        type: "table",
        rows: [
          { label: "Per-location P&L", value: "Revenue, expenses, net by site" },
          { label: "Consolidated reporting", value: "Roll-up across all locations" },
          { label: "Benchmarking", value: "Compare locations on key metrics" },
          { label: "Royalty tracking", value: "Franchise fee calculation + payouts" },
        ],
      },
    ],
  },
];

/* ─── Platform Overview (1.0) ─────────────────────────────────── */

const PLATFORM_OVERVIEW: TechSpec = {
  number: "1.0",
  title: "Platform",
  category: "Overview",
  description:
    "LEDGR is a unified gym management platform that combines AI-powered retention intelligence, automated billing, hardware access control, and multi-location operations into a single system built for modern fitness businesses.",
  sections: [
    {
      heading: "Platform Modules",
      type: "table",
      rows: [
        { label: "AI Retention Engine", value: "ML churn prediction + automated interventions" },
        { label: "Stripe Billing", value: "Subscriptions, dunning, revenue ops" },
        { label: "Access Control", value: "24/7 door hardware integration" },
        { label: "Analytics & Reports", value: "50+ metrics + AI copilot" },
        { label: "Mobile App", value: "White-label iOS + Android (Coming Soon)" },
        { label: "Multi-Location", value: "Franchise dashboard + per-location P&L" },
      ],
    },
    {
      heading: "Technical Foundation",
      type: "table",
      rows: [
        { label: "Stack", value: "Next.js, React Native, PostgreSQL, tRPC" },
        { label: "Payments", value: "Stripe Connect + Stripe Billing" },
        { label: "Security", value: "PCI Level 1, SOC 2 Type II, end-to-end encryption" },
        { label: "Uptime SLA", value: "99.95% with automatic failover" },
      ],
    },
    {
      heading: "Key Differentiators",
      type: "list",
      items: [
        "AI-first: churn prediction and automated retention built into every workflow",
        "Unified platform: no more stitching together 5+ separate tools",
        "Real-time: live dashboards, instant access control, streaming analytics",
        "White-glove onboarding: data migration, hardware setup, staff training included",
      ],
    },
  ],
};

/* ─── Spring / Animation ──────────────────────────────────────── */

const spring = { type: "spring" as const, damping: 25, stiffness: 300 };
const ease = [0.25, 0.1, 0.25, 1] as const;

/* ─── Interactive Demo Types + Data ───────────────────────────── */

type DemoPhase = "idle" | "sent" | "typing" | "responded" | "updated";

const CHAT_MESSAGES = [
  {
    name: "Sarah",
    time: "2:14 PM",
    initial: "S",
    color: "bg-blue-500/15 text-blue-400",
    text: "Check-ins at Westside dropped 18% this month. Anyone know what\u2019s going on?",
  },
  {
    name: "Marcus",
    time: "2:15 PM",
    initial: "M",
    color: "bg-green-500/15 text-green-400",
    text: "We lost 4 members last week. Two were long-time Premium members.",
  },
  {
    name: "Amy",
    time: "2:16 PM",
    initial: "A",
    color: "bg-purple-500/15 text-purple-400",
    text: "Let\u2019s get the AI on this before it gets worse.",
  },
];

const LEDGER_RESPONSE =
  "Scanned 234 Westside members. Found 3 at risk \u2014 Sarah J. (91), Mike T. (87), Lisa K. (62). Primary drivers: check-in drop-off and failed payments. Created 2 interventions: re-engagement email for Sarah, 15% discount offer for Lisa.";

const RISK_MEMBERS = [
  { name: "Sarah J.", plan: "Premium", risk: 91 },
  { name: "Mike T.", plan: "24/7 Access", risk: 87 },
  { name: "Lisa K.", plan: "PT Package", risk: 62 },
];

const ACTIVE_MEMBERS = [
  { name: "Tom W.", plan: "Student" },
  { name: "Jake R.", plan: "Premium" },
  { name: "Diana L.", plan: "24/7 Access" },
  { name: "Chris P.", plan: "Corporate" },
];

const INTERVENTIONS = [
  { name: "Sarah J.", action: "Re-engagement email sent" },
  { name: "Lisa K.", action: "15% discount offered" },
];

/* ─── Chat Panel ──────────────────────────────────────────────── */

function ChatPanel({
  phase,
  onSend,
}: {
  phase: DemoPhase;
  onSend: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [phase]);

  const hasSent = phase !== "idle";
  const showTyping = phase === "typing";
  const showResponse = phase === "responded" || phase === "updated";

  return (
    <div className="glass-panel flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] tablet:w-[440px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Hash className="h-3.5 w-3.5 text-peec-text-muted" />
          <span className="text-sm font-medium text-peec-dark">
            Thread in #retention
          </span>
        </div>
        <MoreHorizontal className="h-4 w-4 text-peec-text-muted" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-hidden px-4 py-4">
        {CHAT_MESSAGES.map((msg) => (
          <div key={msg.name} className="flex gap-3">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-2xs font-bold ${msg.color}`}
            >
              {msg.initial}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-peec-dark">
                  {msg.name}
                </span>
                <span className="text-2xs text-peec-text-muted">
                  {msg.time}
                </span>
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-peec-text-secondary">
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* Sent message */}
        <AnimatePresence>
          {hasSent && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="flex gap-3"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-2xs font-bold text-purple-400">
                A
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-peec-dark">
                    Amy
                  </span>
                  <span className="text-2xs text-peec-text-muted">
                    2:17 PM
                  </span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-peec-text-secondary">
                  <span className="rounded bg-white/[0.06] px-1 py-0.5 font-medium text-peec-dark">
                    @LEDGR
                  </span>{" "}
                  analyze Westside churn risk and create interventions
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {showTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex gap-3"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-2xs font-bold text-peec-dark">
                L
              </div>
              <div className="flex items-center gap-1 pt-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-peec-text-muted"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEDGR response */}
        <AnimatePresence>
          {showResponse && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="flex gap-3"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-2xs font-bold text-peec-dark">
                L
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-peec-dark">
                    LEDGR
                  </span>
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-2xs font-medium text-peec-dark">
                    AI
                  </span>
                  <span className="text-2xs text-peec-text-muted">
                    2:17 PM
                  </span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-peec-text-secondary">
                  {LEDGER_RESPONSE}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 truncate rounded-lg border border-white/[0.06] px-3 py-2">
            {phase === "idle" ? (
              <p className="truncate text-sm text-peec-text-muted">
                <span className="font-medium text-peec-dark">@LEDGR</span>{" "}
                analyze Westside churn risk...
              </p>
            ) : (
              <p className="text-sm text-peec-text-muted">
                Message #retention
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onSend}
            disabled={phase !== "idle"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
              phase === "idle"
                ? "animate-pulse-glow bg-white/10 text-white hover:bg-white/20"
                : "bg-white/[0.04] text-peec-text-muted"
            }`}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Board Panel ─────────────────────────────────────────────── */

function BoardPanel({ phase }: { phase: DemoPhase }) {
  const showRisk = phase === "responded" || phase === "updated";
  const showIntervention = phase === "updated";

  return (
    <div className="glass-panel relative flex h-[380px] w-[680px] flex-col overflow-hidden rounded-2xl border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <span className="text-sm font-semibold text-peec-dark">
          Members &middot; Westside
        </span>
        <span className="text-2xs text-peec-text-muted">
          {showRisk ? "231 active" : "234 active"}
        </span>
      </div>

      {/* Columns */}
      <div className="flex flex-1 divide-x divide-white/[0.06] overflow-hidden">
        {/* Active */}
        <div className="flex w-[200px] shrink-0 flex-col p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs font-medium text-peec-dark">Active</span>
            <span className="text-2xs text-peec-text-muted">
              {showRisk ? "231" : "234"}
            </span>
          </div>
          <div className="space-y-2">
            {ACTIVE_MEMBERS.map((m) => (
              <div
                key={m.name}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2"
              >
                <p className="text-xs font-medium text-peec-dark">{m.name}</p>
                <p className="text-2xs text-peec-text-muted">{m.plan}</p>
              </div>
            ))}
          </div>
        </div>

        {/* At Risk */}
        <div className="flex w-[220px] shrink-0 flex-col p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-xs font-medium text-peec-dark">
              At Risk
            </span>
            <span className="text-2xs text-peec-text-muted">
              {showRisk ? "3" : "0"}
            </span>
          </div>
          <AnimatePresence>
            {showRisk && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease }}
                className="space-y-2"
              >
                {RISK_MEMBERS.map((m, i) => (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.2, ease }}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-peec-dark">
                        {m.name}
                      </p>
                      <span
                        className={`text-2xs font-bold ${m.risk >= 80 ? "text-red-400" : "text-amber-400"}`}
                      >
                        {m.risk}
                      </span>
                    </div>
                    <p className="text-2xs text-peec-text-muted">{m.plan}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Intervened */}
        <div className="flex w-[220px] shrink-0 flex-col p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-peec-text-tertiary" />
            <span className="text-xs font-medium text-peec-dark">
              Intervened
            </span>
            <span className="text-2xs text-peec-text-muted">
              {showIntervention ? "2" : "0"}
            </span>
          </div>
          <AnimatePresence>
            {showIntervention && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease }}
                className="space-y-2"
              >
                {INTERVENTIONS.map((m, i) => (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.2, ease }}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2"
                  >
                    <p className="text-xs font-medium text-peec-dark">
                      {m.name}
                    </p>
                    <p className="text-2xs text-peec-text-tertiary">{m.action}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Internal bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-2xl"
        style={{
          background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0) 100%)",
        }}
      />
    </div>
  );
}

/* ─── Interactive Demo ────────────────────────────────────────── */

function InteractiveDemo() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Reset when section scrolls out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && !entry.isIntersecting && phase === "updated") {
          timeoutsRef.current.forEach(clearTimeout);
          timeoutsRef.current = [];
          setPhase("idle");
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  const handleSend = useCallback(() => {
    if (phase !== "idle") return;

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setPhase("sent");
    timeoutsRef.current.push(
      setTimeout(() => setPhase("typing"), 900),
      setTimeout(() => setPhase("responded"), 3200),
      setTimeout(() => setPhase("updated"), 4600),
    );
  }, [phase]);

  return (
    <div ref={containerRef} className="mx-auto mt-12 tablet:mt-16">
      {/* Desktop: overlapping layout */}
      <div className="relative hidden tablet:block" style={{ height: "440px" }}>
        {/* Board — behind, offset right */}
        <div className="absolute left-[380px] top-0">
          <BoardPanel phase={phase} />
        </div>
        {/* Chat — foreground, left */}
        <div className="absolute left-0 top-4 z-10">
          <ChatPanel phase={phase} onSend={handleSend} />
        </div>
      </div>

      {/* Mobile: chat only */}
      <div className="tablet:hidden">
        <ChatPanel phase={phase} onSend={handleSend} />
      </div>
    </div>
  );
}

/* ─── Drawer ──────────────────────────────────────────────────── */

function SpecDrawer({
  spec,
  onClose,
}: {
  spec: TechSpec;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-black/60"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={spring}
        className="glass-panel fixed inset-y-0 right-0 z-[61] flex w-full flex-col border-l border-white/[0.08] tablet:max-w-2xl"
        style={{ background: "rgba(12,12,12,0.92)", backdropFilter: "blur(32px) saturate(1.3)" }}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-peec-text-muted">
              {spec.number}
            </span>
            <span className="text-sm font-medium text-peec-dark">
              {spec.title}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-peec-text-tertiary transition-colors hover:text-peec-dark"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 tablet:p-8">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-sm text-peec-text-muted">
                {spec.number}
              </span>
              <span className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-2xs font-medium text-peec-text-tertiary">
                {spec.category}
              </span>
            </div>
            <h2 className="mb-3 text-3xl font-medium tracking-tight text-peec-dark tablet:text-4xl">
              {spec.title}
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-peec-text-secondary">
              {spec.description}
            </p>
          </div>

          <div className="space-y-8">
            {spec.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="mb-4 text-sm font-semibold text-peec-dark">
                  {section.heading}
                </h3>

                {section.type === "table" && section.rows && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    {section.rows.map((row, i) => (
                      <div
                        key={row.label}
                        className={`grid grid-cols-2 gap-4 px-4 py-3 ${
                          i > 0 ? "border-t border-white/[0.04]" : ""
                        }`}
                      >
                        <span className="text-sm font-medium text-peec-dark">
                          {row.label}
                        </span>
                        <span className="text-sm text-peec-text-tertiary">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === "list" && section.items && (
                  <div className="space-y-2.5">
                    {section.items.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        <span className="text-sm leading-relaxed text-peec-text-secondary">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Main Section ────────────────────────────────────────────── */

export function TechSpecsSection() {
  const [activeSpec, setActiveSpec] = useState<TechSpec | null>(null);

  const handleClose = useCallback(() => setActiveSpec(null), []);

  const leftColumn = TECH_SPECS.filter((_, i) => i % 2 === 0);
  const rightColumn = TECH_SPECS.filter((_, i) => i % 2 !== 0);

  return (
    <section className="relative overflow-hidden px-6 py-section">
      {/* Subtle gradient wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(59,130,246,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-peec">
        {/* ── Split Header (Linear-style) ── */}
        <ScrollFadeIn>
          <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:gap-16">
            <div>
              <h2 className="text-4xl font-medium tracking-tight text-peec-dark tablet:text-5xl">
                The complete
                <br />
                gym platform.
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="mb-6 max-w-md text-base leading-relaxed text-peec-text-secondary">
                AI retention, Stripe billing, hardware access, analytics, and
                multi-location ops — unified in one system built for modern
                fitness businesses.
              </p>
              <button
                type="button"
                onClick={() => setActiveSpec(PLATFORM_OVERVIEW)}
                className="group font-mono text-sm text-peec-text-muted transition-colors hover:text-peec-dark"
              >
                1.0&ensp; Platform&ensp;
                <ArrowRight className="inline h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </ScrollFadeIn>

        {/* ── Interactive Demo ── */}
        <ScrollFadeIn delay={0.1}>
          <InteractiveDemo />
        </ScrollFadeIn>

        {/* ── Bottom Numbered Grid ── */}
        <ScrollFadeIn delay={0.15}>
          {/* Mobile */}
          <div className="mt-10 divide-y divide-white/[0.06] tablet:hidden">
            {TECH_SPECS.map((spec) => (
              <button
                key={spec.number}
                type="button"
                onClick={() => setActiveSpec(spec)}
                className="group flex w-full items-center gap-3 py-2.5 text-left"
              >
                <span className="font-mono text-xs text-peec-text-muted transition-colors group-hover:text-peec-dark">
                  {spec.number}
                </span>
                <span className="flex-1 text-sm font-medium text-peec-text-secondary transition-colors group-hover:text-peec-dark">
                  {spec.title}
                </span>
                {spec.badge && (
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-2xs font-medium text-peec-dark">
                    {spec.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Desktop */}
          <div className="relative mt-12 hidden tablet:block">
            <div className="relative grid grid-cols-2">
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.06]" />
              <div className="pr-10">
                {leftColumn.map((spec) => (
                  <button
                    key={spec.number}
                    type="button"
                    onClick={() => setActiveSpec(spec)}
                    className="group flex w-full items-center gap-3 py-2 text-left"
                  >
                    <span className="font-mono text-xs text-peec-text-muted transition-colors group-hover:text-peec-dark">
                      {spec.number}
                    </span>
                    <span className="text-sm font-medium text-peec-text-secondary transition-colors group-hover:text-peec-dark">
                      {spec.title}
                    </span>
                    {spec.badge && (
                      <span className="ml-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-2xs font-medium text-peec-dark">
                        {spec.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="pl-10">
                {rightColumn.map((spec) => (
                  <button
                    key={spec.number}
                    type="button"
                    onClick={() => setActiveSpec(spec)}
                    className="group flex w-full items-center gap-3 py-2 text-left"
                  >
                    <span className="font-mono text-xs text-peec-text-muted transition-colors group-hover:text-peec-dark">
                      {spec.number}
                    </span>
                    <span className="text-sm font-medium text-peec-text-secondary transition-colors group-hover:text-peec-dark">
                      {spec.title}
                    </span>
                    {spec.badge && (
                      <span className="ml-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-2xs font-medium text-peec-dark">
                        {spec.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollFadeIn>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {activeSpec && (
          <SpecDrawer
            key={activeSpec.number}
            spec={activeSpec}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
