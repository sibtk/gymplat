"use client";

import { HelpCircle, X } from "lucide-react";
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

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badge?: "pulse" | "count";
}

const operationsNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: IconHome, iconColor: "text-stone-500", badge: "pulse" },
  { label: "Members", href: "/dashboard/members", icon: IconUsers, iconColor: "text-blue-500" },
  { label: "Classes", href: "/dashboard/classes", icon: IconCalendar, iconColor: "text-violet-500" },
];

const intelligenceNav: NavItem[] = [
  { label: "Analytics", href: "/dashboard/analytics", icon: IconGraphUp, iconColor: "text-emerald-500" },
  { label: "Retention Intelligence", href: "/dashboard/insights", icon: IconShield, iconColor: "text-rose-500" },
];

const financeNav: NavItem[] = [
  { label: "Payments", href: "/dashboard/payments", icon: IconMoney, iconColor: "text-green-500" },
  { label: "Reports", href: "/dashboard/reports", icon: IconDocument, iconColor: "text-stone-500" },
  { label: "Action Queue", href: "/dashboard/action-queue", icon: IconChecklist, iconColor: "text-amber-500", badge: "count" },
];

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
    router.push("/login");
  };

  const linkClass = (href: string) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive(href)
        ? "bg-white/[0.06] font-medium text-[#E5E5E5]"
        : "text-[#737373] hover:bg-white/[0.04] hover:text-[#A3A3A3]"
    }`;

  function renderNavSection(label: string, items: NavItem[]) {
    return (
      <div>
        <p className="mb-2 px-3 text-2xs font-medium uppercase tracking-wider text-[#525252]">
          {label}
        </p>
        <div className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={linkClass(item.href)}
              >
                <Icon className={`h-4 w-4 ${active ? item.iconColor : "text-[#737373]"}`} />
                {item.label}
                {item.badge === "pulse" && !mobile && (
                  <PulseDot className="ml-auto" />
                )}
                {item.badge === "count" && pendingActionCount > 0 && (
                  <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-2xs font-medium text-white">
                    {pendingActionCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#141414]">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08]">
            <IconDumbbell className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#E5E5E5]">LDGR</span>
            <p className="text-2xs text-[#525252]">Enterprise Plan</p>
          </div>
        </div>
        {mobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#737373] hover:bg-white/[0.04] hover:text-[#A3A3A3]"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {renderNavSection("Operations", operationsNav)}
        {renderNavSection("Intelligence", intelligenceNav)}
        {renderNavSection("Finance", financeNav)}
      </nav>

      {/* Bottom utility links */}
      <div className="border-t border-white/[0.06] px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <Link
            href={"/dashboard/communication" as string}
            onClick={onClose}
            className={linkClass("/dashboard/communication")}
          >
            <IconChat className={`h-4 w-4 ${isActive("/dashboard/communication") ? "text-cyan-500" : "text-[#737373]"}`} />
            Communication
          </Link>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#737373] transition-colors hover:bg-white/[0.04] hover:text-[#A3A3A3]"
          >
            <HelpCircle className="h-4 w-4" />
            Support
          </button>
          <Link
            href={"/dashboard/settings" as string}
            onClick={onClose}
            className={linkClass("/dashboard/settings")}
          >
            <IconSettings className={`h-4 w-4 ${isActive("/dashboard/settings") ? "text-stone-500" : "text-[#737373]"}`} />
            Settings
          </Link>
        </div>
      </div>

      {/* User card */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-xs font-medium text-[#E5E5E5]">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#E5E5E5]">Admin User</p>
            <p className="truncate text-2xs text-[#525252]">admin@ldgr.com</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded p-1 text-[#525252] transition-colors hover:bg-white/[0.04] hover:text-[#737373]"
            title="Sign out"
          >
            <IconLogout className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
