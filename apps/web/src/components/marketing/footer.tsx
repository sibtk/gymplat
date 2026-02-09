import { Dumbbell } from "lucide-react";

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "Careers", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Docs", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Integrations",
    links: [
      { label: "Stripe", href: "#" },
      { label: "Kisi", href: "#" },
      { label: "Brivo", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Guides", href: "#" },
      { label: "API Docs", href: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { label: "x.com", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-peec-border-light bg-white px-6 py-16">
      <div className="mx-auto max-w-peec">
        <div className="mb-12 grid grid-cols-2 gap-8 tablet:grid-cols-6">
          {/* Logo + tagline */}
          <div className="col-span-2 tablet:col-span-1">
            <div className="mb-3 flex items-center gap-2 text-peec-dark">
              <Dumbbell className="h-5 w-5" />
              <span className="font-semibold">GymPlatform</span>
            </div>
            <p className="text-sm leading-relaxed text-peec-text-tertiary">
              AI-powered gym management platform for modern fitness businesses
            </p>
          </div>

          {/* Link columns */}
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

        {/* Bottom bar */}
        <div className="border-t border-peec-border-light pt-8">
          <div className="flex flex-col items-center justify-between gap-4 tablet:flex-row">
            <p className="text-sm text-peec-text-tertiary">
              &copy; 2026 GymPlatform. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-peec-text-tertiary hover:text-peec-dark">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-peec-text-tertiary hover:text-peec-dark">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-peec-text-tertiary hover:text-peec-dark">
                Imprint
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
