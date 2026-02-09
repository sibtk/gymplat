export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-border bg-card tablet:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="text-lg font-bold text-foreground">GymPlatform</span>
        </div>
        <nav className="space-y-1 p-4">
          {["Dashboard", "Members", "Plans", "Payments", "Access", "Settings"].map((item) => (
            <div
              key={item}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center border-b border-border px-6">
          <h2 className="text-sm font-medium text-muted-foreground">Dashboard</h2>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
