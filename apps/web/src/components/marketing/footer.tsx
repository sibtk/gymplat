import { Dumbbell } from "lucide-react";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "AI Retention", href: "#ai-retention" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Integrations",
    links: [
      { label: "Stripe", href: "#" },
      { label: "Kisi", href: "#" },
      { label: "Brivo", href: "#" },
      { label: "Zapier", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-peec-border-light bg-white px-6 py-16">
      <div className="mx-auto max-w-peec">
        <div className="mb-12 grid grid-cols-2 gap-8 tablet:grid-cols-6">
          <div className="col-span-2">
            <div className="mb-3 flex items-center gap-2 text-peec-dark">
              <Dumbbell className="h-5 w-5" />
              <span className="font-semibold">Ledger</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-peec-text-tertiary">
              AI-powered gym management for modern fitness businesses.
            </p>
          </div>

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

        <div className="border-t border-peec-border-light pt-8">
          <div className="flex flex-col items-center justify-between gap-4 tablet:flex-row">
            <p className="text-sm text-peec-text-tertiary">
              &copy; 2026 Ledger. All rights reserved.
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
    </footer>
  );
}
