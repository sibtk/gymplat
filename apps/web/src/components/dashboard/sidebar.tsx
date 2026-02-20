"use client";

import {
  Brain,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { PulseDot } from "@/components/dashboard/motion";
import { logout } from "@/lib/auth";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/dashboard/members", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { label: "AI Insights", href: "/dashboard/insights", icon: Brain },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push("/login" as string);
  };

  return (
    <div className="flex h-full flex-col bg-stone-50">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-peec-border-light px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-peec-dark">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-peec-dark">GymPlatform</span>
        </div>
        {mobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-3 text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
          Pages
        </p>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href as string}
                onClick={onClose}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "border border-peec-border-light bg-white font-medium text-peec-dark shadow-sm"
                    : "text-peec-text-tertiary hover:bg-stone-100 hover:text-peec-dark"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.label === "Overview" && !mobile && (
                  <PulseDot className="ml-auto" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-peec-border-light p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-peec-text-tertiary transition-colors hover:bg-stone-100 hover:text-peec-dark"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
