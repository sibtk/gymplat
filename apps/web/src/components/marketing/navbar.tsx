"use client";

import { Button } from "@gym/ui";
import { Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "AI", href: "#ai-retention" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-white/[0.06]">
      <div className="mx-auto flex max-w-peec items-center justify-between px-6 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-peec-dark">
          <Dumbbell className="h-5 w-5" />
          <span className="text-base font-semibold">LEDGR</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 tablet:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-peec-text-secondary transition-colors hover:text-peec-dark"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 tablet:flex">
          <a
            href="/login"
            className="text-sm font-medium text-peec-text-secondary transition-colors hover:text-peec-dark"
          >
            Log in
          </a>
          <Button variant="primary" size="pill">
            Get started
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-peec-dark tablet:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-black/90 backdrop-blur-2xl px-6 py-4 tablet:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-peec-text-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-white/[0.06]" />
            <a href="/login" className="text-sm font-medium text-peec-text-secondary">
              Log in
            </a>
            <Button variant="primary" size="pill" className="w-full">
              Get started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
