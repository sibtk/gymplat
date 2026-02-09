"use client";

import { AnimationWrapper } from "./animation-wrapper";

const brands = [
  "FitLife",
  "IronWorks",
  "24/7 Fitness",
  "CrossFit Hub",
  "Peak Performance",
  "FlexZone",
];

export function TrustStrip() {
  return (
    <section className="px-6 py-12">
      <AnimationWrapper>
        <div className="mx-auto max-w-peec text-center">
          <p className="mb-8 text-sm font-medium text-peec-text-tertiary">
            Trusted by 500+ gyms across the country
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-lg font-semibold text-[#c4c4c4] transition-colors hover:text-[#999]"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
}
