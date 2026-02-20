"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

import type { ClassType, DayOfWeek } from "@/lib/types";

const classSchema = z.object({
  name: z.string().min(2, "Name required"),
  type: z.string().min(1, "Type required"),
  trainerId: z.string().min(1, "Trainer required"),
  locationId: z.string().min(1, "Location required"),
  dayOfWeek: z.string().min(1, "Day required"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  capacity: z.coerce.number().min(1, "Capacity required"),
  description: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

const classTypes: { value: ClassType; label: string }[] = [
  { value: "strength", label: "Strength" },
  { value: "cardio", label: "Cardio" },
  { value: "yoga", label: "Yoga" },
  { value: "hiit", label: "HIIT" },
  { value: "pilates", label: "Pilates" },
  { value: "boxing", label: "Boxing" },
  { value: "crossfit", label: "CrossFit" },
  { value: "spin", label: "Spin" },
];

const days: { value: DayOfWeek; label: string }[] = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

const typeColors: Record<string, string> = {
  strength: "#3b82f6",
  cardio: "#ef4444",
  yoga: "#22c55e",
  hiit: "#f59e0b",
  pilates: "#8b5cf6",
  boxing: "#ec4899",
  crossfit: "#14b8a6",
  spin: "#f97316",
};

interface AddClassFormProps {
  open: boolean;
  onClose: () => void;
}

export function AddClassForm({ open, onClose }: AddClassFormProps) {
  const { toast } = useToast();
  const addClass = useGymStore((s) => s.addClass);
  const staffMembers = useGymStore((s) => s.staffMembers);
  const locations = useGymStore((s) => s.locations);
  const trainers = staffMembers.filter((s) => s.role === "trainer");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
  });

  const onSubmit = (data: ClassFormValues) => {
    const trainer = staffMembers.find((s) => s.id === data.trainerId);
    const location = locations.find((l) => l.id === data.locationId);
    addClass({
      id: generateId("cls"),
      name: data.name,
      type: data.type as ClassType,
      trainerId: data.trainerId,
      trainerName: trainer?.name ?? "Unknown",
      locationId: data.locationId,
      locationName: location?.name ?? "Unknown",
      dayOfWeek: data.dayOfWeek as DayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      capacity: data.capacity,
      enrolled: 0,
      color: typeColors[data.type] ?? "#3b82f6",
      description: data.description ?? "",
    });
    toast(`${data.name} class added`);
    reset();
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-0 z-[61] flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="w-full max-w-md rounded-xl border border-peec-border-light bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-peec-dark">Add Class</h3>
                <button type="button" onClick={onClose} className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-peec-dark">Class Name</label>
                  <input {...register("name")} className={inputClass} placeholder="e.g., Power Yoga" />
                  {errors.name && <p className="mt-1 text-2xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Type</label>
                    <select {...register("type")} className={inputClass}>
                      <option value="">Select...</option>
                      {classTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Day</label>
                    <select {...register("dayOfWeek")} className={inputClass}>
                      <option value="">Select...</option>
                      {days.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Trainer</label>
                    <select {...register("trainerId")} className={inputClass}>
                      <option value="">Select...</option>
                      {trainers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Location</label>
                    <select {...register("locationId")} className={inputClass}>
                      <option value="">Select...</option>
                      {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Start</label>
                    <input {...register("startTime")} type="time" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">End</label>
                    <input {...register("endTime")} type="time" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Capacity</label>
                    <input {...register("capacity")} type="number" className={inputClass} placeholder="20" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-peec-dark">Description</label>
                  <input {...register("description")} className={inputClass} placeholder="Class description..." />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={onClose} className="rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark hover:bg-stone-50">Cancel</button>
                  <button type="submit" className="rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800">Add Class</button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
