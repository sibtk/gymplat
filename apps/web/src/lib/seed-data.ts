import {
  membersList,
  staffMembers as mockStaff,
  transactions as mockTransactions,
  notificationsList,
} from "@/lib/mock-data";
import {
  behavioralProfiles,
  generateCheckInHistory,
  generateTransactionPattern,
} from "@/lib/retention/seed-profiles";

import type {
  ActivityEvent,
  Campaign,
  ChatMessage,
  ClassBooking,
  EmailTemplate,
  GymClass,
  GymSettings,
  Invoice,
  Location,
  MemberFull,
  MemberNote,
  MessageRecord,
  PaymentMethod,
  Plan,
  ReportConfig,
  StaffMemberFull,
  Subscription,
  TransactionFull,
} from "@/lib/types";

// ─── Locations ──────────────────────────────────────────────────

export const seedLocations: Location[] = [
  { id: "loc_1", name: "Downtown", address: "123 Main St, New York, NY 10001", timezone: "America/New_York", memberCount: 847, capacity: 1000 },
  { id: "loc_2", name: "Westside", address: "456 West Ave, New York, NY 10023", timezone: "America/New_York", memberCount: 623, capacity: 800 },
  { id: "loc_3", name: "Eastgate", address: "789 East Blvd, New York, NY 10028", timezone: "America/New_York", memberCount: 341, capacity: 500 },
  { id: "loc_4", name: "Campus", address: "321 College Rd, New York, NY 10003", timezone: "America/New_York", memberCount: 512, capacity: 600 },
  { id: "loc_5", name: "Business Park", address: "555 Commerce Dr, New York, NY 10016", timezone: "America/New_York", memberCount: 234, capacity: 400 },
];

// ─── Plans ──────────────────────────────────────────────────────

export const seedPlans: Plan[] = [
  { id: "plan_1", name: "24/7 Access", priceMonthly: 29.99, priceAnnual: 299.88, features: ["24/7 gym access", "Locker room", "Free WiFi"], type: "base", memberCount: 1196 },
  { id: "plan_2", name: "Premium", priceMonthly: 49.99, priceAnnual: 479.88, features: ["24/7 gym access", "Group classes", "Sauna & spa", "Guest passes"], type: "standard", memberCount: 797 },
  { id: "plan_3", name: "PT Package", priceMonthly: 119.99, priceAnnual: 1199.88, features: ["All Premium features", "4 PT sessions/mo", "Custom workout plan", "Nutrition coaching"], type: "premium", memberCount: 427 },
  { id: "plan_4", name: "Student", priceMonthly: 19.99, priceAnnual: 199.88, features: ["Gym access 6AM-10PM", "Basic classes"], type: "discount", memberCount: 285 },
  { id: "plan_5", name: "Corporate", priceMonthly: 39.99, priceAnnual: 399.88, features: ["24/7 access", "Group classes", "Corporate wellness reports"], type: "b2b", memberCount: 142 },
];

// ─── Plan name → id mapping ────────────────────────────────────

const planNameToId: Record<string, string> = {
  "24/7 Access": "plan_1",
  Premium: "plan_2",
  "PT Package": "plan_3",
  Student: "plan_4",
  Corporate: "plan_5",
};

const planNameToPrice: Record<string, number> = {
  "24/7 Access": 29.99,
  Premium: 49.99,
  "PT Package": 119.99,
  Student: 19.99,
  Corporate: 39.99,
};

// ─── Location assignment ────────────────────────────────────────

const locationAssignments = ["loc_1", "loc_2", "loc_3", "loc_4", "loc_5"];

function assignLocation(index: number): string {
  return locationAssignments[index % locationAssignments.length] as string;
}

// ─── Members ────────────────────────────────────────────────────

const now = new Date();

