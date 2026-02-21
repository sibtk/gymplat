"use client";

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Edit3,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useGymStore } from "@/lib/store";

import type { Intervention, RiskAssessment } from "@/lib/retention/types";
import type { DayOfWeek, GymClass, MemberFull, Plan } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────

const dayFullNames: Record<DayOfWeek, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

function getFirstName(name: string): string {
  return name.split(" ")[0] as string;
}

function generateEmailSubject(intervention: Intervention): string {
  const title = intervention.title.toLowerCase();
  if (title.includes("payment recovery")) return "Quick update on your membership payment";
  if (title.includes("re-engagement")) return "We miss seeing you at the gym!";
  if (title.includes("renewal")) return "Your membership renewal is coming up";
  if (title.includes("anniversary")) return "Happy anniversary — thank you for being with us!";
  return intervention.title;
}

function generateEmailBody(intervention: Intervention, firstName: string): string {
  const title = intervention.title.toLowerCase();

  if (title.includes("payment recovery")) {
    return `Hi ${firstName},

We noticed there was a small hiccup processing your most recent membership payment. These things happen — no worries at all!

To keep your access uninterrupted, please take a moment to update your payment details. You can do this through the member portal or by stopping by the front desk.

If you have any questions or need help, just reply to this email — we're happy to assist.

Keep up the great work,
The FitLife Team`;
  }

  if (title.includes("re-engagement")) {
    return `Hi ${firstName},

It's been a little while since your last visit, and we wanted to check in. Life gets busy — we totally get it!

We've added some exciting new classes and updated equipment since your last visit. There's never been a better time to get back into your routine.

Your membership is still active and waiting for you. How about dropping by this week?

See you soon,
The FitLife Team`;
  }

  if (title.includes("renewal")) {
    return `Hi ${firstName},

Just a friendly heads-up — your membership renewal is coming up soon. We'd love to keep you as part of the FitLife family!

Your current plan will auto-renew at the same rate. If you'd like to explore other plan options or have any questions, feel free to reach out.

Here's to another great stretch of training,
The FitLife Team`;
  }

  if (title.includes("anniversary")) {
    return `Hi ${firstName},

Can you believe it's been a year already? We're so grateful to have you as part of our community.

Your dedication has been impressive, and we wanted to take a moment to celebrate this milestone with you. As a thank you, we have a small gift waiting for you at the front desk next time you visit.

Here's to many more great workouts ahead!

Cheers,
The FitLife Team`;
  }

  // Generic fallback
  return `Hi ${firstName},

${intervention.description}

If you have any questions, don't hesitate to reach out.

Best,
The FitLife Team`;
}

function getCTALabel(intervention: Intervention): string {
  const title = intervention.title.toLowerCase();
  if (title.includes("payment")) return "Update Payment Method";
  if (title.includes("re-engagement")) return "View Class Schedule";
  if (title.includes("renewal")) return "View My Plan";
  if (title.includes("anniversary")) return "Claim My Gift";
  return "Learn More";
}

function parseDiscount(description: string): { percent: number; months: number } {
  const percentMatch = description.match(/(\d+)%/);
  const monthsMatch = description.match(/(\d+)\s*month/);
  return {
    percent: percentMatch ? parseInt(percentMatch[1] as string, 10) : 20,
    months: monthsMatch ? parseInt(monthsMatch[1] as string, 10) : 3,
  };
}

function getPreferredDays(member: MemberFull): DayOfWeek[] {
  const dayCounts: Partial<Record<DayOfWeek, number>> = {};
  const dayMap: DayOfWeek[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  for (const dateStr of member.checkInHistory.slice(0, 20)) {
    const day = dayMap[new Date(dateStr).getDay()] as DayOfWeek;
    dayCounts[day] = (dayCounts[day] ?? 0) + 1;
  }

  return Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([day]) => day as DayOfWeek);
}

