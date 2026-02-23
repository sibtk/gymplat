"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Eye, EyeOff, MapPin, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { PageEntrance } from "@/components/dashboard/motion";
import { useToast } from "@/components/dashboard/toast";
import { ToggleSwitch } from "@/components/dashboard/toggle-switch";
import { useSimulation } from "@/hooks/use-simulation";
import { useGymStore } from "@/lib/store";
import { formatCurrency, generateId } from "@/lib/utils";

import type { AutomationLevel } from "@/lib/retention/types";

// ─── Form Schema ─────────────────────────────────────────────────

const gymSchema = z.object({
  name: z.string().min(1, "Gym name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
});

type GymFormValues = z.infer<typeof gymSchema>;

const locationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  address: z.string().min(1, "Address is required"),
  timezone: z.string().min(1, "Timezone is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

type LocationFormValues = z.infer<typeof locationSchema>;

const planSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  priceMonthly: z.coerce.number().min(0, "Price must be non-negative"),
  priceAnnual: z.coerce.number().min(0, "Price must be non-negative"),
  type: z.string().min(1, "Type is required"),
  features: z.string().min(1, "At least one feature is required"),
});

type PlanFormValues = z.infer<typeof planSchema>;

// ─── Tab types ───────────────────────────────────────────────────

const tabs = ["General", "Team", "Locations", "Plans", "Retention", "Notifications", "API"] as const;
type Tab = (typeof tabs)[number];

// ─── Notification Settings ───────────────────────────────────────

const notifCategories = [
  "New signups",
  "Cancellations",
  "Payment failures",
  "At-risk alerts",
  "Weekly reports",
];

const notifChannels = ["Email", "Push", "SMS"];

const roleBadgeColors: Record<string, string> = {
  owner: "bg-purple-50 text-purple-700",
  manager: "bg-blue-50 text-blue-700",
  trainer: "bg-green-50 text-green-700",
  "front-desk": "bg-stone-100 text-stone-600",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const { toast } = useToast();

  return (
    <PageEntrance>
      <div className="space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-peec-dark">Settings</h1>
          <p className="text-sm text-peec-text-muted">
            Manage your gym configuration
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-peec-border-light bg-stone-50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-peec-dark shadow-sm"
                  : "text-peec-text-muted hover:text-peec-dark"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content with fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "General" && <GeneralTab toast={toast} />}
            {activeTab === "Team" && <TeamTab toast={toast} />}
            {activeTab === "Locations" && <LocationsTab toast={toast} />}
            {activeTab === "Plans" && <PlansTab toast={toast} />}
            {activeTab === "Retention" && <RetentionTab toast={toast} />}
            {activeTab === "Notifications" && <NotificationsTab />}
            {activeTab === "API" && <ApiTab toast={toast} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageEntrance>
  );
}

// ─── General Tab ─────────────────────────────────────────────────

