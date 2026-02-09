"use client";

const capabilitiesRow1 = [
  "How do you automate membership billing and dunning?",
  "What happens when a member's payment fails?",
  "How does 24/7 access control work without staff?",
  "Can members book classes from their phone?",
  "How do you track trainer performance and utilization?",
  "What reports does the owner dashboard include?",
];

const capabilitiesRow2 = [
  "How does multi-location management work?",
  "Can I migrate from Mindbody or Zen Planner?",
  "How do you handle family and corporate accounts?",
  "What integrations are available with GymPlatform?",
  "How does the member self-service portal work?",
  "Do you support waivers and digital contracts?",
];

function TickerRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div className={reverse ? "animate-ticker-reverse" : "animate-ticker"}>
        <div className="flex gap-3 whitespace-nowrap">
          {doubled.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="inline-flex items-center gap-3 rounded-full border border-peec-border-light bg-white px-4 py-2.5 shadow-card"
            >
              <span className="text-sm text-peec-text-secondary">{item}</span>
              <span className="shrink-0 rounded-full bg-peec-light px-3 py-1 text-xs font-medium text-peec-dark">
                Learn More
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CapabilitiesTicker() {
  return (
    <section className="overflow-hidden px-6 py-section">
      <div className="mx-auto mb-12 max-w-peec text-center">
        <h2 className="mx-auto max-w-3xl text-2xl font-bold tracking-tight text-peec-dark tablet:text-3xl">
          Every touchpoint is a chance to grow. Track the interactions that define your
          gym&apos;s success.
        </h2>
      </div>
      <div className="space-y-3">
        <TickerRow items={capabilitiesRow1} />
        <TickerRow items={capabilitiesRow2} reverse />
      </div>
    </section>
  );
}
