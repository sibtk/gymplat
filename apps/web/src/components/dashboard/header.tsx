"use client";

import { Bell, ListChecks, Menu, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CommandPalette } from "@/components/dashboard/command-palette";
import { CopilotSpotlight } from "@/components/dashboard/copilot-spotlight";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { NotificationPanel } from "@/components/dashboard/notification-panel";
import { useDashboardStore, useGymStore } from "@/lib/store";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const copilotOpen = useGymStore((s) => s.copilotOpen);
  const setCopilotOpen = useGymStore((s) => s.setCopilotOpen);
  const unreadCount = useDashboardStore((s) => s.unreadCount);
  const interventions = useGymStore((s) => s.interventions);
  const riskAssessments = useGymStore((s) => s.riskAssessments);

  const pendingActions =
    interventions.filter((i) => i.status === "recommended").length ||
    Object.values(riskAssessments).filter(
      (a) => a.recommendedInterventions.length > 0 && (a.riskLevel === "high" || a.riskLevel === "critical"),
    ).length;

  // Cmd+K shortcut → command palette, Cmd+J → copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setCopilotOpen(!copilotOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copilotOpen, setCopilotOpen]);

  const toggleNotif = useCallback(() => setNotifOpen((prev) => !prev), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);

  return (
    <>
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

          {/* Search — opens command palette */}
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-peec-border-light bg-stone-50 px-3 py-1.5 tablet:flex"
          >
            <Search className="h-3.5 w-3.5 text-peec-text-muted" />
            <span className="text-xs text-peec-text-muted">Search...</span>
            <kbd className="ml-8 rounded border border-peec-border-light bg-white px-1.5 py-0.5 text-2xs text-peec-text-muted">
              ⌘K
            </kbd>
          </button>

          {/* Copilot shortcut */}
          <button
            type="button"
            onClick={() => setCopilotOpen(true)}
            className="hidden items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50/50 px-2.5 py-1.5 tablet:flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span className="text-xs text-purple-700">AI</span>
            <kbd className="ml-1 rounded border border-purple-200 bg-white px-1.5 py-0.5 text-2xs text-purple-400">
              ⌘J
            </kbd>
          </button>

          {/* Date Range Picker */}
          <div className="hidden tablet:block">
            <DateRangePicker />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Queue badge */}
          {pendingActions > 0 && (
            <Link
              href={"/dashboard/action-queue" as string}
              className="relative flex items-center gap-1.5 rounded-lg border border-peec-border-light p-1.5 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
            >
              <ListChecks className="h-4.5 w-4.5" />
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-2xs font-medium text-white">
                {pendingActions}
              </span>
            </Link>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleNotif}
              className="relative rounded-lg p-1.5 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-peec-red px-0.5 text-[9px] font-medium leading-none text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel open={notifOpen} onClose={closeNotif} />
          </div>

          {/* User avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-peec-dark text-xs font-medium text-white">
            A
          </div>
        </div>
      </header>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <CopilotSpotlight
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />
    </>
  );
}
