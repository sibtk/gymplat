// ─── Interfaces ──────────────────────────────────────────────────

export interface KpiStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface ChartLine {
  label: string;
  color: string;
  values: number[];
}

export interface AtRiskMember {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  lastVisit: string;
  riskFactors: string[];
  status: "at-risk" | "critical";
  plan: string;
  memberSince: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "active" | "at-risk" | "churned";
  lastCheckIn: string;
  memberSince: string;
  avatar: string;
}

export interface ActivityEvent {
  id: string;
  type: "check-in" | "signup" | "cancellation" | "payment" | "alert";
  description: string;
  timestamp: string;
  member: string;
}

export interface CohortRow {
  month: string;
  totalMembers: number;
  m1: number;
  m3: number;
  m6: number;
  m12: number;
}

export interface RetentionImpact {
  label: string;
  value: string;
  description: string;
}

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  action: string;
}

export interface CampaignSuggestion {
  id: string;
  name: string;
  type: "win-back" | "re-engagement" | "upsell";
  targetCount: number;
  estimatedImpact: string;
  description: string;
}

export interface AiAction {
  id: string;
  timestamp: string;
  description: string;
  result: string;
  status: "success" | "pending" | "failed";
}

export interface PlanComparison {
  rank: number;
  name: string;
  type: string;
  share: string;
  avgRetention: string;
  members: number;
}

export interface LocationComparison {
  rank: number;
  name: string;
  retention: string;
  members: number;
  score: number;
  delta?: number;
}

export interface RiskBucket {
  level: "High" | "Medium" | "Low";
  count: number;
  percentage: number;
  color: string;
}

// ─── Data ────────────────────────────────────────────────────────

export const kpiStats: KpiStat[] = [
  { label: "Total Members", value: "2,847", change: "+3.2%", trend: "up" },
  { label: "Monthly Revenue", value: "$127,400", change: "+5.8%", trend: "up" },
  { label: "Retention Rate", value: "91.8%", change: "+2.1%", trend: "up" },
  { label: "Churn Rate", value: "8.2%", change: "-1.4%", trend: "down" },
];

export const retentionChartMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const retentionChartData: ChartLine[] = [
  { label: "24/7 Access", color: "#171717", values: [65, 68, 70, 72, 75, 78, 76, 79, 81, 83, 85, 87] },
  { label: "Premium", color: "#3b82f6", values: [72, 73, 71, 74, 76, 80, 82, 81, 84, 86, 88, 90] },
  { label: "PT Package", color: "#22c55e", values: [85, 82, 83, 86, 88, 92, 90, 91, 93, 94, 95, 96] },
  { label: "Student", color: "#f59e0b", values: [45, 48, 42, 44, 47, 50, 52, 49, 53, 55, 57, 58] },
  { label: "Corporate", color: "#8b5cf6", values: [55, 58, 60, 62, 58, 55, 57, 60, 63, 65, 64, 66] },
];

export const atRiskMembers: AtRiskMember[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.c@email.com", riskScore: 92, lastVisit: "21 days ago", riskFactors: ["No check-in 3 weeks", "Payment declined"], status: "critical", plan: "Premium", memberSince: "Jan 2024" },
  { id: "2", name: "Mike Torres", email: "m.torres@email.com", riskScore: 87, lastVisit: "18 days ago", riskFactors: ["Frequency dropped 60%", "Downgraded plan"], status: "critical", plan: "24/7 Access", memberSince: "Mar 2024" },
  { id: "3", name: "Lisa Park", email: "lisa.p@email.com", riskScore: 81, lastVisit: "14 days ago", riskFactors: ["No class bookings", "Complaint filed"], status: "critical", plan: "PT Package", memberSince: "Nov 2023" },
  { id: "4", name: "James Wilson", email: "j.wilson@email.com", riskScore: 74, lastVisit: "12 days ago", riskFactors: ["Weekend-only visits", "Reduced frequency"], status: "at-risk", plan: "Premium", memberSince: "Jun 2024" },
  { id: "5", name: "Ana Rodriguez", email: "ana.r@email.com", riskScore: 68, lastVisit: "10 days ago", riskFactors: ["Engagement score low"], status: "at-risk", plan: "Student", memberSince: "Sep 2024" },
  { id: "6", name: "David Kim", email: "d.kim@email.com", riskScore: 65, lastVisit: "9 days ago", riskFactors: ["Canceled PT sessions", "Off-peak only"], status: "at-risk", plan: "PT Package", memberSince: "Feb 2024" },
  { id: "7", name: "Emma Brown", email: "e.brown@email.com", riskScore: 61, lastVisit: "8 days ago", riskFactors: ["Contract ending soon"], status: "at-risk", plan: "Corporate", memberSince: "Aug 2024" },
  { id: "8", name: "Ryan Lee", email: "r.lee@email.com", riskScore: 58, lastVisit: "7 days ago", riskFactors: ["Peer group churned"], status: "at-risk", plan: "24/7 Access", memberSince: "Apr 2024" },
  { id: "9", name: "Nicole Adams", email: "n.adams@email.com", riskScore: 54, lastVisit: "6 days ago", riskFactors: ["Late payments x2"], status: "at-risk", plan: "Premium", memberSince: "Dec 2023" },
  { id: "10", name: "Chris Taylor", email: "c.taylor@email.com", riskScore: 51, lastVisit: "5 days ago", riskFactors: ["Low engagement score"], status: "at-risk", plan: "Student", memberSince: "Oct 2024" },
];

