"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Users, X } from "lucide-react";
import { useMemo } from "react";

import { useGymStore } from "@/lib/store";

import type { GymClass } from "@/lib/types";

interface ClassDetailDrawerProps {
  gymClass: GymClass | null;
  open: boolean;
  onClose: () => void;
}

const dayLabels: Record<string, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
};

export function ClassDetailDrawer({ gymClass, open, onClose }: ClassDetailDrawerProps) {
  const allBookings = useGymStore((s) => s.classBookings);
  const bookings = useMemo(
    () => (gymClass ? allBookings.filter((b) => b.classId === gymClass.id) : []),
    [allBookings, gymClass],
  );

  if (!gymClass) return null;

  const fillPct = (gymClass.enrolled / gymClass.capacity) * 100;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white shadow-xl tablet:w-[400px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5 text-peec-text-muted hover:bg-stone-100">
                <X className="h-5 w-5" />
              </button>

              {/* Color bar + name */}
              <div className="mb-6">
                <div className="mb-3 h-2 w-12 rounded-full" style={{ backgroundColor: gymClass.color }} />
                <h2 className="text-lg font-bold text-peec-dark">{gymClass.name}</h2>
                <p className="text-xs text-peec-text-muted">{gymClass.description}</p>
              </div>

              {/* Details grid */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <DetailCard label="Day" value={dayLabels[gymClass.dayOfWeek] ?? gymClass.dayOfWeek} />
                <DetailCard label="Time" value={`${gymClass.startTime} - ${gymClass.endTime}`} />
                <DetailCard label="Trainer" value={gymClass.trainerName} />
                <DetailCard label="Location" value={gymClass.locationName} />
                <DetailCard label="Type" value={gymClass.type} />
                <DetailCard label="Capacity" value={`${gymClass.enrolled}/${gymClass.capacity}`} />
              </div>

              {/* Capacity meter */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-peec-dark">Capacity</span>
                  <span className="text-xs text-peec-text-secondary">{Math.round(fillPct)}% full</span>
                </div>
                <div className="h-3 rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${fillPct}%`, backgroundColor: gymClass.color }}
                  />
                </div>
              </div>

              {/* Bookings */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-peec-text-muted" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-peec-text-muted">
                    Bookings ({bookings.length})
                  </h3>
                </div>
                {bookings.length === 0 ? (
                  <p className="text-xs text-peec-text-muted">No bookings yet</p>
                ) : (
                  <div className="space-y-2">
                    {bookings.map((b) => (
                      <div key={b.id} className="flex items-center justify-between rounded-lg border border-peec-border-light/50 p-3">
                        <span className="text-xs font-medium text-peec-dark">{b.memberName}</span>
                        <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
                          b.status === "confirmed" ? "bg-green-50 text-green-700" :
                          b.status === "attended" ? "bg-blue-50 text-blue-700" :
                          b.status === "cancelled" ? "bg-stone-100 text-stone-600" :
                          "bg-red-50 text-red-700"
                        }`}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-peec-border-light/50 p-3">
      <p className="text-2xs text-peec-text-muted">{label}</p>
      <p className="text-sm font-medium capitalize text-peec-dark">{value}</p>
    </div>
  );
}
