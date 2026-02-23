"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { PulseDot } from "@/components/dashboard/motion";
import {
  IconCalendar,
  IconChat,
  IconChecklist,
  IconDocument,
  IconDumbbell,
  IconGraphUp,
  IconHome,
  IconLogout,
  IconMoney,
  IconSettings,
  IconShield,
  IconUsers,
} from "@/components/icons";
import { logout } from "@/lib/auth";
import { useGymStore } from "@/lib/store";

const mainNav = [
  { label: "Overview", href: "/dashboard", icon: IconHome, iconColor: "text-stone-500" },
  { label: "Members", href: "/dashboard/members", icon: IconUsers, iconColor: "text-blue-500" },
  { label: "Analytics", href: "/dashboard/analytics", icon: IconGraphUp, iconColor: "text-emerald-500" },
  { label: "Retention Intelligence", href: "/dashboard/insights", icon: IconShield, iconColor: "text-rose-500" },
  { label: "Action Queue", href: "/dashboard/action-queue", icon: IconChecklist, iconColor: "text-amber-500" },
  { label: "Payments", href: "/dashboard/payments", icon: IconMoney, iconColor: "text-green-500" },
] as const;

const toolsNav = [
  { label: "Classes", href: "/dashboard/classes", icon: IconCalendar, iconColor: "text-violet-500" },
  { label: "Communication", href: "/dashboard/communication", icon: IconChat, iconColor: "text-cyan-500" },
  { label: "Reports", href: "/dashboard/reports", icon: IconDocument, iconColor: "text-stone-500" },
  { label: "Settings", href: "/dashboard/settings", icon: IconSettings, iconColor: "text-stone-500" },
] as const;

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const interventions = useGymStore((s) => s.interventions);
  const riskAssessments = useGymStore((s) => s.riskAssessments);

  const pendingActionCount =
    interventions.filter((i) => i.status === "recommended").length ||
    Object.values(riskAssessments).filter(
      (a) => a.recommendedInterventions.length > 0 && (a.riskLevel === "high" || a.riskLevel === "critical"),
    ).length;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push("/login" as string);
  };

  const linkClass = (href: string) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive(href)
        ? "border border-peec-border-light bg-white font-medium text-peec-dark shadow-sm"
        : "text-peec-text-muted hover:bg-stone-100 hover:text-peec-dark"
    }`;

  return (
    <div className="flex h-full flex-col bg-stone-50">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-peec-border-light px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-peec-dark">
            <IconDumbbell className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-peec-dark">Ledger</span>
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
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Main section */}
        <p className="mb-2 px-3 text-2xs font-medium text-peec-text-muted/60">
          Main
        </p>
        <div className="flex flex-col gap-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href as string}
                onClick={onClose}
                className={linkClass(item.href)}
              >
                <Icon className={`h-4 w-4 ${active ? "" : item.iconColor}`} />
                {item.label}
                {item.label === "Overview" && !mobile && (
                  <PulseDot className="ml-auto" />
                )}
                {item.label === "Action Queue" && pendingActionCount > 0 && (
                  <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-2xs font-medium text-white">
                    {pendingActionCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-peec-border-light" />

        {/* Tools section */}
        <p className="mb-2 px-3 text-2xs font-medium text-peec-text-muted/60">
          Tools
        </p>
        <div className="flex flex-col gap-0.5">
          {toolsNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href as string}
                onClick={onClose}
                className={linkClass(item.href)}
              >
                <Icon className={`h-4 w-4 ${active ? "" : item.iconColor}`} />
                {item.label}
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
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-peec-text-muted transition-colors hover:bg-stone-100 hover:text-peec-dark"
        >
          <IconLogout className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
