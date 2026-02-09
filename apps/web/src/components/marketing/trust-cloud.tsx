"use client";

import { AnimationWrapper } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const brands = [
  "FitLife",
  "IronWorks",
  "24/7 Fitness",
  "CrossFit Hub",
  "Peak Performance",
  "FlexZone",
];

export function TrustCloud() {
  return (
    <SectionContainer>
      <AnimationWrapper>
        <div className="text-center">
          <p className="mb-6 text-sm font-medium text-peec-text-tertiary">
            Trusted by 500+ gyms across the country
          </p>
          <div className="mb-8 flex items-center justify-center gap-2">
            <span className="rounded-full bg-peec-dark px-4 py-1.5 text-sm text-white">Gyms</span>
            <span className="rounded-full border border-peec-border-light px-4 py-1.5 text-sm text-peec-text-tertiary">
              Studios
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
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
    </SectionContainer>
  );
}
