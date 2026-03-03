import { Button } from "@gym/ui";
import { Dumbbell } from "lucide-react";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "AI", href: "#ai-retention" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Docs", href: "#" },
    ],
  },
];

const integrations = ["Stripe", "Kisi", "Brivo", "Mindbody", "Zapier", "Google Calendar", "Mailchimp", "Twilio", "HubSpot", "Square"];

export function Footer() {
  return (
    <footer className="px-6">
      <div className="mx-auto max-w-peec">
        {/* CTA area */}
        <div className="relative">
          {/* Ambient glow behind CTA */}
          <div
            className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)",
            }}
          />
          <div
            className="glass-card-elevated rounded-2xl border border-white/[0.08] px-8 py-14 text-center"
            data-accent="multi"
          >
            <h2 className="relative z-10 mb-4 text-3xl font-medium tracking-tight text-peec-dark tablet:text-4xl">
              Ready to reduce churn?
            </h2>
            <p className="relative z-10 mb-8 text-base text-peec-text-secondary">
              Join 500+ gyms using LEDGR to predict and prevent member cancellations.
            </p>
            <Button variant="primary" size="pill" className="relative z-10">
              Get started free
            </Button>
          </div>
        </div>

        {/* Footer links */}
        <div className="border-t border-white/[0.06]">
          <div className="flex flex-col justify-between gap-10 py-12 tablet:flex-row">
            {/* Left: logo + tagline */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-peec-dark">
                <Dumbbell className="h-5 w-5" />
                <span className="text-base font-semibold">LEDGR</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-peec-text-tertiary">
                AI-powered gym management for modern fitness businesses.
              </p>
            </div>

            {/* Right: 2 link columns */}
            <div className="flex gap-16">
              {footerColumns.map((col) => (
                <div key={col.title}>
                  <p className="mb-3 text-sm font-semibold text-peec-dark">{col.title}</p>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-sm text-peec-text-tertiary transition-colors hover:text-peec-dark"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Integration logos row — slow marquee */}
          <div className="relative overflow-hidden pb-8">
            <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
            <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
            <div className="animate-marquee flex w-max items-center gap-x-8 text-xs text-peec-text-muted">
              {[...integrations, ...integrations].map((name, i) => (
                <span key={`${name}-${i}`} className="flex items-center gap-8 whitespace-nowrap">
                  {name}
                  <span>&middot;</span>
                </span>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/[0.06] py-6">
            <div className="flex flex-col items-center justify-between gap-4 tablet:flex-row">
              <p className="text-sm text-peec-text-tertiary">
                &copy; 2026 LEDGR. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-peec-text-tertiary hover:text-peec-dark">
                  Privacy
                </a>
                <a href="#" className="text-sm text-peec-text-tertiary hover:text-peec-dark">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