export const membersList: Member[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.c@email.com", plan: "Premium", status: "at-risk", lastCheckIn: "21 days ago", memberSince: "Jan 2024", avatar: "SC" },
  { id: "2", name: "Mike Torres", email: "m.torres@email.com", plan: "24/7 Access", status: "at-risk", lastCheckIn: "18 days ago", memberSince: "Mar 2024", avatar: "MT" },
  { id: "3", name: "Lisa Park", email: "lisa.p@email.com", plan: "PT Package", status: "at-risk", lastCheckIn: "14 days ago", memberSince: "Nov 2023", avatar: "LP" },
  { id: "4", name: "James Wilson", email: "j.wilson@email.com", plan: "Premium", status: "active", lastCheckIn: "Today", memberSince: "Jun 2024", avatar: "JW" },
  { id: "5", name: "Ana Rodriguez", email: "ana.r@email.com", plan: "Student", status: "at-risk", lastCheckIn: "10 days ago", memberSince: "Sep 2024", avatar: "AR" },
  { id: "6", name: "David Kim", email: "d.kim@email.com", plan: "PT Package", status: "active", lastCheckIn: "Yesterday", memberSince: "Feb 2024", avatar: "DK" },
  { id: "7", name: "Emma Brown", email: "e.brown@email.com", plan: "Corporate", status: "active", lastCheckIn: "Today", memberSince: "Aug 2024", avatar: "EB" },
  { id: "8", name: "Ryan Lee", email: "r.lee@email.com", plan: "24/7 Access", status: "active", lastCheckIn: "2 days ago", memberSince: "Apr 2024", avatar: "RL" },
  { id: "9", name: "Nicole Adams", email: "n.adams@email.com", plan: "Premium", status: "active", lastCheckIn: "Today", memberSince: "Dec 2023", avatar: "NA" },
  { id: "10", name: "Chris Taylor", email: "c.taylor@email.com", plan: "Student", status: "churned", lastCheckIn: "45 days ago", memberSince: "Oct 2024", avatar: "CT" },
  { id: "11", name: "Olivia Martinez", email: "o.martinez@email.com", plan: "Premium", status: "active", lastCheckIn: "Today", memberSince: "May 2024", avatar: "OM" },
  { id: "12", name: "Ethan Wright", email: "e.wright@email.com", plan: "24/7 Access", status: "active", lastCheckIn: "Yesterday", memberSince: "Jul 2024", avatar: "EW" },
  { id: "13", name: "Sophia Nguyen", email: "s.nguyen@email.com", plan: "Corporate", status: "active", lastCheckIn: "Today", memberSince: "Jan 2025", avatar: "SN" },
  { id: "14", name: "Liam Johnson", email: "l.johnson@email.com", plan: "PT Package", status: "active", lastCheckIn: "3 days ago", memberSince: "Mar 2025", avatar: "LJ" },
  { id: "15", name: "Ava Thompson", email: "a.thompson@email.com", plan: "Student", status: "churned", lastCheckIn: "60 days ago", memberSince: "Sep 2024", avatar: "AT" },
  { id: "16", name: "Noah Garcia", email: "n.garcia@email.com", plan: "Premium", status: "active", lastCheckIn: "Today", memberSince: "Nov 2024", avatar: "NG" },
  { id: "17", name: "Mia Robinson", email: "m.robinson@email.com", plan: "24/7 Access", status: "active", lastCheckIn: "Yesterday", memberSince: "Feb 2025", avatar: "MR" },
  { id: "18", name: "Lucas Clark", email: "l.clark@email.com", plan: "Corporate", status: "churned", lastCheckIn: "30 days ago", memberSince: "Jun 2024", avatar: "LC" },
  { id: "19", name: "Isabella Lewis", email: "i.lewis@email.com", plan: "PT Package", status: "active", lastCheckIn: "Today", memberSince: "Aug 2024", avatar: "IL" },
  { id: "20", name: "Mason Walker", email: "m.walker@email.com", plan: "Student", status: "active", lastCheckIn: "4 days ago", memberSince: "Dec 2024", avatar: "MW" },
  { id: "21", name: "Harper Hall", email: "h.hall@email.com", plan: "Premium", status: "active", lastCheckIn: "Today", memberSince: "Apr 2025", avatar: "HH" },
  { id: "22", name: "Jack Allen", email: "j.allen@email.com", plan: "24/7 Access", status: "at-risk", lastCheckIn: "15 days ago", memberSince: "Jan 2025", avatar: "JA" },
];

