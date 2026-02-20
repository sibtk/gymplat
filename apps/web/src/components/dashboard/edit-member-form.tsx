"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";

import type { MemberFull } from "@/lib/types";

const editSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  emergencyContact: z.string().min(5),
  locationId: z.string().min(1),
});

type EditValues = z.infer<typeof editSchema>;

interface EditMemberFormProps {
  member: MemberFull;
  open: boolean;
  onClose: () => void;
}

export function EditMemberForm({ member, open, onClose }: EditMemberFormProps) {
  const { toast } = useToast();
  const updateMember = useGymStore((s) => s.updateMember);
  const locations = useGymStore((s) => s.locations);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      emergencyContact: member.emergencyContact,
      locationId: member.locationId,
    },
  });

  const onSubmit = (data: EditValues) => {
    updateMember(member.id, data);
    toast(`${data.name} updated successfully`);
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[71] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="w-full max-w-md rounded-xl border border-peec-border-light bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-peec-dark">Edit Member</h3>
                <button type="button" onClick={onClose} className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-peec-dark">Name</label>
                  <input {...register("name")} className={inputClass} />
                  {errors.name && <p className="mt-1 text-2xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-peec-dark">Email</label>
                  <input {...register("email")} className={inputClass} />
                  {errors.email && <p className="mt-1 text-2xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Phone</label>
                    <input {...register("phone")} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-peec-dark">Location</label>
                    <select {...register("locationId")} className={inputClass}>
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-peec-dark">Address</label>
                  <input {...register("address")} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-peec-dark">Emergency Contact</label>
                  <input {...register("emergencyContact")} className={inputClass} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={onClose} className="rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark hover:bg-stone-50">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
