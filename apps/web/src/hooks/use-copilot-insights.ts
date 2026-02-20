"use client";

import { useMemo } from "react";

import { useGymStore } from "@/lib/store";

import type { CopilotInsight } from "@/lib/retention/types";

export function useCopilotInsights(
  page: string,
  memberId?: string | null,
): CopilotInsight[] {
  const insights = useGymStore((s) => s.copilotInsights);

  return useMemo(() => {
    return insights.filter((i) => {
      if (i.dismissed) return false;
      // Show global insights + page-specific
      if (i.page !== null && i.page !== page) return false;
      // If memberId filter is set, match
      if (memberId && i.relatedMemberId && i.relatedMemberId !== memberId) return false;
      return true;
    });
  }, [insights, page, memberId]);
}