export const recentActivity: ActivityEvent[] = [
  { id: "1", type: "check-in", description: "checked in at Downtown", timestamp: "2 min ago", member: "James Wilson" },
  { id: "2", type: "payment", description: "monthly payment processed ($49.99)", timestamp: "8 min ago", member: "Emma Brown" },
  { id: "3", type: "signup", description: "signed up for Premium plan", timestamp: "15 min ago", member: "Harper Hall" },
  { id: "4", type: "check-in", description: "checked in at Westside", timestamp: "22 min ago", member: "Olivia Martinez" },
  { id: "5", type: "alert", description: "flagged as at-risk (score: 74)", timestamp: "35 min ago", member: "James Wilson" },
  { id: "6", type: "check-in", description: "checked in at Downtown", timestamp: "41 min ago", member: "Nicole Adams" },
  { id: "7", type: "cancellation", description: "cancelled Student plan", timestamp: "1 hr ago", member: "Ava Thompson" },
  { id: "8", type: "payment", description: "payment failed — retry scheduled", timestamp: "1 hr ago", member: "Sarah Chen" },
  { id: "9", type: "check-in", description: "checked in at Eastgate", timestamp: "1.5 hrs ago", member: "Sophia Nguyen" },
  { id: "10", type: "signup", description: "signed up for 24/7 Access", timestamp: "2 hrs ago", member: "Mia Robinson" },
  { id: "11", type: "check-in", description: "checked in at Campus", timestamp: "2.5 hrs ago", member: "Liam Johnson" },
  { id: "12", type: "alert", description: "engagement score dropped below 50", timestamp: "3 hrs ago", member: "Ana Rodriguez" },
  { id: "13", type: "payment", description: "annual payment processed ($479.88)", timestamp: "3.5 hrs ago", member: "Noah Garcia" },
  { id: "14", type: "check-in", description: "checked in at Business Park", timestamp: "4 hrs ago", member: "David Kim" },
  { id: "15", type: "cancellation", description: "cancelled Corporate plan", timestamp: "5 hrs ago", member: "Lucas Clark" },
];

export const cohortData: CohortRow[] = [
  { month: "Jan 2025", totalMembers: 245, m1: 94, m3: 88, m6: 82, m12: 74 },
  { month: "Feb 2025", totalMembers: 312, m1: 92, m3: 86, m6: 80, m12: 71 },
  { month: "Mar 2025", totalMembers: 287, m1: 95, m3: 90, m6: 84, m12: 76 },
  { month: "Apr 2025", totalMembers: 198, m1: 91, m3: 85, m6: 79, m12: 70 },
  { month: "May 2025", totalMembers: 334, m1: 96, m3: 91, m6: 85, m12: 78 },
  { month: "Jun 2025", totalMembers: 276, m1: 93, m3: 87, m6: 81, m12: 73 },
  { month: "Jul 2025", totalMembers: 301, m1: 94, m3: 89, m6: 83, m12: 75 },
  { month: "Aug 2025", totalMembers: 258, m1: 90, m3: 84, m6: 78, m12: 69 },
  { month: "Sep 2025", totalMembers: 345, m1: 97, m3: 92, m6: 86, m12: 79 },
  { month: "Oct 2025", totalMembers: 289, m1: 93, m3: 88, m6: 82, m12: 74 },
  { month: "Nov 2025", totalMembers: 267, m1: 95, m3: 90, m6: 0, m12: 0 },
  { month: "Dec 2025", totalMembers: 310, m1: 94, m3: 0, m6: 0, m12: 0 },
];

export const retentionImpact: RetentionImpact[] = [
  { label: "Members Saved", value: "142", description: "Members retained through AI-powered interventions" },
  { label: "Revenue Retained", value: "$48,200", description: "Monthly recurring revenue preserved" },
  { label: "Avg Detection Time", value: "18 days", description: "Average early warning before churn" },
];