function generateTalkingPoints(
  intervention: Intervention,
  member: MemberFull | undefined,
  plan: Plan | undefined,
  assessment: RiskAssessment | undefined,
): string[] {
  const points: string[] = [];
  const firstName = getFirstName(intervention.memberName);

  // Greeting context
  if (member) {
    const daysSinceVisit = member.lastCheckIn
      ? Math.floor((Date.now() - new Date(member.lastCheckIn).getTime()) / 86400000)
      : null;

    if (daysSinceVisit !== null && daysSinceVisit > 7) {
      points.push(`It's been ${daysSinceVisit} days since ${firstName}'s last visit — open with a genuine check-in`);
    } else {
      points.push(`${firstName} has been visiting recently — acknowledge their consistency`);
    }
  }

  // Risk factors
  if (member && member.riskFactors.length > 0) {
    points.push(`Key concerns: ${member.riskFactors.slice(0, 3).join(", ")}`);
  }

  // Assessment-specific
  if (assessment) {
    const topSignals = assessment.signals
      .filter((s) => s.score > 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    for (const signal of topSignals) {
      if (signal.category === "payment") {
        points.push("Mention flexible payment options if they bring up billing concerns");
      } else if (signal.category === "visit_frequency") {
        points.push("Ask about schedule changes — offer class times that might work better");
      } else if (signal.category === "engagement") {
        points.push("Suggest trying a new class type or booking a session with a trainer");
      }
    }
  }

  // Plan context
  if (plan) {
    points.push(`Current plan: ${plan.name} ($${plan.priceMonthly}/mo) — know upgrade/downgrade options`);
  }

  // Close
  points.push("End by setting a specific next-visit date together");

  return points;
}

function suggestTimeSlot(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Skip to Monday if tomorrow is weekend
  const day = tomorrow.getDay();
  if (day === 0) tomorrow.setDate(tomorrow.getDate() + 1);
  if (day === 6) tomorrow.setDate(tomorrow.getDate() + 2);

  const dayName = tomorrow.toLocaleDateString("en-US", { weekday: "long" });
  return `${dayName} at 10:00 AM`;
}

// ─── Main Component ───────────────────────────────────────────────

interface InterventionPreviewProps {
  intervention: Intervention;
}

export function InterventionPreview({ intervention }: InterventionPreviewProps) {
  const members = useGymStore((s) => s.members);
  const plans = useGymStore((s) => s.plans);
  const classes = useGymStore((s) => s.classes);
  const riskAssessments = useGymStore((s) => s.riskAssessments);

  const member = members.find((m) => m.id === intervention.memberId);
  const plan = member ? plans.find((p) => p.id === member.planId) : undefined;
  const assessment = member ? riskAssessments[member.id] : undefined;

  switch (intervention.type) {
    case "email":
      return <EmailPreview intervention={intervention} member={member} />;
    case "discount":
      return <DiscountPreview intervention={intervention} plan={plan} />;
    case "phone_call":
      return (
        <PhoneCallPreview
          intervention={intervention}
          member={member}
          plan={plan}
          assessment={assessment}
        />
      );
    case "class_recommendation":
      return (
        <ClassRecommendationPreview
          intervention={intervention}
          member={member}
          classes={classes}
        />
      );
    case "pt_consultation":
      return (
        <PTConsultationPreview
          intervention={intervention}
          member={member}
          classes={classes}
        />
      );
    case "staff_task":
      return (
        <StaffTaskPreview
          intervention={intervention}
          member={member}
          assessment={assessment}
        />
      );
  }
}

// ─── Email Preview ────────────────────────────────────────────────

function EmailPreview({
  intervention,
  member,
}: {
  intervention: Intervention;
  member: MemberFull | undefined;
}) {
  const firstName = getFirstName(intervention.memberName);
  const [editing, setEditing] = useState(false);
  const [subject, setSubject] = useState(() => generateEmailSubject(intervention));
  const [body, setBody] = useState(() => generateEmailBody(intervention, firstName));

  return (
    <div className="space-y-3">
      {/* Email chrome */}
      <div className="overflow-hidden rounded-lg border border-peec-border-light bg-white">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-peec-border-light bg-stone-50 px-4 py-2">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-peec-text-muted" />
            <span className="text-2xs font-medium text-peec-dark">Email Preview</span>
          </div>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-2xs font-medium text-peec-text-secondary hover:bg-stone-200"
          >
            <Edit3 className="h-3 w-3" />
            {editing ? "Done" : "Edit"}
          </button>
        </div>

        {/* Email fields */}
        <div className="divide-y divide-peec-border-light text-2xs">
          <div className="flex gap-2 px-4 py-1.5">
            <span className="w-10 shrink-0 text-peec-text-muted">From</span>
            <span className="text-peec-dark">FitLife Gym &lt;hello@fitlifegym.com&gt;</span>
          </div>
          <div className="flex gap-2 px-4 py-1.5">
            <span className="w-10 shrink-0 text-peec-text-muted">To</span>
            <span className="text-peec-dark">
              {member?.email ?? `${firstName.toLowerCase()}@email.com`}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5">
            <span className="w-10 shrink-0 text-peec-text-muted">Subj</span>
            {editing ? (
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 rounded border border-peec-border-light px-1.5 py-0.5 text-2xs text-peec-dark outline-none focus:border-blue-300"
              />
            ) : (
              <span className="font-medium text-peec-dark">{subject}</span>
            )}
          </div>
        </div>

        {/* Email body */}
        <div className="border-t border-peec-border-light px-4 py-3">
          {editing ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full resize-none rounded border border-peec-border-light p-2 text-2xs leading-relaxed text-peec-dark outline-none focus:border-blue-300"
            />
          ) : (
            <div className="whitespace-pre-line text-2xs leading-relaxed text-peec-text-secondary">
              {body}
            </div>
          )}

          {/* CTA button */}
          {!editing && (
            <div className="mt-4 flex justify-center">
              <div className="rounded-lg bg-peec-dark px-6 py-2 text-2xs font-medium text-white">
                {getCTALabel(intervention)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Impact */}
      {intervention.estimatedImpact && (
        <div className="flex items-center gap-1.5 text-2xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          {intervention.estimatedImpact}
        </div>
      )}
    </div>
  );
}

// ─── Discount Preview ─────────────────────────────────────────────

function DiscountPreview({
  intervention,
  plan,
}: {
  intervention: Intervention;
  plan: Plan | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const { percent, months } = parseDiscount(intervention.description);
  const originalPrice = plan?.priceMonthly ?? 49.99;
  const discountedPrice = originalPrice * (1 - percent / 100);
  const totalSavings = (originalPrice - discountedPrice) * months;
  const revenueRetained = discountedPrice * months;

  return (
    <div className="space-y-3">
      {/* Summary card */}
      <div className="rounded-lg border border-peec-border-light bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-peec-dark">{percent}% off</p>
              <p className="text-2xs text-peec-text-muted">for {months} months</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-600">
              ${discountedPrice.toFixed(2)}/mo
            </p>
            <p className="text-2xs text-peec-text-muted line-through">
              ${originalPrice.toFixed(2)}/mo
            </p>
          </div>
        </div>

        {/* Member context */}
        <div className="mt-3 flex items-center gap-2 rounded-md bg-stone-50 px-3 py-2">
          <User className="h-3 w-3 text-peec-text-muted" />
          <span className="text-2xs text-peec-text-secondary">
            {intervention.memberName} &middot; {plan?.name ?? "Current Plan"}
          </span>
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-2xs font-medium text-peec-text-secondary hover:bg-stone-50"
        >
          {expanded ? "Hide" : "Show"} full breakdown
          {expanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {/* Expanded breakdown */}
        {expanded && (
          <div className="mt-2 space-y-2 border-t border-peec-border-light pt-3">
            <Row label="Current plan" value={plan?.name ?? "Standard"} />
            <Row label="Current price" value={`$${originalPrice.toFixed(2)}/mo`} />
            <Row label="Discount" value={`${percent}%`} highlight />
            <Row label="New price" value={`$${discountedPrice.toFixed(2)}/mo`} highlight />
            <Row label="Duration" value={`${months} months`} />
            <div className="my-1 border-t border-dashed border-peec-border-light" />
            <Row label="Member saves" value={`$${totalSavings.toFixed(2)} total`} />
            <Row
              label="Revenue retained"
              value={`$${revenueRetained.toFixed(2)}`}
              highlight
            />
            <Row
              label="vs. full churn loss"
              value={`-$${(originalPrice * 12).toFixed(2)}/yr`}
              muted
            />
          </div>
        )}
      </div>

      {/* Impact */}
      {intervention.estimatedImpact && (
        <div className="flex items-center gap-1.5 text-2xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          {intervention.estimatedImpact}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-2xs">
      <span className="text-peec-text-muted">{label}</span>
      <span
        className={
          highlight
            ? "font-medium text-green-600"
            : muted
              ? "text-peec-text-muted"
              : "font-medium text-peec-dark"
        }
      >
        {value}
      </span>
    </div>
  );
}

// ─── Phone Call Preview ───────────────────────────────────────────

function PhoneCallPreview({
  intervention,
  member,
  plan,
  assessment,
}: {
  intervention: Intervention;
  member: MemberFull | undefined;
  plan: Plan | undefined;
  assessment: RiskAssessment | undefined;
}) {
  const talkingPoints = useMemo(
    () => generateTalkingPoints(intervention, member, plan, assessment),
    [intervention, member, plan, assessment],
  );

  const daysSinceVisit = member?.lastCheckIn
    ? Math.floor((Date.now() - new Date(member.lastCheckIn).getTime()) / 86400000)
    : null;

  return (
    <div className="space-y-3">
      {/* Contact card */}
      <div className="rounded-lg border border-peec-border-light bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-xs font-medium text-peec-dark">
            {member?.avatar ?? intervention.memberName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-peec-dark">{intervention.memberName}</p>
            <div className="flex items-center gap-1 text-2xs text-peec-text-muted">
              <Phone className="h-3 w-3" />
              {member?.phone ?? "(555) 000-0000"}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xs text-peec-text-secondary">
              <Clock className="h-3 w-3" />
              {suggestTimeSlot()}
            </div>
          </div>
        </div>

        {/* Member context chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {plan && (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-2xs text-peec-text-secondary">
              {plan.name}
            </span>
          )}
          {daysSinceVisit !== null && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-2xs text-amber-700">
              Last visit: {daysSinceVisit === 0 ? "Today" : `${daysSinceVisit}d ago`}
            </span>
          )}
          {member?.memberSince && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-2xs text-blue-700">
              Member since {member.memberSince}
            </span>
          )}
        </div>
      </div>

      {/* Talking points */}
      <div className="rounded-lg border border-peec-border-light bg-white p-4">
        <p className="mb-2 text-2xs font-medium uppercase tracking-wide text-peec-text-muted">
          Talking Points
        </p>
        <ul className="space-y-2">
          {talkingPoints.map((point, i) => (
            <li key={i} className="flex gap-2 text-2xs leading-relaxed text-peec-text-secondary">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-stone-100 text-2xs font-medium text-peec-dark">
                {i + 1}
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Impact */}
      {intervention.estimatedImpact && (
        <div className="flex items-center gap-1.5 text-2xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          {intervention.estimatedImpact}
        </div>
      )}
    </div>
  );
}

// ─── Class Recommendation Preview ─────────────────────────────────

function ClassRecommendationPreview({
  intervention,
  member,
  classes,
}: {
  intervention: Intervention;
  member: MemberFull | undefined;
  classes: GymClass[];
}) {
  const suggestedClasses = useMemo(() => {
    if (classes.length === 0) return [];

    const preferredDays = member ? getPreferredDays(member) : [];

    // Score each class: prefer classes on member's preferred days with available spots
    const scored = classes
      .filter((c) => c.enrolled < c.capacity)
      .map((c) => {
        let score = 0;
        const dayIndex = preferredDays.indexOf(c.dayOfWeek);
        if (dayIndex !== -1) score += 10 - dayIndex * 3;
        score += (c.capacity - c.enrolled) / c.capacity * 5;
        return { cls: c, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map((s) => s.cls);
  }, [classes, member]);

  const preferredDays = member ? getPreferredDays(member) : [];

  return (
    <div className="space-y-3">
      {/* Schedule context */}
      {preferredDays.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-2xs text-blue-700">
            {getFirstName(intervention.memberName)} usually visits on{" "}
            {preferredDays.map((d) => dayFullNames[d]).join(", ")}
          </span>
        </div>
      )}

      {/* Suggested classes */}
      <div className="space-y-2">
        {suggestedClasses.map((cls) => (
          <div
            key={cls.id}
            className="rounded-lg border border-peec-border-light bg-white p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cls.color }}
                  />
                  <p className="text-xs font-medium text-peec-dark">{cls.name}</p>
                  {preferredDays.includes(cls.dayOfWeek) && (
                    <span className="rounded bg-green-50 px-1.5 py-0.5 text-2xs text-green-600">
                      Matches schedule
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-2xs text-peec-text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {dayFullNames[cls.dayOfWeek]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cls.startTime} – {cls.endTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {cls.trainerName}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-2xs text-peec-text-muted">
                  <Users className="h-3 w-3" />
                  {cls.enrolled}/{cls.capacity}
                </div>
                <div className="mt-0.5 h-1 w-12 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-green-400"
                    style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {suggestedClasses.length === 0 && (
          <p className="py-4 text-center text-2xs text-peec-text-muted">
            No classes with availability found
          </p>
        )}
      </div>

      {/* Impact */}
      {intervention.estimatedImpact && (
        <div className="flex items-center gap-1.5 text-2xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          {intervention.estimatedImpact}
        </div>
      )}
    </div>
  );
}

// ─── PT Consultation Preview ──────────────────────────────────────

function PTConsultationPreview({
  intervention,
  member,
  classes,
}: {
  intervention: Intervention;
  member: MemberFull | undefined;
  classes: GymClass[];
}) {
  // Find PT trainers from existing classes
  const trainers = useMemo(() => {
    const seen = new Set<string>();
    const result: { name: string; specialty: string }[] = [];

    for (const cls of classes) {
      if (!seen.has(cls.trainerName)) {
        seen.add(cls.trainerName);
        result.push({ name: cls.trainerName, specialty: cls.type });
      }
    }

    return result.slice(0, 3);
  }, [classes]);

  // Suggest 2 time slots based on member's preferred days
  const slots = useMemo(() => {
    const preferred = member ? getPreferredDays(member) : [];
    const suggestions: { day: string; time: string }[] = [];
    const daysToUse = preferred.length > 0 ? preferred : (["tue", "thu"] as DayOfWeek[]);

    for (const day of daysToUse.slice(0, 2)) {
      suggestions.push({
        day: dayFullNames[day],
        time: "10:00 AM – 11:00 AM",
      });
    }

    return suggestions;
  }, [member]);

  return (
    <div className="space-y-3">
      {/* Consultation card */}
      <div className="rounded-lg border border-peec-border-light bg-white p-4">
        <p className="mb-3 text-2xs font-medium uppercase tracking-wide text-peec-text-muted">
          Complimentary PT Session
        </p>

        {/* Member */}
        <div className="flex items-center gap-3 rounded-md bg-stone-50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-2xs font-medium text-peec-dark">
            {member?.avatar ?? intervention.memberName.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-medium text-peec-dark">{intervention.memberName}</p>
            <p className="text-2xs text-peec-text-muted">
              {member?.memberSince ? `Member since ${member.memberSince}` : "New member"}
            </p>
          </div>
        </div>

        {/* Suggested trainers */}
        {trainers.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-2xs text-peec-text-muted">Suggested trainer</p>
            <div className="space-y-1.5">
              {trainers.slice(0, 2).map((trainer) => (
                <div
                  key={trainer.name}
                  className="flex items-center justify-between rounded-md border border-peec-border-light px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-peec-text-muted" />
                    <span className="text-2xs font-medium text-peec-dark">{trainer.name}</span>
                  </div>
                  <span className="rounded bg-stone-100 px-1.5 py-0.5 text-2xs capitalize text-peec-text-muted">
                    {trainer.specialty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time slots */}
        <div className="mt-3">
          <p className="mb-1.5 text-2xs text-peec-text-muted">Available slots</p>
          <div className="flex gap-2">
            {slots.map((slot) => (
              <div
                key={slot.day}
                className="flex-1 rounded-md border border-peec-border-light px-3 py-2 text-center"
              >
                <p className="text-2xs font-medium text-peec-dark">{slot.day}</p>
                <p className="mt-0.5 flex items-center justify-center gap-1 text-2xs text-peec-text-muted">
                  <Clock className="h-3 w-3" />
                  {slot.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact */}
      {intervention.estimatedImpact && (
        <div className="flex items-center gap-1.5 text-2xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          {intervention.estimatedImpact}
        </div>
      )}
    </div>
  );
}

// ─── Staff Task Preview ───────────────────────────────────────────

function StaffTaskPreview({
  intervention,
  member,
  assessment,
}: {
  intervention: Intervention;
  member: MemberFull | undefined;
  assessment: RiskAssessment | undefined;
}) {
  const daysSinceVisit = member?.lastCheckIn
    ? Math.floor((Date.now() - new Date(member.lastCheckIn).getTime()) / 86400000)
    : null;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-peec-border-light bg-white p-4">
        {/* Task header */}
        <div className="flex items-center gap-2 border-b border-peec-border-light pb-3">
          <MapPin className="h-3.5 w-3.5 text-peec-text-muted" />
          <span className="text-2xs font-medium uppercase tracking-wide text-peec-text-muted">
            Staff Task
          </span>
        </div>

        {/* Task details */}
        <div className="mt-3 space-y-2">
          <div>
            <p className="text-xs font-medium text-peec-dark">{intervention.title}</p>
            <p className="mt-0.5 text-2xs leading-relaxed text-peec-text-secondary">
              {intervention.description}
            </p>
          </div>

          {/* Member context */}
          <div className="rounded-md bg-stone-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-2xs font-medium text-peec-dark">
                {member?.avatar ?? intervention.memberName.charAt(0)}
              </div>
              <div>
                <p className="text-2xs font-medium text-peec-dark">
                  {intervention.memberName}
                </p>
                <div className="flex gap-2 text-2xs text-peec-text-muted">
                  {daysSinceVisit !== null && (
                    <span>Last visit: {daysSinceVisit === 0 ? "today" : `${daysSinceVisit}d ago`}</span>
                  )}
                  {member?.status && (
                    <span className="capitalize">&middot; {member.status}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Risk factors */}
            {member && member.riskFactors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {member.riskFactors.slice(0, 4).map((factor) => (
                  <span
                    key={factor}
                    className="rounded-full bg-amber-50 px-2 py-0.5 text-2xs text-amber-700"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Risk summary from assessment */}
          {assessment && (
            <div className="rounded-md bg-red-50/50 px-3 py-2">
              <p className="text-2xs text-red-700">{assessment.explanation.summary}</p>
            </div>
          )}
        </div>
      </div>

      {/* Impact */}
      {intervention.estimatedImpact && (
        <div className="flex items-center gap-1.5 text-2xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          {intervention.estimatedImpact}
        </div>
      )}
    </div>
  );
}
