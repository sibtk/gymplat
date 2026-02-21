"use client";

import { Dumbbell, Flame, Mountain, Shield, Star, Timer, Trophy, Zap } from "lucide-react";

import { AnimationWrapper } from "./animation-wrapper";

import type { LucideIcon } from "lucide-react";

const brands: { name: string; icon: LucideIcon }[] = [
  { name: "FitLife", icon: Flame },
  { name: "IronWorks", icon: Dumbbell },
  { name: "24/7 Fitness", icon: Timer },
  { name: "CrossFit Hub", icon: Zap },
  { name: "Peak Performance", icon: Mountain },
  { name: "FlexZone", icon: Star },
  { name: "Anytime Gym", icon: Shield },
  { name: "PowerHouse", icon: Trophy },
];

function BrandLogo({ name, icon: Icon }: { name: string; icon: LucideIcon }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-70">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100">
        <Icon className="h-4 w-4 text-stone-400" />
      </div>
      <span className="text-base font-semibold text-[#c4c4c4]">{name}</span>
    </div>
  );
}

export function TrustStrip() {
  return (
    <section className="py-12">
      <AnimationWrapper>
        <p className="mb-8 text-center text-sm font-medium text-peec-text-tertiary">
          Trusted by 500+ gyms and studios nationwide
        </p>
      </AnimationWrapper>

      <div className="group relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#f7f7f7] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#f7f7f7] to-transparent" />

        <div className="marquee-track flex w-max items-center gap-16 group-hover:[animation-play-state:paused]">
          {/* First set */}
          {brands.map((brand) => (
            <BrandLogo key={`a-${brand.name}`} name={brand.name} icon={brand.icon} />
          ))}
          {/* Duplicate for seamless loop */}
          {brands.map((brand) => (
            <BrandLogo key={`b-${brand.name}`} name={brand.name} icon={brand.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}