export const seedMembers: MemberFull[] = membersList.map((m, idx) => {
  const profile = behavioralProfiles[idx];
  const checkInHistory = profile
    ? generateCheckInHistory(profile, now)
    : Array.from({ length: 5 + (idx % 10) }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i * 2 - (idx % 5));
        return d.toISOString();
      });

  // Compute memberSince from profile tenure
  const tenure = profile?.monthsTenure ?? (12 + idx);
  const memberSinceDate = new Date(now.getFullYear(), now.getMonth() - tenure, 1);
  const memberSince = memberSinceDate.toISOString().split("T")[0] as string;

  // Derive lastCheckIn from checkInHistory
  const lastCheckIn = checkInHistory.length > 0
    ? (checkInHistory[0] as string)
    : m.lastCheckIn;

  return {
    id: `mem_${m.id}`,
    name: m.name,
    email: m.email,
    phone: `(555) ${String(100 + idx).padStart(3, "0")}-${String(1000 + idx * 37).slice(-4)}`,
    dateOfBirth: `${1985 + (idx % 15)}-${String((idx % 12) + 1).padStart(2, "0")}-${String((idx % 28) + 1).padStart(2, "0")}`,
    address: `${100 + idx * 10} Street, New York, NY 10001`,
    emergencyContact: `Emergency Contact ${idx + 1}: (555) 999-${String(1000 + idx).slice(-4)}`,
    avatar: m.avatar,
    locationId: assignLocation(idx),
    planId: planNameToId[m.plan] ?? "plan_1",
    subscriptionId: `sub_${m.id}`,
    paymentMethodId: `pm_${m.id}`,
    status: m.status === "churned" ? "churned" as const : m.status === "at-risk" ? "at-risk" as const : "active" as const,
    riskScore: 0, // Will be computed by retention engine
    riskFactors: [] as string[], // Will be computed by retention engine
    lastCheckIn,
    memberSince,
    waiverSigned: true,
    pausedUntil: null,
    cancelledAt: m.status === "churned" ? "2026-01-15T00:00:00Z" : null,
    checkInHistory,
    tags: m.status === "at-risk" ? ["at-risk", "needs-followup"] : m.status === "active" ? ["engaged"] : ["churned"],
  };
});

// ─── Subscriptions ──────────────────────────────────────────────

export const seedSubscriptions: Subscription[] = seedMembers
  .filter((m) => m.status !== "churned")
  .map((m) => {
    const plan = seedPlans.find((p) => p.id === m.planId);
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      id: m.subscriptionId,
      memberId: m.id,
      memberName: m.name,
      planId: m.planId,
      planName: plan?.name ?? "Unknown",
      status: m.status === "paused" ? "paused" as const : "active" as const,
      billingCycle: "monthly" as const,
      amount: plan?.priceMonthly ?? 29.99,
      currentPeriodStart: periodStart.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: `2024-${String((parseInt(m.id.split("_")[1] ?? "1") % 12) + 1).padStart(2, "0")}-01T00:00:00Z`,
    };
  });

// ─── Payment Methods ────────────────────────────────────────────

const brands = ["visa", "mastercard", "amex", "visa", "mastercard"] as const;

export const seedPaymentMethods: PaymentMethod[] = seedMembers.map((m, idx) => ({
  id: m.paymentMethodId,
  memberId: m.id,
  memberName: m.name,
  type: "card" as const,
  last4: String(1000 + idx * 137).slice(-4),
  brand: brands[idx % brands.length] as PaymentMethod["brand"],
  expMonth: ((idx % 12) + 1),
  expYear: 2027 + (idx % 3),
  isDefault: true,
}));

// ─── Invoices ───────────────────────────────────────────────────

