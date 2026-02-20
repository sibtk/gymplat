"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Eye, EyeOff, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PageEntrance } from "@/components/dashboard/motion";
import { useToast } from "@/components/dashboard/toast";
import { ToggleSwitch } from "@/components/dashboard/toggle-switch";
import { staffMembers } from "@/lib/mock-data";

// ─── Form Schema ─────────────────────────────────────────────────

const gymSchema = z.object({
  name: z.string().min(1, "Gym name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
});

type GymFormValues = z.infer<typeof gymSchema>;

// ─── Tab types ───────────────────────────────────────────────────

const tabs = ["General", "Team", "Notifications", "API"] as const;
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
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-peec-dark">Settings</h1>
          <p className="text-sm text-peec-text-tertiary">
            Manage your gym configuration
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-peec-border-light bg-stone-50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-peec-dark shadow-sm"
                  : "text-peec-text-tertiary hover:text-peec-dark"
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GymFormValues>({
    resolver: zodResolver(gymSchema),
    defaultValues: {
      name: "Iron Temple Fitness",
      address: "123 Main Street, New York, NY 10001",
      phone: "(555) 123-4567",
      email: "admin@irontemple.com",
    },
  });

  const onSubmit = (data: GymFormValues) => {
    void data;
    toast("Settings saved successfully");
  };

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-6">
      <h3 className="mb-1 text-sm font-semibold text-peec-dark">Gym Information</h3>
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
  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-peec-dark">Team Members</h3>
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
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between rounded-lg border border-peec-border-light/50 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-xs font-medium text-peec-dark">
                {staff.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-peec-dark">{staff.name}</p>
                <p className="text-2xs text-peec-text-muted">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-2xs font-medium capitalize ${
                  roleBadgeColors[staff.role] ?? "bg-stone-100 text-stone-600"
                }`}
              >
                {staff.role}
              </span>
              <span className="text-2xs text-peec-text-muted">{staff.joinedAt}</span>
            </div>
          </div>
        ))}
      </div>
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
    <div className="rounded-xl border border-peec-border-light bg-white p-6">
      <h3 className="mb-1 text-sm font-semibold text-peec-dark">Notification Preferences</h3>
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
    <div className="space-y-6">
      {/* API Key */}
      <div className="rounded-xl border border-peec-border-light bg-white p-6">
        <h3 className="mb-1 text-sm font-semibold text-peec-dark">API Key</h3>
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
      <div className="rounded-xl border border-peec-border-light bg-white p-6">
        <h3 className="mb-1 text-sm font-semibold text-peec-dark">Webhook URL</h3>
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
