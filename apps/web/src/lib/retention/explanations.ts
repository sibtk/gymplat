import type { ExplanationFactor, RiskExplanation, RiskSignal } from "./types";
import type { MemberFull } from "@/lib/types";

// ─── Explanation Generator ────────────────────────────────────

export function generateExplanation(
  member: MemberFull,
  signals: RiskSignal[],
  compositeScore: number,
): RiskExplanation {
  // Rank signals by weighted impact (score * weight)
  const ranked = [...signals]
    .map((s) => ({ signal: s, impact: s.score * s.weight }))
    .sort((a, b) => b.impact - a.impact);

  // Build factors
  const factors: ExplanationFactor[] = ranked.map((r) => ({
    signal: r.signal.label,
    description: describeSignal(r.signal),
    impact: Math.round((r.impact / Math.max(1, ranked.reduce((s, x) => s + x.impact, 0))) * 100),
  }));

  // Build natural language summary from top 2-3 factors
  const summary = buildSummary(member, ranked.slice(0, 3).map((r) => r.signal), compositeScore);

  return { summary, factors };
}

function describeSignal(signal: RiskSignal): string {
  switch (signal.id) {
    case "visit_frequency_decay": {
      const recent = signal.metadata["recentVisits"] as number;
      const prior = signal.metadata["priorVisits"] as number;
      if (prior === 0 && recent === 0) return "No recent visits in the last 4 weeks";
      if (prior > 0 && recent < prior) {
        const dropPct = Math.round((1 - recent / prior) * 100);
        return `Visit frequency dropped ${dropPct}% over 2 weeks`;
      }
      if (recent >= prior) return "Visit frequency is stable or improving";
      return `${recent} visits in last 2 weeks vs ${prior} in prior 2 weeks`;
    }

    case "days_since_last_visit": {
      const days = signal.metadata["daysSince"] as number;
      if (days < 0) return "No visit records found";
      if (days === 0) return "Visited today";
      if (days === 1) return "Last visited yesterday";
      return `Last visited ${days} days ago`;
    }

    case "visit_consistency": {
      const stdDev = signal.metadata["stdDev"] as number;
      if (stdDev < 2) return "Very consistent visit pattern";
      if (stdDev < 5) return "Moderately consistent visits";
      return "Irregular visit pattern with large gaps";
    }

    case "payment_failures": {
      const count = signal.metadata["failedCount"] as number;
      if (count === 0) return "No payment issues";
      return `${count} failed payment${count > 1 ? "s" : ""} in last 90 days`;
    }

    case "late_payments": {
      const count = signal.metadata["overdueCount"] as number;
      if (count === 0) return "All payments current";
      return `${count} overdue invoice${count > 1 ? "s" : ""}`;
    }

    case "plan_downgrade": {
      const cancel = signal.metadata["cancelAtEnd"] as number;
      if (cancel) return "Membership set to cancel at period end";
      if (signal.score > 40) return "Subscription status indicates potential issues";
      return "Plan status is stable";
    }

    case "class_participation": {
      const recent = signal.metadata["recentBookings"] as number;
      const prior = signal.metadata["priorBookings"] as number;
      if (recent === 0 && prior === 0) return "No class bookings";
      if (recent < prior) return "Class bookings declining";
      return `${recent} class bookings in last 30 days`;
    }

    case "engagement_diversity": {
      const classes = signal.metadata["classes"] as number;
      const pt = signal.metadata["pt"] as number;
      const checkIns = signal.metadata["checkIns"] as number;
      const types: string[] = [];
      if (checkIns) types.push("gym visits");
      if (classes) types.push("classes");
      if (pt) types.push("PT sessions");
      if (types.length === 0) return "No engagement activity detected";
      return `Engages through: ${types.join(", ")}`;
    }

    case "tenure_factor": {
      const months = signal.metadata["monthsTenure"] as number;
      if (months < 3) return `New member (${Math.round(months)} months) — higher churn risk window`;
      if (months < 12) return `${Math.round(months)} months tenure`;
      return `Loyal member — ${Math.round(months)} months tenure`;
    }

    case "renewal_proximity": {
      const days = signal.metadata["daysUntilRenewal"] as number;
      if (days < 0) return "No active subscription found";
      if (days <= 3) return `Renewal in ${days} days — critical window`;
      if (days <= 7) return `Renewal approaching in ${days} days`;
      return `${days} days until renewal`;
    }

    default:
      return signal.label;
  }
}

function buildSummary(
  member: MemberFull,
  topSignals: RiskSignal[],
  compositeScore: number,
): string {
  const firstName = member.name.split(" ")[0] ?? member.name;
  const parts: string[] = [];

  for (const signal of topSignals) {
    if (signal.score < 20) continue; // Skip low-risk signals

    switch (signal.id) {
      case "visit_frequency_decay": {
        const recent = signal.metadata["recentVisits"] as number;
        const prior = signal.metadata["priorVisits"] as number;
        if (prior > 0 && recent < prior) {
          const pct = Math.round((1 - recent / prior) * 100);
          parts.push(`visit frequency dropped ${pct}%`);
        } else if (recent === 0 && prior === 0) {
          parts.push("has no recent visits");
        }
        break;
      }
      case "days_since_last_visit": {
        const days = signal.metadata["daysSince"] as number;
        if (days > 7) parts.push(`hasn't visited in ${days} days`);
        break;
      }
      case "payment_failures": {
        const count = signal.metadata["failedCount"] as number;
        if (count > 0) parts.push(`has ${count} failed payment${count > 1 ? "s" : ""}`);
        break;
      }
      case "late_payments": {
        const count = signal.metadata["overdueCount"] as number;
        if (count > 0) parts.push(`has ${count} overdue invoice${count > 1 ? "s" : ""}`);
        break;
      }
      case "class_participation":
        if (signal.trend === "declining") parts.push("class attendance is declining");
        break;
      case "tenure_factor": {
        const months = signal.metadata["monthsTenure"] as number;
        if (months < 3) parts.push("is still in the critical first 3 months");
        break;
      }
      case "renewal_proximity": {
        const days = signal.metadata["daysUntilRenewal"] as number;
        if (days >= 0 && days <= 7) parts.push(`renewal coming up in ${days} days`);
        break;
      }
    }
  }

  if (parts.length === 0) {
    if (compositeScore < 25) return `${firstName} is in good standing with consistent engagement.`;
    return `${firstName} shows some minor risk signals worth monitoring.`;
  }

  const joined =
    parts.length === 1
      ? (parts[0] as string)
      : parts.length === 2
        ? `${parts[0]} and ${parts[1]}`
        : `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;

  return `${firstName} ${joined}.`;
}
