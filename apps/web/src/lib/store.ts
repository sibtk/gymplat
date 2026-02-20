import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────────

export type DateRange = "7d" | "30d" | "90d" | "1y";

export interface Notification {
  id: string;
  type: "alert" | "payment" | "member" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

// ─── Store ───────────────────────────────────────────────────────

interface DashboardStore {
  // Date range
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;

  // Live counter
  checkedInCount: number;
  setCheckedInCount: (count: number) => void;
  incrementCheckedIn: (delta: number) => void;

  // Refresh
  lastUpdatedAt: Date;
  refreshTimestamp: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Date range
  dateRange: "30d",
  setDateRange: (range) => set({ dateRange: range }),

  // Notifications
  notifications: [],
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  unreadCount: 0,
  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
    });
  },
  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
  },

  // Live counter
  checkedInCount: 47,
  setCheckedInCount: (count) => set({ checkedInCount: count }),
  incrementCheckedIn: (delta) =>
    set((state) => ({ checkedInCount: Math.max(0, state.checkedInCount + delta) })),

  // Refresh
  lastUpdatedAt: new Date(),
  refreshTimestamp: () => set({ lastUpdatedAt: new Date() }),
}));