export const seedInvoices: Invoice[] = seedMembers.slice(0, 15).map((m, idx) => {
  const price = planNameToPrice[seedPlans.find((p) => p.id === m.planId)?.name ?? ""] ?? 29.99;
  const tax = Math.round(price * 0.08 * 100) / 100;
  const issuedAt = new Date(now.getFullYear(), now.getMonth(), 1 + idx);

  // Use behavioral profile to determine invoice status
  const profile = behavioralProfiles[idx];
  const pattern = profile ? generateTransactionPattern(profile) : null;
  let status: Invoice["status"];
  if (pattern && pattern.overdueCount > 0) {
    status = "overdue";
  } else if (idx < 10) {
    status = "paid";
  } else if (idx < 13) {
    status = "pending";
  } else {
    status = "overdue";
  }

  return {
    id: `inv_${idx + 1}`,
    memberId: m.id,
    memberName: m.name,
    amount: price,
    tax,
    total: Math.round((price + tax) * 100) / 100,
    status,
    lineItems: [{ description: `${seedPlans.find((p) => p.id === m.planId)?.name ?? "Plan"} - Monthly`, quantity: 1, unitPrice: price, total: price }],
    issuedAt: issuedAt.toISOString(),
    dueAt: new Date(issuedAt.getTime() + 30 * 86400000).toISOString(),
    paidAt: status === "paid" ? new Date(issuedAt.getTime() + 2 * 86400000).toISOString() : null,
  };
});

// ─── Transactions ───────────────────────────────────────────────

const baseTxns: TransactionFull[] = mockTransactions.map((t, idx) => {
  const member = seedMembers.find((m) => m.name === t.member);
  return {
    id: `txn_${idx + 1}`,
    memberId: member?.id ?? `mem_${idx + 1}`,
    memberName: t.member,
    amount: parseFloat(t.amount.replace("$", "")),
    type: t.type,
    status: t.status,
    method: t.method,
    description: `${t.type === "refund" ? "Refund" : "Payment"} - ${t.member}`,
    invoiceId: t.type === "subscription" ? `inv_${idx + 1}` : null,
    refundReason: t.type === "refund" ? "Customer request" : null,
    date: t.date,
  };
});

// Generate additional failed transactions from behavioral profiles
const profileTxns: TransactionFull[] = [];
behavioralProfiles.forEach((profile, idx) => {
  const pattern = generateTransactionPattern(profile);
  if (pattern.hasFailed) {
    const member = seedMembers[idx];
    if (member) {
      const failDate = new Date(now.getTime() - (7 + idx * 3) * 86400000);
      profileTxns.push({
        id: `txn_profile_${idx}`,
        memberId: member.id,
        memberName: member.name,
        amount: planNameToPrice[seedPlans.find((p) => p.id === member.planId)?.name ?? ""] ?? 29.99,
        type: "subscription",
        status: "failed",
        method: "card",
        description: `Payment failed - ${member.name}`,
        invoiceId: null,
        refundReason: null,
        date: failDate.toISOString(),
      });
    }
  }
});

export const seedTransactions: TransactionFull[] = [...baseTxns, ...profileTxns];

// ─── Classes ────────────────────────────────────────────────────

const classColors: Record<string, string> = {
  strength: "#3b82f6",
  cardio: "#ef4444",
  yoga: "#22c55e",
  hiit: "#f59e0b",
  pilates: "#8b5cf6",
  boxing: "#ec4899",
  crossfit: "#14b8a6",
  spin: "#f97316",
};

