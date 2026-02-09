"use client";

import { Button } from "@gym/ui";
import { Dumbbell, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Pricing", href: "#pricing" },
  { label: "Features", href: "#features" },
  { label: "AI Retention", href: "#ai-retention" },
  { label: "Integrations", href: "#integrations" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top banner — light accent */}
      <div className="border-b border-peec-border-light bg-peec-light px-4 py-2 text-center text-sm text-peec-dark">
        <Sparkles className="mr-1.5 inline-block h-3.5 w-3.5 text-peec-dark" />
        AI-powered churn prediction now available — reduce member attrition by up to 35%
      </div>

      <nav className="sticky top-0 z-50 border-b border-peec-border-light bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-peec items-center justify-between px-6 py-3">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-peec-dark">
            <Dumbbell className="h-6 w-6" />
            <span className="text-lg font-semibold">GymPlatform</span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 tablet:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-peec-text-secondary transition-colors hover:text-peec-dark"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 tablet:flex">
            <a
              href="/login"
              className="text-sm text-peec-text-secondary transition-colors hover:text-peec-dark"
            >
              Log in
            </a>
            <Button variant="cta" size="pill">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="tablet:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-peec-border-light bg-white px-6 py-4 tablet:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-peec-text-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-peec-border-light" />
              <a href="/login" className="text-sm text-peec-text-secondary">
                Log in
              </a>
              <Button variant="cta" size="pill" className="w-full">
                Start Free Trial
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
