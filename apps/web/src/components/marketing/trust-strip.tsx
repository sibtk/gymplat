"use client";

import { AnimationWrapper } from "./animation-wrapper";

const brands = [
  "FitLife",
  "IronWorks",
  "24/7 Fitness",
  "CrossFit Hub",
  "Peak Performance",
  "FlexZone",
  "Anytime Gym",
  "PowerHouse",
];

export function TrustStrip() {
  return (
    <section className="py-12">
      <AnimationWrapper>
        <p className="mb-8 text-center text-sm font-medium text-peec-text-tertiary">
          Trusted by 500+ gyms across the country
        </p>
      </AnimationWrapper>

      <div className="group relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#f7f7f7] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#f7f7f7] to-transparent" />

        <div className="marquee-track flex w-max gap-16 group-hover:[animation-play-state:paused]">
          {/* First set */}
          {brands.map((brand) => (
            <span
              key={`a-${brand}`}
              className="shrink-0 text-xl font-semibold text-[#c4c4c4] transition-colors hover:text-[#999]"
            >
              {brand}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {brands.map((brand) => (
            <span
              key={`b-${brand}`}
              className="shrink-0 text-xl font-semibold text-[#c4c4c4] transition-colors hover:text-[#999]"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
