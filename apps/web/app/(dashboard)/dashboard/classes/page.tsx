"use client";

import { CalendarDays, List, Plus } from "lucide-react";
import { useState } from "react";

import { AddClassForm } from "@/components/dashboard/add-class-form";
import { ClassDetailDrawer } from "@/components/dashboard/class-detail-drawer";
import { DataTable } from "@/components/dashboard/data-table";
import { PageEntrance } from "@/components/dashboard/motion";
import { WeekCalendar } from "@/components/dashboard/week-calendar";
import { useGymStore } from "@/lib/store";

import type { GymClass } from "@/lib/types";

type ViewMode = "week" | "list";

const dayLabels: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu",
  fri: "Fri", sat: "Sat", sun: "Sun",
};

const classColumns = [
  {
    key: "name",
    label: "Class",
    render: (row: GymClass) => (
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: row.color }} />
        <span className="text-sm font-medium text-peec-dark">{row.name}</span>
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (row: GymClass) => (
      <span className="rounded bg-stone-50 px-2 py-0.5 text-xs capitalize text-peec-text-secondary">{row.type}</span>
    ),
  },
  {
    key: "day",
    label: "Day",
    render: (row: GymClass) => <span className="text-xs text-peec-text-secondary">{dayLabels[row.dayOfWeek]}</span>,
  },
  {
    key: "time",
    label: "Time",
    render: (row: GymClass) => <span className="text-xs text-peec-text-secondary">{row.startTime} - {row.endTime}</span>,
  },
  {
    key: "trainer",
    label: "Trainer",
    render: (row: GymClass) => <span className="text-xs text-peec-text-secondary">{row.trainerName}</span>,
    className: "hidden tablet:table-cell",
  },
  {
    key: "capacity",
    label: "Capacity",
    render: (row: GymClass) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 rounded-full bg-stone-100">
          <div className="h-full rounded-full" style={{ width: `${(row.enrolled / row.capacity) * 100}%`, backgroundColor: row.color }} />
        </div>
        <span className="text-2xs text-peec-text-muted">{row.enrolled}/{row.capacity}</span>
      </div>
    ),
    className: "hidden tablet:table-cell",
  },
];

export default function ClassesPage() {
  const classes = useGymStore((s) => s.classes);
  const [view, setView] = useState<ViewMode>("week");
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <PageEntrance>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-peec-dark">Classes</h1>
            <p className="text-sm text-peec-text-muted">Schedule and manage gym classes</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-peec-border-light bg-stone-50 p-0.5">
              <button
                type="button"
                onClick={() => setView("week")}
                className={`rounded-md px-2.5 py-1.5 ${view === "week" ? "bg-white text-peec-dark shadow-sm" : "text-peec-text-muted"}`}
              >
                <CalendarDays className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded-md px-2.5 py-1.5 ${view === "list" ? "bg-white text-peec-dark shadow-sm" : "text-peec-text-muted"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800"
            >
              <Plus className="h-3.5 w-3.5" /> Add Class
            </button>
          </div>
        </div>

        {view === "week" ? (
          <WeekCalendar classes={classes} onClassClick={(cls) => setSelectedClass(cls)} />
        ) : (
          <DataTable<GymClass>
            data={classes}
            columns={classColumns}
            searchable
            searchKeys={["name", "trainerName"]}
            filters={[
              { label: "Strength", value: "strength" },
              { label: "Cardio", value: "cardio" },
              { label: "Yoga", value: "yoga" },
              { label: "HIIT", value: "hiit" },
            ]}
            filterKey="type"
            emptyMessage="No classes scheduled"
            onRowClick={(cls) => setSelectedClass(cls)}
          />
        )}
      </div>

      <ClassDetailDrawer gymClass={selectedClass} open={!!selectedClass} onClose={() => setSelectedClass(null)} />
      <AddClassForm open={addOpen} onClose={() => setAddOpen(false)} />
    </PageEntrance>
  );
}
