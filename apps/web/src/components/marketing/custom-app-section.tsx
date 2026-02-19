"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Calendar,
  Dumbbell,
  Globe,
  Home,
  Search,
  Smartphone,
  User,
} from "lucide-react";
import { useState } from "react";

import { AnimationWrapper, BlurFadeIn } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// --- FAKE SCREENS ---

function AppHomeScreen() {
  return (
    <div className="bg-white pb-6 pt-8">
      <div className="flex items-center justify-between px-5 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-peec-dark">
          <span className="text-[9px] font-bold text-white">IF</span>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-stone-400" />
          <div className="h-6 w-6 rounded-full bg-stone-200" />
        </div>
      </div>

      <div className="px-5 pb-3">
        <p className="text-[9px] text-stone-400">Good morning</p>
        <p className="text-xs font-semibold text-stone-900">Sarah Johnson</p>
      </div>

      <div className="px-5 pb-3">
        <div className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-[10px] font-medium text-white">Quick Check-in</span>
        </div>
      </div>

      <div className="px-5 pb-3">
        <p className="mb-1.5 text-[8px] font-medium uppercase tracking-wider text-stone-400">
          Next Class
        </p>
        <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-900">HIIT Burn</span>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[8px] font-medium text-green-700">
              Booked
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-stone-500">
            <span>9:00 AM</span>
            <span className="h-0.5 w-0.5 rounded-full bg-stone-300" />
            <span>Coach Mike</span>
            <span className="h-0.5 w-0.5 rounded-full bg-stone-300" />
            <span>3 spots left</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 pb-3">
        {[
          { val: "12", label: "This month" },
          { val: "5", label: "Day streak" },
          { val: "8h", label: "Total time" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-stone-50 p-2 text-center">
            <p className="text-xs font-bold text-stone-900">{s.val}</p>
            <p className="text-[8px] text-stone-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 px-4 pt-2">
        <div className="flex items-center justify-around">
          {(
            [
              [Home, "Home", true],
              [Calendar, "Classes", false],
              [Dumbbell, "Workouts", false],
              [User, "Profile", false],
            ] as const
          ).map(([Icon, label, active]) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <Icon className={`h-3.5 w-3.5 ${active ? "text-stone-900" : "text-stone-300"}`} />
              <span className={`text-[7px] ${active ? "font-medium text-stone-900" : "text-stone-400"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WebBookingScreen() {
  return (
    <div className="bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-stone-100 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 rounded-lg bg-stone-50 px-4 py-1.5 text-center">
          <span className="text-[9px] text-stone-400">irontemple.com/book</span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-900">Book a Class</p>
            <p className="text-[9px] text-stone-400">Iron Temple Fitness — Downtown</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-stone-200" />
            <span className="text-[9px] text-stone-600">Sarah J.</span>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          {["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16"].map((d, i) => (
            <div
              key={d}
              className={`flex-1 rounded-lg py-2 text-center text-[9px] ${
                i === 2 ? "bg-stone-900 font-medium text-white" : "border border-stone-100 text-stone-600"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { name: "HIIT Burn", time: "6:00 AM", spots: 4, coach: "Mike" },
            { name: "Power Yoga", time: "8:30 AM", spots: 8, coach: "Sarah" },
            { name: "Spin Class", time: "12:00 PM", spots: 2, coach: "Alex" },
            { name: "Strength", time: "5:30 PM", spots: 6, coach: "Mike" },
          ].map((cls) => (
            <div key={cls.name} className="rounded-xl border border-stone-100 p-3">
              <p className="text-[10px] font-semibold text-stone-900">{cls.name}</p>
              <p className="mb-2.5 text-[8px] text-stone-400">
                {cls.time} &middot; {cls.coach}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-stone-400">{cls.spots} spots</span>
                <span className="rounded-lg bg-stone-900 px-2.5 py-1 text-[8px] font-medium text-white">
                  Book
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WebDashboardScreen() {
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-peec-dark">
            <span className="text-[8px] font-bold text-white">G</span>
          </div>
          <span className="text-[11px] font-semibold text-stone-900">Iron Temple</span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-stone-400" />
          <div className="h-6 w-6 rounded-full bg-stone-200" />
        </div>
      </div>

      <div className="flex">
        <div className="w-[110px] shrink-0 border-r border-stone-100 bg-stone-50 p-3">
          {["Overview", "Members", "Classes", "Payments", "AI Insights"].map((item, i) => (
            <div
              key={item}
              className={`mb-0.5 rounded-lg px-2.5 py-1.5 text-[9px] ${
                i === 0
                  ? "bg-white font-medium text-stone-900 shadow-sm"
                  : "text-stone-400"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex-1 p-4">
          <div className="mb-3 grid grid-cols-4 gap-2">
            {[
              { label: "Members", value: "847", change: "+5.2%" },
              { label: "Revenue", value: "$42K", change: "+12%" },
              { label: "Retention", value: "92%", change: "+3.1%" },
              { label: "Check-ins", value: "2.4K", change: "+8%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-stone-100 bg-white p-2.5">
                <p className="text-[8px] text-stone-400">{stat.label}</p>
                <p className="text-xs font-bold text-stone-900">{stat.value}</p>
                <p className="text-[8px] font-medium text-green-600">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="mb-3 rounded-xl border border-stone-100 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-stone-900">Revenue Trend</span>
              <div className="flex gap-1">
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[8px] text-stone-500">6M</span>
                <span className="rounded-md bg-stone-900 px-2 py-0.5 text-[8px] text-white">1Y</span>
              </div>
            </div>
            <svg viewBox="0 0 300 60" className="h-14 w-full">
              <defs>
                <linearGradient id="stackedChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#171717" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#171717" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="0,55 30,48 60,45 90,42 120,38 150,35 180,30 210,28 240,22 270,18 300,12 300,60 0,60"
                fill="url(#stackedChartGrad)"
              />
              <polyline
                points="0,55 30,48 60,45 90,42 120,38 150,35 180,30 210,28 240,22 270,18 300,12"
                fill="none"
                stroke="#171717"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="rounded-xl border border-stone-100 bg-white p-3">
            <p className="mb-2 text-[9px] font-semibold text-stone-900">Recent Members</p>
            <div className="space-y-1">
              {[
                { name: "Sarah J.", plan: "Premium", status: "Active" },
                { name: "Mike T.", plan: "24/7 Access", status: "Active" },
                { name: "Lisa K.", plan: "PT Package", status: "At Risk" },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between rounded-lg bg-stone-50 px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-stone-200" />
                    <span className="text-[9px] text-stone-900">{m.name}</span>
                  </div>
                  <span className="text-[8px] text-stone-400">{m.plan}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[7px] font-medium ${
                      m.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FEATURE DATA ---

interface Feature {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  screen: ReactNode;
}

const features: Feature[] = [
  {
    icon: Smartphone,
    badge: "Mobile App",
    title: "A branded app members actually love",
    description:
      "Your logo, your colors, your identity. Members open YOUR app — not a generic template with a swapped logo. Check-ins, class booking, and engagement built in.",
    screen: <AppHomeScreen />,
  },
  {
    icon: Globe,
    badge: "Web Platform",
    title: "A custom website that converts",
    description:
      "Online class booking, member portals, and lead capture — all on your own domain. Designed and built from scratch for your brand.",
    screen: <WebBookingScreen />,
  },
  {
    icon: BarChart3,
    badge: "Owner Dashboard",
    title: "Your command center for everything",
    description:
      "Revenue, retention, churn prediction, AI insights — all in one dashboard. Built custom for how you run your gym, not a one-size-fits-all admin panel.",
    screen: <WebDashboardScreen />,
  },
];

// Stacking config: position offsets and rotation for each layer
const stackPositions = [
  { x: -30, y: 20, rotate: -4, scale: 0.94 },  // back-left
  { x: 30, y: 10, rotate: 3, scale: 0.97 },     // back-right
  { x: 0, y: 0, rotate: 0, scale: 1 },           // front-center
];

// --- STACKED SCREENSHOTS ---

function StackedScreenshots({
  activeIndex,
  onHover,
}: {
  activeIndex: number;
  onHover: (index: number) => void;
}) {
  // Build render order: inactive screens first, active screen last (on top)
  const order = features
    .map((_, i) => i)
    .sort((a, b) => {
      if (a === activeIndex) return 1;
      if (b === activeIndex) return -1;
      return a - b;
    });

  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[480px] tablet:h-[420px]">
      {order.map((featureIndex, renderIndex) => {
        const feature = features[featureIndex];
        const isActive = featureIndex === activeIndex;
        const pos = isActive
          ? stackPositions[2]
          : renderIndex === 0
            ? stackPositions[0]
            : stackPositions[1];

        if (!feature || !pos) return null;

        // Phone frame for mobile app, browser frame for web
        const isPhone = featureIndex === 0;

        return (
          <motion.div
            key={featureIndex}
            className="absolute inset-0 cursor-pointer"
            style={{ zIndex: renderIndex + 1 }}
            animate={{
              x: pos.x,
              y: pos.y,
              rotate: pos.rotate,
              scale: pos.scale,
              opacity: isActive ? 1 : 0.55,
            }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onMouseEnter={() => onHover(featureIndex)}
          >
            {isPhone ? (
              /* Phone frame */
              <div className="mx-auto w-[220px] tablet:w-[240px]">
                <div className="relative rounded-[36px] border-[7px] border-stone-800 bg-stone-900 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                  <div className="absolute left-1/2 top-1.5 z-20 h-[24px] w-[88px] -translate-x-1/2 rounded-full bg-stone-900" />
                  <div className="overflow-hidden rounded-[29px]">
                    {feature.screen}
                  </div>
                </div>
              </div>
            ) : (
              /* Browser frame */
              <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                {feature.screen}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// --- FEATURE TABS ---

function FeatureTabs({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {features.map((feature, i) => {
        const isActive = i === activeIndex;
        const IconComponent = feature.icon;
        return (
          <button
            key={feature.badge}
            type="button"
            className={`group flex items-start gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
              isActive
                ? "border-peec-border-light bg-white shadow-card"
                : "border-transparent bg-transparent hover:bg-stone-50/50"
            }`}
            onMouseEnter={() => onSelect(i)}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                isActive ? "bg-peec-dark" : "bg-stone-100"
              }`}
            >
              <IconComponent
                className={`h-4 w-4 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-stone-400"
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isActive ? "text-peec-dark" : "text-peec-text-tertiary"
                  }`}
                >
                  {feature.title}
                </h3>
              </div>
              <motion.div
                initial={false}
                animate={{
                  height: isActive ? "auto" : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <p className="mt-1.5 text-sm leading-relaxed text-peec-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// --- MAIN SECTION ---

export function CustomAppSection() {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <SectionContainer id="custom-app">
      {/* Section header */}
      <AnimationWrapper>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium text-peec-red">Custom Development</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
            Your gym deserves its own platform — not a template
          </h2>
          <p className="text-base text-peec-text-secondary">
            We design and build custom mobile apps, websites, and dashboards from scratch.
            Not a whitelabeled template — a real product that reflects who you are.
          </p>
        </div>
      </AnimationWrapper>

      {/* Content: tabs left, stacked screenshots right */}
      <BlurFadeIn delay={0.15}>
        <div className="flex flex-col items-center gap-10 desktop:flex-row desktop:items-start desktop:gap-16">
          {/* Left: feature tabs */}
          <div className="w-full max-w-md shrink-0 desktop:w-[380px]">
            <FeatureTabs activeIndex={activeIndex} onSelect={setActiveIndex} />
          </div>

          {/* Right: stacked screenshots */}
          <div className="w-full flex-1">
            <StackedScreenshots activeIndex={activeIndex} onHover={setActiveIndex} />
          </div>
        </div>
      </BlurFadeIn>
    </SectionContainer>
  );
}