export const seedClasses: GymClass[] = [
  { id: "cls_1", name: "Power Lifting", type: "strength", trainerId: "s3", trainerName: "Casey Mitchell", locationId: "loc_1", locationName: "Downtown", dayOfWeek: "mon", startTime: "06:00", endTime: "07:00", capacity: 20, enrolled: 18, color: classColors["strength"] ?? "#3b82f6", description: "Build raw strength with compound movements" },
  { id: "cls_2", name: "Morning Yoga", type: "yoga", trainerId: "s4", trainerName: "Sam Patel", locationId: "loc_1", locationName: "Downtown", dayOfWeek: "mon", startTime: "07:30", endTime: "08:30", capacity: 25, enrolled: 22, color: classColors["yoga"] ?? "#22c55e", description: "Start your day with flexibility and mindfulness" },
  { id: "cls_3", name: "HIIT Blast", type: "hiit", trainerId: "s3", trainerName: "Casey Mitchell", locationId: "loc_2", locationName: "Westside", dayOfWeek: "tue", startTime: "12:00", endTime: "12:45", capacity: 30, enrolled: 28, color: classColors["hiit"] ?? "#f59e0b", description: "High-intensity intervals for max calorie burn" },
  { id: "cls_4", name: "Boxing Fundamentals", type: "boxing", trainerId: "s3", trainerName: "Casey Mitchell", locationId: "loc_1", locationName: "Downtown", dayOfWeek: "tue", startTime: "18:00", endTime: "19:00", capacity: 15, enrolled: 15, color: classColors["boxing"] ?? "#ec4899", description: "Learn boxing basics and get a killer workout" },
  { id: "cls_5", name: "Spin Class", type: "spin", trainerId: "s4", trainerName: "Sam Patel", locationId: "loc_3", locationName: "Eastgate", dayOfWeek: "wed", startTime: "06:30", endTime: "07:15", capacity: 20, enrolled: 16, color: classColors["spin"] ?? "#f97316", description: "Indoor cycling with motivating music" },
  { id: "cls_6", name: "Pilates Core", type: "pilates", trainerId: "s4", trainerName: "Sam Patel", locationId: "loc_2", locationName: "Westside", dayOfWeek: "wed", startTime: "09:00", endTime: "10:00", capacity: 20, enrolled: 14, color: classColors["pilates"] ?? "#8b5cf6", description: "Core strengthening and body alignment" },
  { id: "cls_7", name: "CrossFit WOD", type: "crossfit", trainerId: "s3", trainerName: "Casey Mitchell", locationId: "loc_1", locationName: "Downtown", dayOfWeek: "thu", startTime: "17:00", endTime: "18:00", capacity: 20, enrolled: 19, color: classColors["crossfit"] ?? "#14b8a6", description: "Workout of the day - varied functional movements" },
  { id: "cls_8", name: "Cardio Dance", type: "cardio", trainerId: "s4", trainerName: "Sam Patel", locationId: "loc_4", locationName: "Campus", dayOfWeek: "thu", startTime: "19:00", endTime: "20:00", capacity: 35, enrolled: 30, color: classColors["cardio"] ?? "#ef4444", description: "Dance your way to fitness" },
  { id: "cls_9", name: "Strength & Conditioning", type: "strength", trainerId: "s3", trainerName: "Casey Mitchell", locationId: "loc_5", locationName: "Business Park", dayOfWeek: "fri", startTime: "07:00", endTime: "08:00", capacity: 15, enrolled: 12, color: classColors["strength"] ?? "#3b82f6", description: "Full body conditioning for athletes" },
  { id: "cls_10", name: "Weekend Yoga Flow", type: "yoga", trainerId: "s4", trainerName: "Sam Patel", locationId: "loc_1", locationName: "Downtown", dayOfWeek: "sat", startTime: "09:00", endTime: "10:30", capacity: 30, enrolled: 25, color: classColors["yoga"] ?? "#22c55e", description: "Extended yoga session for deep relaxation" },
  { id: "cls_11", name: "HIIT Express", type: "hiit", trainerId: "s3", trainerName: "Casey Mitchell", locationId: "loc_2", locationName: "Westside", dayOfWeek: "sat", startTime: "11:00", endTime: "11:30", capacity: 25, enrolled: 20, color: classColors["hiit"] ?? "#f59e0b", description: "Quick 30-minute HIIT session" },
  { id: "cls_12", name: "Sunday Spin", type: "spin", trainerId: "s4", trainerName: "Sam Patel", locationId: "loc_3", locationName: "Eastgate", dayOfWeek: "sun", startTime: "10:00", endTime: "11:00", capacity: 20, enrolled: 17, color: classColors["spin"] ?? "#f97316", description: "Weekend spin to start the week strong" },
];

// ─── Class Bookings ─────────────────────────────────────────────

export const seedClassBookings: ClassBooking[] = seedClasses.slice(0, 5).flatMap((cls, ci) =>
  seedMembers.slice(ci * 3, ci * 3 + 3).map((m, mi) => ({
    id: `bk_${ci}_${mi}`,
    classId: cls.id,
    className: cls.name,
    memberId: m.id,
    memberName: m.name,
    date: new Date(2026, 1, 17 + ci).toISOString(),
    status: "confirmed" as const,
  })),
);

