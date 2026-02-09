export default function MemberPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Member portal header */}
      <header className="flex h-16 items-center border-b border-border px-6">
        <span className="text-lg font-bold text-foreground">GymPlatform</span>
        <span className="ml-2 text-sm text-muted-foreground">Member Portal</span>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-4xl p-6">{children}</main>
    </div>
  );
}
