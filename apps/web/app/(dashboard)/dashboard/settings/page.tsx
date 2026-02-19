import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
        <Settings className="h-8 w-8 text-peec-text-muted" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-peec-dark">Settings</h2>
      <p className="mt-1 text-sm text-peec-text-tertiary">Coming soon</p>
      <p className="mt-4 max-w-sm text-center text-xs text-peec-text-muted">
        Gym configuration, team management, notification preferences, and API settings will be available in the next release.
      </p>
    </div>
  );
}