export const aiRecommendations: AiRecommendation[] = [
  { id: "1", title: "Re-engage Weekend Warriors", description: "23 members only visit on weekends and show declining frequency. Send personalized weekday class recommendations to boost engagement.", impact: "+15% visit frequency", action: "Send Recommendations" },
  { id: "2", title: "Upsell PT Sessions", description: "47 Premium members have hit fitness plateaus based on check-in patterns. Offer a free PT consultation to drive upgrades.", impact: "+$2,800 MRR", action: "Create Campaign" },
  { id: "3", title: "Win Back Q4 Churns", description: "68 members who cancelled in Q4 match re-engagement patterns. Send a 30-day free trial offer.", impact: "~22 members recovered", action: "Launch Win-back" },
  { id: "4", title: "Optimize Class Schedule", description: "Tuesday 6PM and Thursday 7PM slots are overbooked while Monday 7PM is at 40% capacity. Redistribute to reduce wait times.", impact: "-35% wait times", action: "View Schedule" },
];

export const campaignSuggestions: CampaignSuggestion[] = [
  { id: "1", name: "Winter Win-Back", type: "win-back", targetCount: 68, estimatedImpact: "22 members recovered, +$1,100/mo", description: "Target members who cancelled in the last 90 days with a 30-day free trial and personal check-in from staff." },
  { id: "2", name: "Engagement Booster", type: "re-engagement", targetCount: 145, estimatedImpact: "+40% visit frequency", description: "Members visiting less than once per week receive personalized workout plans and class recommendations." },
  { id: "3", name: "Premium Upgrade Path", type: "upsell", targetCount: 89, estimatedImpact: "+$4,200 MRR", description: "24/7 Access members with high engagement are ideal candidates for Premium plan upgrade with PT session bundle." },
];

export const aiActionsLog: AiAction[] = [
  { id: "1", timestamp: "Today, 9:15 AM", description: "Sent win-back email to Sarah Chen", result: "Email opened", status: "success" },
  { id: "2", timestamp: "Today, 8:45 AM", description: "Flagged Mike Torres as critical risk (score: 87)", result: "Alert sent to manager", status: "success" },
  { id: "3", timestamp: "Today, 8:30 AM", description: "Generated weekly churn report", result: "12 new at-risk members identified", status: "success" },
  { id: "4", timestamp: "Yesterday, 4:20 PM", description: "Auto-scheduled PT consultation for David Kim", result: "Appointment confirmed", status: "success" },
  { id: "5", timestamp: "Yesterday, 2:10 PM", description: "Sent engagement survey to 45 members", result: "18 responses received", status: "success" },
  { id: "6", timestamp: "Yesterday, 11:00 AM", description: "Processed win-back campaign batch", result: "68 emails sent, 23 opened", status: "success" },
  { id: "7", timestamp: "Yesterday, 9:30 AM", description: "Updated risk scores for all members", result: "2,847 scores recalculated", status: "success" },
  { id: "8", timestamp: "2 days ago, 3:15 PM", description: "Attempted SMS to Ana Rodriguez", result: "Phone number invalid", status: "failed" },
  { id: "9", timestamp: "2 days ago, 1:00 PM", description: "Generated class optimization report", result: "3 schedule changes recommended", status: "success" },
  { id: "10", timestamp: "2 days ago, 10:45 AM", description: "Sent discount offer to Emma Brown", result: "Awaiting response", status: "pending" },
  { id: "11", timestamp: "3 days ago, 4:00 PM", description: "Re-engagement campaign completed", result: "32 of 145 members re-activated", status: "success" },
  { id: "12", timestamp: "3 days ago, 9:00 AM", description: "Weekly retention forecast generated", result: "91.8% predicted retention", status: "success" },
];

export const planComparison: PlanComparison[] = [
  { rank: 1, name: "24/7 Access", type: "Base", share: "42%", avgRetention: "78%", members: 1196 },
  { rank: 2, name: "Premium", type: "Standard", share: "28%", avgRetention: "88%", members: 797 },
  { rank: 3, name: "PT Package", type: "Premium", share: "15%", avgRetention: "92%", members: 427 },
  { rank: 4, name: "Student", type: "Discount", share: "10%", avgRetention: "50%", members: 285 },
  { rank: 5, name: "Corporate", type: "B2B", share: "5%", avgRetention: "82%", members: 142 },
];

export const locationComparison: LocationComparison[] = [
  { rank: 1, name: "Downtown", retention: "92%", members: 847, score: 86 },
  { rank: 2, name: "Westside", retention: "88%", members: 623, score: 62, delta: -0.2 },
  { rank: 3, name: "Eastgate", retention: "95%", members: 341, score: 89, delta: 0.3 },
  { rank: 4, name: "Campus", retention: "78%", members: 512, score: 76, delta: -0.3 },
  { rank: 5, name: "Business Park", retention: "82%", members: 234, score: 88, delta: 0.4 },
];

export const riskBuckets: RiskBucket[] = [
  { level: "High", count: 23, percentage: 0.8, color: "#ef4444" },
  { level: "Medium", count: 89, percentage: 3.1, color: "#f59e0b" },
  { level: "Low", count: 122, percentage: 4.3, color: "#22c55e" },
];
