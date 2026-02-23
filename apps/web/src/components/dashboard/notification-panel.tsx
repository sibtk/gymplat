"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Bell, CreditCard, Settings, User } from "lucide-react";
import { useEffect, useRef } from "react";

import { useDashboardStore } from "@/lib/store";

import type { Notification } from "@/lib/store";

function notificationIcon(type: Notification["type"]) {
  switch (type) {
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "payment":
      return <CreditCard className="h-4 w-4 text-green-500" />;
    case "member":
      return <User className="h-4 w-4 text-blue-500" />;
    case "system":
      return <Settings className="h-4 w-4 text-stone-500" />;
  }
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const notifications = useDashboardStore((s) => s.notifications);
  const unreadCount = useDashboardStore((s) => s.unreadCount);
  const markAsRead = useDashboardStore((s) => s.markAsRead);
  const markAllAsRead = useDashboardStore((s) => s.markAllAsRead);
  const panelRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-peec-border-light bg-white shadow-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-peec-border-light px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-peec-text-muted" />
              <span className="text-sm font-semibold text-peec-dark">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-peec-dark px-1.5 py-0.5 text-2xs text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-2xs font-medium text-peec-text-secondary hover:text-peec-dark"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markAsRead(n.id)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50 ${
                  !n.read ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">{notificationIcon(n.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-peec-dark">{n.title}</p>
                    {!n.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-2xs text-peec-text-muted">{n.description}</p>
                  <p className="mt-1 text-2xs text-peec-text-muted">{n.timestamp}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
