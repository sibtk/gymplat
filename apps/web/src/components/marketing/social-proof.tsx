import { ScrollFadeIn } from "./animation-wrapper";
import { SectionContainer } from "./section-container";

const brands = [
  "FlexZone",
  "INVINCIBLE",
  "Peak Performance",
  "CorePower",
  "Summit Fitness",
  "Atlas Gym",
  "Elevate Studios",
  "Basecamp Training",
];

const quotes = [
  {
    text: "Our member retention jumped from 76% to 92% within 3 months.",
    name: "Amy Foster",
    role: "Founder, FlexZone Fitness",
    initial: "AF",
    color: "bg-rose-500/15 text-rose-400",
  },
  {
    text: "LEDGR predicted 14 cancellations last month. We saved 11 of them.",
    name: "Marcus Chen",
    role: "GM, INVINCIBLE Downtown",
    initial: "MC",
    color: "bg-blue-500/15 text-blue-400",
  },
];

export function SocialProof() {
  return (
    <SectionContainer className="py-14 tablet:py-20">
      {/* Logo strip */}
      <ScrollFadeIn>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-sm font-medium text-peec-text-muted/40 select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </ScrollFadeIn>

      {/* Pull quotes */}
      <div className="mt-14 grid grid-cols-1 gap-12 tablet:grid-cols-2">
        {quotes.map((quote) => (
          <ScrollFadeIn key={quote.name}>
            <blockquote className="mx-auto max-w-lg text-center">
              <p className="text-2xl font-medium leading-relaxed text-peec-dark">
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${quote.color}`}>
                  {quote.initial}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-peec-dark">{quote.name}</p>
                  <p className="text-sm text-peec-text-tertiary">{quote.role}</p>
                </div>
              </div>
            </blockquote>
          </ScrollFadeIn>
        ))}
      </div>
    </SectionContainer>
  );
}
