"use client";

import type { GymClass, DayOfWeek } from "@/lib/types";

const dayLabels: Record<DayOfWeek, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const dayOrder: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM - 10 PM

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function formatHour(h: number): string {
  if (h === 0 || h === 12) return `${h === 0 ? 12 : 12}${h < 12 ? "AM" : "PM"}`;
  return `${h > 12 ? h - 12 : h}${h >= 12 ? "PM" : "AM"}`;
}

interface WeekCalendarProps {
  classes: GymClass[];
  onClassClick: (cls: GymClass) => void;
}

export function WeekCalendar({ classes, onClassClick }: WeekCalendarProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-peec-border-light bg-white">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-peec-border-light">
          <div className="px-2 py-3" />
          {dayOrder.map((day) => (
            <div key={day} className="border-l border-peec-border-light px-2 py-3 text-center">
              <p className="text-xs font-medium text-peec-dark">{dayLabels[day].slice(0, 3)}</p>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative">
          {hours.map((h) => (
            <div key={h} className="grid grid-cols-8 border-b border-peec-border-light/30" style={{ height: 60 }}>
              <div className="flex items-start justify-end px-2 pt-1">
                <span className="text-2xs text-peec-text-muted">{formatHour(h)}</span>
              </div>
              {dayOrder.map((day) => (
                <div key={day} className="relative border-l border-peec-border-light/30" />
              ))}
            </div>
          ))}

          {/* Class blocks */}
          {classes.map((cls) => {
            const dayIdx = dayOrder.indexOf(cls.dayOfWeek);
            if (dayIdx === -1) return null;

            const startMin = timeToMinutes(cls.startTime) - 360; // offset from 6 AM
            const endMin = timeToMinutes(cls.endTime) - 360;
            const duration = endMin - startMin;
            const top = startMin;
            const height = duration;
            const left = `${((dayIdx + 1) / 8) * 100}%`;
            const width = `${(1 / 8) * 100}%`;

            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => onClassClick(cls)}
                className="absolute rounded-md p-1.5 text-left transition-opacity hover:opacity-90"
                style={{
                  top,
                  height,
                  left,
                  width,
                  backgroundColor: `${cls.color}20`,
                  borderLeft: `3px solid ${cls.color}`,
                }}
              >
                <p className="truncate text-2xs font-medium" style={{ color: cls.color }}>
                  {cls.name}
                </p>
                <p className="truncate text-2xs text-peec-text-muted">
                  {cls.trainerName}
                </p>
                <div className="mt-0.5 flex items-center gap-1">
                  <div className="h-1 flex-1 rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(cls.enrolled / cls.capacity) * 100}%`,
                        backgroundColor: cls.color,
                      }}
                    />
                  </div>
                  <span className="text-[8px] text-peec-text-muted">
                    {cls.enrolled}/{cls.capacity}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