function GeneralTab({ toast }: { toast: (msg: string) => void }) {
  const gymSettings = useGymStore((s) => s.gymSettings);
  const updateGymSettings = useGymStore((s) => s.updateGymSettings);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GymFormValues>({
    resolver: zodResolver(gymSchema),
    defaultValues: {
      name: gymSettings.name,
      address: gymSettings.address,
      phone: gymSettings.phone,
      email: gymSettings.email,
    },
  });

  const onSubmit = (data: GymFormValues) => {
    updateGymSettings(data);
    toast("Settings saved successfully");
  };

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <h3 className="mb-1 text-sm font-medium text-peec-dark">Gym Information</h3>
      <p className="mb-6 text-xs text-peec-text-muted">
        Update your gym&apos;s basic information
      </p>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-4"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-peec-dark">
            Gym Name
          </label>
          <input
            {...register("name")}
            className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark"
          />
          {errors.name && (
            <p className="mt-1 text-2xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-peec-dark">
            Address
          </label>
          <input
            {...register("address")}
            className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark"
          />
          {errors.address && (
            <p className="mt-1 text-2xs text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-peec-dark">
              Phone
            </label>
            <input
              {...register("phone")}
              className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark"
            />
            {errors.phone && (
              <p className="mt-1 text-2xs text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-peec-dark">
              Email
            </label>
            <input
              {...register("email")}
              className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark"
            />
            {errors.email && (
              <p className="mt-1 text-2xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-peec-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Team Tab ────────────────────────────────────────────────────

function TeamTab({ toast }: { toast: (msg: string) => void }) {
  const staff = useGymStore((s) => s.staffMembers);

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-peec-dark">Team Members</h3>
          <p className="text-xs text-peec-text-muted">
            Manage staff access and roles
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast("Invitation sent")}
          className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-800"
        >
          <Plus className="h-3.5 w-3.5" />
          Invite
        </button>
      </div>

      <div className="space-y-3">
        {staff.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-lg border border-peec-border-light/50 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-xs font-medium text-peec-dark">
                {s.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-peec-dark">{s.name}</p>
                <p className="text-2xs text-peec-text-muted">{s.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-2xs font-medium capitalize ${
                  roleBadgeColors[s.role] ?? "bg-stone-100 text-stone-600"
                }`}
              >
                {s.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Locations Tab ───────────────────────────────────────────────

function LocationsTab({ toast }: { toast: (msg: string) => void }) {
  const locations = useGymStore((s) => s.locations);
  const addLocation = useGymStore((s) => s.addLocation);
  const removeLocation = useGymStore((s) => s.removeLocation);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { name: "", address: "", timezone: "America/New_York", capacity: 200 },
  });

  const onSubmit = (data: LocationFormValues) => {
    addLocation({
      id: generateId("loc"),
      name: data.name,
      address: data.address,
      timezone: data.timezone,
      memberCount: 0,
      capacity: data.capacity,
    });
    toast("Location added");
    reset();
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      removeLocation(deleteId);
      toast("Location removed");
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-peec-dark">Locations</h3>
            <p className="text-xs text-peec-text-muted">Manage your gym locations</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-3 py-2 text-xs font-medium text-white hover:bg-stone-800"
          >
            <Plus className="h-3.5 w-3.5" /> Add Location
          </button>
        </div>

        {showForm && (
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="mb-6 space-y-3 rounded-lg border border-peec-border-light bg-stone-50 p-4">
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Name</label>
                <input {...register("name")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none" placeholder="e.g., Downtown" />
                {errors.name && <p className="mt-1 text-2xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Address</label>
                <input {...register("address")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none" placeholder="123 Main St" />
                {errors.address && <p className="mt-1 text-2xs text-red-500">{errors.address.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Timezone</label>
                <input {...register("timezone")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Capacity</label>
                <input type="number" {...register("capacity")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none" />
                {errors.capacity && <p className="mt-1 text-2xs text-red-500">{errors.capacity.message}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); reset(); }} className="rounded-lg border border-peec-border-light px-3 py-1.5 text-xs font-medium text-peec-dark hover:bg-stone-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-peec-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800">Save</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {locations.map((loc) => (
            <div key={loc.id} className="flex items-center justify-between rounded-lg border border-peec-border-light/50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-peec-dark">{loc.name}</p>
                  <p className="text-2xs text-peec-text-muted">{loc.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-peec-text-secondary">{loc.memberCount} members</span>
                <button
                  type="button"
                  onClick={() => setDeleteId(loc.id)}
                  className="rounded p-1 text-peec-text-muted hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {locations.length === 0 && (
            <p className="text-center text-sm text-peec-text-muted">No locations configured</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Location"
        description="Are you sure you want to delete this location? Members assigned to this location will need to be reassigned."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

// ─── Plans Tab ───────────────────────────────────────────────────

function PlansTab({ toast }: { toast: (msg: string) => void }) {
  const plans = useGymStore((s) => s.plans);
  const addPlan = useGymStore((s) => s.addPlan);
  const removePlan = useGymStore((s) => s.removePlan);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: { name: "", priceMonthly: 0, priceAnnual: 0, type: "standard", features: "" },
  });

  const onSubmit = (data: PlanFormValues) => {
    addPlan({
      id: generateId("plan"),
      name: data.name,
      priceMonthly: data.priceMonthly,
      priceAnnual: data.priceAnnual,
      type: data.type as "base" | "standard" | "premium" | "discount" | "b2b",
      features: data.features.split(",").map((f) => f.trim()).filter(Boolean),
      memberCount: 0,
    });
    toast("Plan added");
    reset();
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      removePlan(deleteId);
      toast("Plan removed");
      setDeleteId(null);
    }
  };

  const planTypeBadge: Record<string, string> = {
    base: "bg-blue-50 text-blue-700",
    standard: "bg-green-50 text-green-700",
    premium: "bg-amber-50 text-amber-700",
    discount: "bg-red-50 text-red-700",
    b2b: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-peec-dark">Membership Plans</h3>
            <p className="text-xs text-peec-text-muted">Configure membership plans and pricing</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-3 py-2 text-xs font-medium text-white hover:bg-stone-800"
          >
            <Plus className="h-3.5 w-3.5" /> Add Plan
          </button>
        </div>

        {showForm && (
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="mb-6 space-y-3 rounded-lg border border-peec-border-light bg-stone-50 p-4">
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Plan Name</label>
                <input {...register("name")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none" placeholder="e.g., Premium" />
                {errors.name && <p className="mt-1 text-2xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Type</label>
                <select {...register("type")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none">
                  <option value="base">Base</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="discount">Discount</option>
                  <option value="b2b">B2B</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Monthly Price ($)</label>
                <input type="number" step="0.01" {...register("priceMonthly")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none" />
                {errors.priceMonthly && <p className="mt-1 text-2xs text-red-500">{errors.priceMonthly.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-peec-dark">Annual Price ($)</label>
                <input type="number" step="0.01" {...register("priceAnnual")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none" />
                {errors.priceAnnual && <p className="mt-1 text-2xs text-red-500">{errors.priceAnnual.message}</p>}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-peec-dark">Features (comma-separated)</label>
              <input {...register("features")} className="w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none" placeholder="24/7 Access, Group Classes, Personal Trainer" />
              {errors.features && <p className="mt-1 text-2xs text-red-500">{errors.features.message}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); reset(); }} className="rounded-lg border border-peec-border-light px-3 py-1.5 text-xs font-medium text-peec-dark hover:bg-stone-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-peec-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800">Save</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-peec-border-light p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-peec-dark">{plan.name}</h4>
                <span className={`rounded-full px-2 py-0.5 text-2xs font-medium capitalize ${planTypeBadge[plan.type] ?? "bg-stone-100 text-stone-600"}`}>
                  {plan.type}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-lg font-bold text-peec-dark">{formatCurrency(plan.priceMonthly)}<span className="text-xs font-normal text-peec-text-muted">/mo</span></p>
                <p className="text-2xs text-peec-text-muted">{formatCurrency(plan.priceAnnual)}/yr</p>
              </div>
              <div className="mb-3 space-y-1">
                {plan.features.slice(0, 4).map((feature) => (
                  <p key={feature} className="text-2xs text-peec-text-secondary">• {feature}</p>
                ))}
                {plan.features.length > 4 && (
                  <p className="text-2xs text-peec-text-muted">+{plan.features.length - 4} more</p>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-peec-border-light/50 pt-3">
                <span className="text-2xs text-peec-text-muted">{plan.memberCount} members</span>
                <button
                  type="button"
                  onClick={() => setDeleteId(plan.id)}
                  className="rounded p-1 text-peec-text-muted hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Plan"
        description="Are you sure you want to delete this plan? Existing subscriptions on this plan will need to be migrated."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

// ─── Notifications Tab ───────────────────────────────────────────

function NotificationsTab() {
  const [settings, setSettings] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    for (const cat of notifCategories) {
      init[cat] = {};
      for (const ch of notifChannels) {
        init[cat][ch] = ch === "Email"; // Email on by default
      }
    }
    return init;
  });

  const toggle = (category: string, channel: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !(prev[category]?.[channel] ?? false),
      },
    }));
  };

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <h3 className="mb-1 text-sm font-medium text-peec-dark">Notification Preferences</h3>
      <p className="mb-6 text-xs text-peec-text-muted">
        Choose how you want to be notified
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-peec-border-light">
              <th className="pb-3 pr-8 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted">
                Category
              </th>
              {notifChannels.map((ch) => (
                <th
                  key={ch}
                  className="pb-3 text-center text-2xs font-medium uppercase tracking-wider text-peec-text-muted"
                >
                  {ch}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notifCategories.map((cat) => (
              <tr key={cat} className="border-b border-peec-border-light/50 last:border-0">
                <td className="py-4 pr-8 text-sm text-peec-dark">{cat}</td>
                {notifChannels.map((ch) => (
                  <td key={ch} className="py-4 text-center">
                    <div className="flex justify-center">
                      <ToggleSwitch
                        checked={settings[cat]?.[ch] ?? false}
                        onChange={() => toggle(cat, ch)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── API Tab ─────────────────────────────────────────────────────

function ApiTab({ toast }: { toast: (msg: string) => void }) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const apiKey = "gym_live_sk_7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c";
  const webhookUrl = "https://api.irontemple.com/webhooks/stripe";

  const copyKey = () => {
    void navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* API Key */}
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <h3 className="mb-1 text-sm font-medium text-peec-dark">API Key</h3>
        <p className="mb-4 text-xs text-peec-text-muted">
          Use this key to authenticate API requests
        </p>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center rounded-lg border border-peec-border-light bg-stone-50 px-3 py-2">
            <code className="flex-1 text-xs text-peec-dark">
              {showKey ? apiKey : "gym_live_sk_••••••••••••••••••••••••"}
            </code>
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="ml-2 text-peec-text-muted hover:text-peec-dark"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            type="button"
            onClick={copyKey}
            className="rounded-lg border border-peec-border-light p-2 text-peec-text-muted transition-colors hover:bg-stone-50 hover:text-peec-dark"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => toast("API key regenerated")}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
        >
          <RefreshCw className="h-3 w-3" />
          Regenerate Key
        </button>
      </div>

      {/* Webhook URL */}
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <h3 className="mb-1 text-sm font-medium text-peec-dark">Webhook URL</h3>
        <p className="mb-4 text-xs text-peec-text-muted">
          Stripe sends payment events to this endpoint
        </p>

        <div className="flex items-center rounded-lg border border-peec-border-light bg-stone-50 px-3 py-2">
          <code className="flex-1 text-xs text-peec-dark">{webhookUrl}</code>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(webhookUrl);
              toast("Webhook URL copied");
            }}
            className="ml-2 text-peec-text-muted hover:text-peec-dark"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-green-600">Connected and receiving events</span>
        </div>
      </div>
    </div>
  );
}

// ─── Retention Automation Tab ────────────────────────────────────

const automationLabels: Record<string, { label: string; description: string }> = {
  email_sequences: { label: "Email Sequences", description: "Automated re-engagement and win-back email campaigns" },
  discount_offers: { label: "Discount Offers", description: "Automatic discount generation for at-risk members" },
  staff_tasks: { label: "Staff Task Assignment", description: "Auto-assign follow-up tasks to team members" },
  phone_calls: { label: "Phone Call Scheduling", description: "Schedule outreach calls for high-risk members" },
  class_recommendations: { label: "Class Recommendations", description: "Send personalized class suggestions" },
  pt_consultations: { label: "PT Consultations", description: "Recommend personal training sessions" },
};

const automationLevelLabels: Record<AutomationLevel, { label: string; color: string }> = {
  full_auto: { label: "Full Auto", color: "text-green-700 bg-green-50" },
  approval_required: { label: "Needs Approval", color: "text-amber-700 bg-amber-50" },
  suggestion_only: { label: "Suggest Only", color: "text-blue-700 bg-blue-50" },
  disabled: { label: "Disabled", color: "text-stone-600 bg-stone-100" },
};

const levelOptions: AutomationLevel[] = ["full_auto", "approval_required", "suggestion_only", "disabled"];

function RetentionTab({ toast }: { toast: (msg: string) => void }) {
  const automationConfig = useGymStore((s) => s.automationConfig);
  const updateAutomationConfig = useGymStore((s) => s.updateAutomationConfig);
  const { running, start, stop } = useSimulation();

  const handleLevelChange = (key: string, level: AutomationLevel) => {
    updateAutomationConfig({ [key]: level });
    toast(`${automationLabels[key]?.label ?? key} set to ${automationLevelLabels[level].label}`);
  };

  return (
    <div className="space-y-5">
      {/* Demo Mode */}
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-peec-dark">Demo Mode</h3>
            <p className="text-xs text-peec-text-muted">
              Simulate real-time events, score changes, and automated interventions
            </p>
          </div>
          <ToggleSwitch
            checked={running}
            onChange={() => {
              if (running) {
                stop();
                toast("Simulation stopped");
              } else {
                start();
                toast("Simulation started");
              }
            }}
          />
        </div>
        {running && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs text-green-700">
              Simulation active — generating events every 8-15 seconds
            </span>
          </div>
        )}
      </div>

      {/* Developer Tools */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5">
        <h3 className="mb-1 text-sm font-medium text-peec-dark">Developer Tools</h3>
        <p className="mb-4 text-xs text-peec-text-muted">
          Debug utilities for development and testing
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              toast("localStorage cleared — reloading...");
              setTimeout(() => window.location.reload(), 500);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear localStorage & Reload
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-peec-border-light bg-white px-3 py-2 text-xs font-medium text-peec-dark transition-colors hover:bg-stone-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload Page
          </button>
        </div>
      </div>

      {/* Automation Config */}
      <div className="rounded-xl border border-peec-border-light bg-white p-5">
        <h3 className="mb-1 text-sm font-medium text-peec-dark">Retention Automation</h3>
        <p className="mb-6 text-xs text-peec-text-muted">
          Configure how the retention engine handles interventions for each type
        </p>

        <div className="space-y-4">
          {Object.entries(automationLabels).map(([key, meta]) => {
            const currentLevel = (automationConfig as unknown as Record<string, AutomationLevel>)[key] ?? "suggestion_only";
            const levelMeta = automationLevelLabels[currentLevel];

            return (
              <div key={key} className="flex items-center justify-between rounded-lg border border-peec-border-light/50 p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-peec-dark">{meta.label}</p>
                  <p className="text-2xs text-peec-text-muted">{meta.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${levelMeta.color}`}>
                    {levelMeta.label}
                  </span>
                  <select
                    value={currentLevel}
                    onChange={(e) => handleLevelChange(key, e.target.value as AutomationLevel)}
                    className="rounded-lg border border-peec-border-light bg-white px-2 py-1 text-xs text-peec-dark focus:border-peec-dark focus:outline-none"
                  >
                    {levelOptions.map((level) => (
                      <option key={level} value={level}>
                        {automationLevelLabels[level].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
