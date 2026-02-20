"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useGymStore } from "@/lib/store";

import type { ReactNode } from "react";

function getPageFromPath(pathname: string): string {
  if (pathname === "/dashboard") return "dashboard";
  const parts = pathname.split("/").filter(Boolean);
  // /dashboard/members → "members", /dashboard/analytics → "analytics", etc.
  return parts[1] ?? "dashboard";
}

export function CopilotContextProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const setCopilotContext = useGymStore((s) => s.setCopilotContext);

  useEffect(() => {
    const page = getPageFromPath(pathname);
    setCopilotContext({ page, memberId: null });
  }, [pathname, setCopilotContext]);

  return <>{children}</>;
}
