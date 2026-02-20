"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ToastProvider } from "@/components/dashboard/toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-stone-50">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-peec-border-light tablet:block">
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeSidebar}
              />
              <motion.aside
                className="fixed inset-y-0 left-0 z-50 w-60"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <Sidebar mobile onClose={closeSidebar} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <Header onMenuToggle={toggleSidebar} />
          <main className="flex-1 overflow-auto p-4 tablet:p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
