// ─── Behavioral Seed Profiles ─────────────────────────────────
// Maps to the 22 existing members with distinct behavior patterns
// that produce meaningful engine scores.

export interface BehavioralProfile {
  memberId: string;
  memberName: string;
  checkInPattern: "consistent" | "declining" | "weekend_only" | "ceased" | "new_active" | "sporadic" | "improving";
  visitsPerWeek: number;       // target frequency
  declineRate: number;          // 0-1, how fast visits are declining
  paymentPattern: "perfect" | "one_failed" | "two_overdue" | "late_payer";
  engagementPattern: "full" | "gym_only" | "classes_declining" | "pt_active" | "minimal";
  lifecycleStage: "new" | "establishing" | "stable" | "veteran" | "approaching_renewal";
  monthsTenure: number;
  daysInactive: number;         // days since last check-in
}

// 22 profiles matching member indices 0-21
export const behavioralProfiles: BehavioralProfile[] = [
  // 0 - Sarah Chen (at-risk): declining visits, payment failed
  {
    memberId: "mem_1", memberName: "Sarah Chen",
    checkInPattern: "ceased", visitsPerWeek: 0, declineRate: 0.9,
    paymentPattern: "one_failed", engagementPattern: "classes_declining",
    lifecycleStage: "stable", monthsTenure: 24, daysInactive: 21,
  },
  // 1 - Mike Torres (at-risk): frequency dropped 60%
  {
    memberId: "mem_2", memberName: "Mike Torres",
    checkInPattern: "declining", visitsPerWeek: 1, declineRate: 0.7,
    paymentPattern: "perfect", engagementPattern: "gym_only",
    lifecycleStage: "stable", monthsTenure: 22, daysInactive: 18,
  },
  // 2 - Lisa Park (at-risk): no class bookings, complaint
  {
    memberId: "mem_3", memberName: "Lisa Park",
    checkInPattern: "declining", visitsPerWeek: 1, declineRate: 0.5,
    paymentPattern: "two_overdue", engagementPattern: "minimal",
    lifecycleStage: "veteran", monthsTenure: 27, daysInactive: 14,
  },
  // 3 - James Wilson (active): consistent, good member
  {
    memberId: "mem_4", memberName: "James Wilson",
    checkInPattern: "consistent", visitsPerWeek: 4, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "full",
    lifecycleStage: "stable", monthsTenure: 20, daysInactive: 0,
  },
  // 4 - Ana Rodriguez (at-risk): low engagement, student
  {
    memberId: "mem_5", memberName: "Ana Rodriguez",
    checkInPattern: "sporadic", visitsPerWeek: 1, declineRate: 0.3,
    paymentPattern: "one_failed", engagementPattern: "minimal",
    lifecycleStage: "establishing", monthsTenure: 5, daysInactive: 10,
  },
  // 5 - David Kim (active): PT member, consistent
  {
    memberId: "mem_6", memberName: "David Kim",
    checkInPattern: "consistent", visitsPerWeek: 5, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "pt_active",
    lifecycleStage: "stable", monthsTenure: 24, daysInactive: 1,
  },
  // 6 - Emma Brown (active): corporate, good engagement
  {
    memberId: "mem_7", memberName: "Emma Brown",
    checkInPattern: "consistent", visitsPerWeek: 3, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "full",
    lifecycleStage: "stable", monthsTenure: 18, daysInactive: 0,
  },
  // 7 - Ryan Lee (active): slightly declining
  {
    memberId: "mem_8", memberName: "Ryan Lee",
    checkInPattern: "declining", visitsPerWeek: 2, declineRate: 0.2,
    paymentPattern: "perfect", engagementPattern: "gym_only",
    lifecycleStage: "stable", monthsTenure: 22, daysInactive: 2,
  },
  // 8 - Nicole Adams (active): consistent Premium member
  {
    memberId: "mem_9", memberName: "Nicole Adams",
    checkInPattern: "consistent", visitsPerWeek: 4, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "full",
    lifecycleStage: "veteran", monthsTenure: 26, daysInactive: 0,
  },
  // 9 - Chris Taylor (churned): student who left
  {
    memberId: "mem_10", memberName: "Chris Taylor",
    checkInPattern: "ceased", visitsPerWeek: 0, declineRate: 1,
    paymentPattern: "two_overdue", engagementPattern: "minimal",
    lifecycleStage: "establishing", monthsTenure: 4, daysInactive: 45,
  },
  // 10 - Olivia Martinez (active): great engagement
  {
    memberId: "mem_11", memberName: "Olivia Martinez",
    checkInPattern: "consistent", visitsPerWeek: 5, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "full",
    lifecycleStage: "stable", monthsTenure: 21, daysInactive: 0,
  },
  // 11 - Ethan Wright (active): steady visitor
  {
    memberId: "mem_12", memberName: "Ethan Wright",
    checkInPattern: "consistent", visitsPerWeek: 3, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "gym_only",
    lifecycleStage: "stable", monthsTenure: 19, daysInactive: 1,
  },
  // 12 - Sophia Nguyen (active): corporate, new
  {
    memberId: "mem_13", memberName: "Sophia Nguyen",
    checkInPattern: "new_active", visitsPerWeek: 4, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "full",
    lifecycleStage: "new", monthsTenure: 1, daysInactive: 0,
  },
  // 13 - Liam Johnson (active): PT member, slightly irregular
  {
    memberId: "mem_14", memberName: "Liam Johnson",
    checkInPattern: "sporadic", visitsPerWeek: 3, declineRate: 0.1,
    paymentPattern: "perfect", engagementPattern: "pt_active",
    lifecycleStage: "new", monthsTenure: 2, daysInactive: 3,
  },
  // 14 - Ava Thompson (churned): student who left
  {
    memberId: "mem_15", memberName: "Ava Thompson",
    checkInPattern: "ceased", visitsPerWeek: 0, declineRate: 1,
    paymentPattern: "two_overdue", engagementPattern: "minimal",
    lifecycleStage: "establishing", monthsTenure: 5, daysInactive: 60,
  },
  // 15 - Noah Garcia (active): Premium, dedicated
  {
    memberId: "mem_16", memberName: "Noah Garcia",
    checkInPattern: "consistent", visitsPerWeek: 5, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "full",
    lifecycleStage: "establishing", monthsTenure: 3, daysInactive: 0,
  },
  // 16 - Mia Robinson (active): new, building habits
  {
    memberId: "mem_17", memberName: "Mia Robinson",
    checkInPattern: "improving", visitsPerWeek: 3, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "gym_only",
    lifecycleStage: "new", monthsTenure: 1, daysInactive: 1,
  },
  // 17 - Lucas Clark (churned): corporate who left
  {
    memberId: "mem_18", memberName: "Lucas Clark",
    checkInPattern: "ceased", visitsPerWeek: 0, declineRate: 1,
    paymentPattern: "late_payer", engagementPattern: "minimal",
    lifecycleStage: "stable", monthsTenure: 20, daysInactive: 30,
  },
  // 18 - Isabella Lewis (active): PT, very engaged
  {
    memberId: "mem_19", memberName: "Isabella Lewis",
    checkInPattern: "consistent", visitsPerWeek: 5, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "pt_active",
    lifecycleStage: "stable", monthsTenure: 18, daysInactive: 0,
  },
  // 19 - Mason Walker (active): student, weekend warrior
  {
    memberId: "mem_20", memberName: "Mason Walker",
    checkInPattern: "weekend_only", visitsPerWeek: 2, declineRate: 0.1,
    paymentPattern: "perfect", engagementPattern: "gym_only",
    lifecycleStage: "establishing", monthsTenure: 2, daysInactive: 4,
  },
  // 20 - Harper Hall (active): Premium, new but enthusiastic
  {
    memberId: "mem_21", memberName: "Harper Hall",
    checkInPattern: "new_active", visitsPerWeek: 5, declineRate: 0,
    paymentPattern: "perfect", engagementPattern: "full",
    lifecycleStage: "new", monthsTenure: 1, daysInactive: 0,
  },
  // 21 - Jack Allen (at-risk): declining, payment issues
  {
    memberId: "mem_22", memberName: "Jack Allen",
    checkInPattern: "declining", visitsPerWeek: 1, declineRate: 0.6,
    paymentPattern: "one_failed", engagementPattern: "gym_only",
    lifecycleStage: "new", monthsTenure: 1, daysInactive: 15,
  },
];

