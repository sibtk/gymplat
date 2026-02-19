"use client";

import { Bell, Menu, Search } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-peec-border-light bg-white px-4 tablet:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark tablet:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-peec-border-light bg-stone-50 px-3 py-1.5 tablet:flex">
          <Search className="h-3.5 w-3.5 text-peec-text-muted" />
          <span className="text-xs text-peec-text-muted">Search...</span>
          <kbd className="ml-8 rounded border border-peec-border-light bg-white px-1.5 py-0.5 text-2xs text-peec-text-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-1.5 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-peec-red" />
        </button>

        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-peec-dark text-xs font-medium text-white">
          A
        </div>
      </div>
    </header>
  );
}
