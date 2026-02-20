"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

import { CopilotContextProvider } from "@/components/dashboard/copilot-context-provider";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { SimulationControls } from "@/components/dashboard/simulation-controls";
import { ToastProvider } from "@/components/dashboard/toast";
import { useStoreInit } from "@/lib/use-store-init";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasHydrated = useStoreInit();

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <ToastProvider>
      <CopilotContextProvider>
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
              {!hasHydrated ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-peec-dark border-t-transparent" />
                </div>
              ) : (
                children
              )}
            </main>
          </div>

          <SimulationControls />
        </div>
      </CopilotContextProvider>
    </ToastProvider>
  );
}