// ─── Check-In History Generator ───────────────────────────────

export function generateCheckInHistory(
  profile: BehavioralProfile,
  now: Date,
): string[] {
  const dates: string[] = [];

  if (profile.checkInPattern === "ceased") {
    // Had visits before but stopped
    const startOffset = profile.daysInactive + 30; // went inactive X days ago, had 30 days of activity before
    for (let week = 0; week < 6; week++) {
      const visits = Math.max(1, 4 - week); // declining pattern before ceasing
      for (let v = 0; v < visits; v++) {
        const dayOffset = startOffset + week * 7 + v * 2;
        const d = new Date(now.getTime() - dayOffset * 86400000);
        d.setHours(6 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
        dates.push(d.toISOString());
      }
    }
    return dates;
  }

  const totalWeeks = 8;

  for (let week = 0; week < totalWeeks; week++) {
    let weekVisits: number;

    switch (profile.checkInPattern) {
      case "consistent":
        weekVisits = profile.visitsPerWeek;
        break;
      case "declining":
        weekVisits = Math.max(0, Math.round(profile.visitsPerWeek * (1 - profile.declineRate * (week / totalWeeks))));
        // Invert: most recent weeks have fewer visits
        weekVisits = Math.max(0, Math.round(profile.visitsPerWeek * (1 - profile.declineRate * ((totalWeeks - week) / totalWeeks))));
        break;
      case "weekend_only":
        weekVisits = week < totalWeeks - 2 ? 2 : 1;
        break;
      case "new_active":
        // Ramping up
        weekVisits = Math.min(profile.visitsPerWeek, Math.ceil((week + 1) * profile.visitsPerWeek / totalWeeks));
        break;
      case "sporadic":
        weekVisits = week % 3 === 0 ? profile.visitsPerWeek : Math.max(0, profile.visitsPerWeek - 2);
        break;
      case "improving":
        weekVisits = Math.min(profile.visitsPerWeek, Math.ceil((week + 1) * profile.visitsPerWeek / totalWeeks));
        break;
      default:
        weekVisits = profile.visitsPerWeek;
    }

    // Skip recent days if member is inactive
    for (let v = 0; v < weekVisits; v++) {
      const dayInWeek = profile.checkInPattern === "weekend_only"
        ? (v === 0 ? 5 : 6)  // Sat/Sun
        : v * Math.floor(7 / Math.max(1, weekVisits));
      const dayOffset = (totalWeeks - 1 - week) * 7 + dayInWeek;

      if (dayOffset < profile.daysInactive) continue;

      const d = new Date(now.getTime() - dayOffset * 86400000);
      d.setHours(6 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
      dates.push(d.toISOString());
    }
  }

  return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
}

// ─── Transaction Pattern Generator ────────────────────────────

export function generateTransactionPattern(
  profile: BehavioralProfile,
): { hasFailed: boolean; overdueCount: number } {
  switch (profile.paymentPattern) {
    case "perfect":
      return { hasFailed: false, overdueCount: 0 };
    case "one_failed":
      return { hasFailed: true, overdueCount: 0 };
    case "two_overdue":
      return { hasFailed: true, overdueCount: 2 };
    case "late_payer":
      return { hasFailed: false, overdueCount: 1 };
    default:
      return { hasFailed: false, overdueCount: 0 };
  }
}
