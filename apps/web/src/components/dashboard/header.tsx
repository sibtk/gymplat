"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { NotificationPanel } from "@/components/dashboard/notification-panel";
import { notificationsList } from "@/lib/mock-data";
import { useDashboardStore } from "@/lib/store";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { unreadCount, notifications, setNotifications } = useDashboardStore();

  // Initialize notifications
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(
        notificationsList.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          description: n.description,
          timestamp: n.timestamp,
          read: n.read,
        })),
      );
    }
  }, [notifications.length, setNotifications]);

  const toggleNotif = useCallback(() => setNotifOpen((prev) => !prev), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);

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

        {/* Date Range Picker */}
        <div className="hidden tablet:block">
          <DateRangePicker />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleNotif}
            className="relative rounded-lg p-1.5 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-peec-red text-[9px] font-medium text-white">
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
  );
}
