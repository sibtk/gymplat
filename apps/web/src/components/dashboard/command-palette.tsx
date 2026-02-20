"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useGymStore } from "@/lib/store";
import { getInitials } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  section: "Pages" | "Members" | "Actions";
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const members = useGymStore((s) => s.members);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      onClose();
    },
    [router, onClose],
  );

  const items = useMemo<CommandItem[]>(() => {
    const pages: CommandItem[] = [
      { id: "p-overview", label: "Dashboard Overview", section: "Pages", icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate("/dashboard") },
      { id: "p-members", label: "Members", section: "Pages", icon: <Users className="h-4 w-4" />, action: () => navigate("/dashboard/members") },
      { id: "p-analytics", label: "Analytics", section: "Pages", icon: <BarChart3 className="h-4 w-4" />, action: () => navigate("/dashboard/analytics") },
      { id: "p-insights", label: "AI Insights", section: "Pages", icon: <Sparkles className="h-4 w-4" />, action: () => navigate("/dashboard/insights") },
      { id: "p-payments", label: "Payments", section: "Pages", icon: <CreditCard className="h-4 w-4" />, action: () => navigate("/dashboard/payments") },
      { id: "p-classes", label: "Classes", section: "Pages", icon: <CalendarDays className="h-4 w-4" />, action: () => navigate("/dashboard/classes") },
      { id: "p-communication", label: "Communication", section: "Pages", icon: <MessageSquare className="h-4 w-4" />, action: () => navigate("/dashboard/communication") },
      { id: "p-reports", label: "Reports", section: "Pages", icon: <FileBarChart className="h-4 w-4" />, action: () => navigate("/dashboard/reports") },
      { id: "p-settings", label: "Settings", section: "Pages", icon: <Settings className="h-4 w-4" />, action: () => navigate("/dashboard/settings") },
    ];

    const memberItems: CommandItem[] = members.slice(0, 10).map((m) => ({
      id: `m-${m.id}`,
      label: m.name,
      section: "Members",
      icon: (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-[8px] font-medium text-peec-dark">
          {getInitials(m.name)}
        </div>
      ),
      action: () => navigate("/dashboard/members"),
    }));

    const actions: CommandItem[] = [
      { id: "a-add-member", label: "Add New Member", section: "Actions", icon: <UserPlus className="h-4 w-4" />, action: () => navigate("/dashboard/members") },
    ];

    return [...pages, ...memberItems, ...actions];
  }, [members, navigate]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const sections = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const group = map.get(item.section) ?? [];
      group.push(item);
      map.set(item.section, group);
    }
    return map;
  }, [filtered]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[selectedIndex];
        if (item) {
          item.action();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filtered, selectedIndex, onClose],
  );

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 top-[15%] z-[71] mx-auto w-full max-w-lg px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            <div className="overflow-hidden rounded-xl border border-peec-border-light bg-white shadow-xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-peec-border-light px-4 py-3">
                <Search className="h-4 w-4 text-peec-text-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-peec-dark placeholder:text-peec-text-muted focus:outline-none"
                  placeholder="Search pages, members, and actions..."
                />
                <kbd className="rounded border border-peec-border-light bg-stone-50 px-1.5 py-0.5 text-2xs text-peec-text-muted">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <p className="p-4 text-center text-xs text-peec-text-muted">No results found</p>
                )}
                {Array.from(sections.entries()).map(([section, sectionItems]) => (
                  <div key={section}>
                    <p className="px-2 pb-1 pt-2 text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                      {section}
                    </p>
                    {sectionItems.map((item) => {
                      flatIndex++;
                      const idx = flatIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={item.action}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                            idx === selectedIndex ? "bg-stone-100" : "hover:bg-stone-50"
                          }`}
                        >
                          <span className="text-peec-text-muted">{item.icon}</span>
                          <span className="text-sm text-peec-dark">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 border-t border-peec-border-light bg-stone-50/50 px-4 py-2">
                <span className="text-2xs text-peec-text-muted">
                  <kbd className="rounded border border-peec-border-light bg-white px-1 py-0.5 text-2xs">↑↓</kbd> navigate
                </span>
                <span className="text-2xs text-peec-text-muted">
                  <kbd className="rounded border border-peec-border-light bg-white px-1 py-0.5 text-2xs">↵</kbd> select
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