// ─── Email Templates ────────────────────────────────────────────

export const seedEmailTemplates: EmailTemplate[] = [
  {
    id: "tmpl_1",
    name: "Welcome Email",
    subject: "Welcome to {{gymName}}, {{memberName}}!",
    body: "<h2>Welcome to {{gymName}}!</h2><p>Hi {{memberName}},</p><p>We're excited to have you join us on the {{planName}} plan. Your membership is now active!</p><p>Here are a few things to get you started:</p><ul><li>Download our app for easy check-ins</li><li>Book your first class</li><li>Meet your personal trainer</li></ul><p>See you at the gym!</p>",
    type: "welcome",
    variables: ["memberName", "gymName", "planName"],
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "tmpl_2",
    name: "Win-Back Campaign",
    subject: "We miss you, {{memberName}}!",
    body: "<h2>We Miss You!</h2><p>Hi {{memberName}},</p><p>We noticed you haven't visited in a while. We'd love to have you back!</p><p>As a special offer, enjoy <strong>30 days free</strong> when you reactivate your membership.</p><p>Your favorite workout is waiting for you.</p>",
    type: "win-back",
    variables: ["memberName"],
    createdAt: "2025-07-15T00:00:00Z",
    updatedAt: "2025-07-15T00:00:00Z",
  },
  {
    id: "tmpl_3",
    name: "Payment Reminder",
    subject: "Payment reminder for your {{planName}} membership",
    body: "<h2>Payment Reminder</h2><p>Hi {{memberName}},</p><p>This is a friendly reminder that your {{planName}} payment of <strong>{{amount}}</strong> is due on {{dueDate}}.</p><p>Please ensure your payment method is up to date to avoid any interruption to your membership.</p>",
    type: "payment-reminder",
    variables: ["memberName", "planName", "amount", "dueDate"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "tmpl_4",
    name: "Class Reminder",
    subject: "Your {{className}} class is tomorrow!",
    body: "<h2>Class Reminder</h2><p>Hi {{memberName}},</p><p>Just a reminder that your <strong>{{className}}</strong> class with {{trainerName}} is scheduled for tomorrow at {{classTime}}.</p><p>Don't forget to bring your water bottle and towel!</p>",
    type: "class-reminder",
    variables: ["memberName", "className", "trainerName", "classTime"],
    createdAt: "2025-09-01T00:00:00Z",
    updatedAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "tmpl_5",
    name: "Milestone Achievement",
    subject: "Congratulations on {{milestone}}, {{memberName}}!",
    body: "<h2>Milestone Achieved!</h2><p>Hi {{memberName}},</p><p>Congratulations on reaching <strong>{{milestone}}</strong>! Your dedication is inspiring.</p><p>Keep up the great work!</p>",
    type: "milestone",
    variables: ["memberName", "milestone"],
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "tmpl_6",
    name: "Birthday Greeting",
    subject: "Happy Birthday, {{memberName}}!",
    body: "<h2>Happy Birthday!</h2><p>Hi {{memberName}},</p><p>Wishing you a fantastic birthday! As a gift, enjoy a <strong>free guest pass</strong> this month — bring a friend and celebrate together!</p>",
    type: "birthday",
    variables: ["memberName"],
    createdAt: "2025-11-01T00:00:00Z",
    updatedAt: "2025-11-01T00:00:00Z",
  },
  {
    id: "tmpl_7",
    name: "General Announcement",
    subject: "{{subject}}",
    body: "<h2>{{heading}}</h2><p>Hi {{memberName}},</p><p>{{body}}</p>",
    type: "general",
    variables: ["memberName", "subject", "heading", "body"],
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
  },
];

// ─── Campaigns ──────────────────────────────────────────────────

export const seedCampaigns: Campaign[] = [
  { id: "cmp_1", name: "Winter Win-Back", templateId: "tmpl_2", templateName: "Win-Back Campaign", segment: "Churned members (last 90 days)", status: "sent", recipientCount: 68, openCount: 42, clickCount: 18, scheduledAt: "2026-01-10T09:00:00Z", sentAt: "2026-01-10T09:00:00Z", createdAt: "2026-01-08T00:00:00Z" },
  { id: "cmp_2", name: "February Payment Reminders", templateId: "tmpl_3", templateName: "Payment Reminder", segment: "Members with overdue payments", status: "sent", recipientCount: 23, openCount: 19, clickCount: 12, scheduledAt: "2026-02-01T08:00:00Z", sentAt: "2026-02-01T08:00:00Z", createdAt: "2026-01-30T00:00:00Z" },
  { id: "cmp_3", name: "Spring Class Launch", templateId: "tmpl_7", templateName: "General Announcement", segment: "All active members", status: "draft", recipientCount: 0, openCount: 0, clickCount: 0, scheduledAt: null, sentAt: null, createdAt: "2026-02-15T00:00:00Z" },
];

// ─── Message History ────────────────────────────────────────────

export const seedMessageHistory: MessageRecord[] = [
  { id: "msg_1", memberId: "mem_1", memberName: "Sarah Chen", channel: "email", subject: "We miss you!", status: "opened", sentAt: "2026-02-10T09:00:00Z", openedAt: "2026-02-10T14:22:00Z" },
  { id: "msg_2", memberId: "mem_2", memberName: "Mike Torres", channel: "email", subject: "We miss you!", status: "delivered", sentAt: "2026-02-10T09:00:00Z", openedAt: null },
  { id: "msg_3", memberId: "mem_3", memberName: "Lisa Park", channel: "email", subject: "Payment reminder", status: "opened", sentAt: "2026-02-01T08:00:00Z", openedAt: "2026-02-01T12:15:00Z" },
  { id: "msg_4", memberId: "mem_5", memberName: "Ana Rodriguez", channel: "sms", subject: "Your class is tomorrow", status: "sent", sentAt: "2026-02-16T18:00:00Z", openedAt: null },
  { id: "msg_5", memberId: "mem_4", memberName: "James Wilson", channel: "email", subject: "Congratulations on 100 check-ins!", status: "opened", sentAt: "2026-02-14T10:00:00Z", openedAt: "2026-02-14T10:45:00Z" },
  { id: "msg_6", memberId: "mem_7", memberName: "Emma Brown", channel: "email", subject: "Your February invoice", status: "bounced", sentAt: "2026-02-01T08:00:00Z", openedAt: null },
  { id: "msg_7", memberId: "mem_9", memberName: "Nicole Adams", channel: "push", subject: "New class added: Boxing Fundamentals", status: "delivered", sentAt: "2026-02-15T12:00:00Z", openedAt: null },
  { id: "msg_8", memberId: "mem_11", memberName: "Olivia Martinez", channel: "email", subject: "Happy Birthday!", status: "opened", sentAt: "2026-02-12T07:00:00Z", openedAt: "2026-02-12T08:30:00Z" },
];

// ─── Staff ──────────────────────────────────────────────────────

export const seedStaff: StaffMemberFull[] = mockStaff.map((s) => ({
  id: s.id,
  name: s.name,
  email: s.email,
  role: s.role,
  avatar: s.avatar,
  joinedAt: s.joinedAt,
}));

// ─── Settings ───────────────────────────────────────────────────

export const seedGymSettings: GymSettings = {
  name: "Iron Temple Fitness",
  address: "123 Main Street, New York, NY 10001",
  phone: "(555) 123-4567",
  email: "admin@irontemple.com",
};

// ─── Notifications (re-export for store init) ───────────────────

export const seedNotifications = notificationsList;

// ─── Empty defaults ─────────────────────────────────────────────

export const seedMemberNotes: Record<string, MemberNote[]> = {};
export const seedChatMessages: ChatMessage[] = [];
export const seedSavedReports: ReportConfig[] = [];
export const seedActivityEvents: ActivityEvent[] = [];
