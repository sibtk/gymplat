"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { membersList } from "@/lib/mock-data";

import type { Member } from "@/lib/mock-data";

const columns = [
  {
    key: "name",
    label: "Member",
    render: (row: Member) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-2xs font-medium text-peec-dark">
          {row.avatar}
        </div>
        <div>
          <p className="text-sm font-medium text-peec-dark">{row.name}</p>
          <p className="text-2xs text-peec-text-muted">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "plan",
    label: "Plan",
    render: (row: Member) => (
      <span className="rounded bg-stone-50 px-2 py-0.5 text-xs text-peec-text-secondary">
        {row.plan}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row: Member) => <StatusBadge status={row.status} />,
  },
  {
    key: "lastCheckIn",
    label: "Last Check-in",
    render: (row: Member) => (
      <span className="text-xs text-peec-text-secondary">{row.lastCheckIn}</span>
    ),
  },
  {
    key: "memberSince",
    label: "Member Since",
    render: (row: Member) => (
      <span className="text-xs text-peec-text-secondary">{row.memberSince}</span>
    ),
    className: "hidden tablet:table-cell",
  },
];

const filters = [
  { label: "Active", value: "active" },
  { label: "At Risk", value: "at-risk" },
  { label: "Churned", value: "churned" },
];

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-peec-dark">Members</h1>
        <p className="text-sm text-peec-text-tertiary">
          Manage and monitor all gym members
        </p>
      </div>

      <DataTable<Member>
        data={membersList}
        columns={columns}
        searchable
        searchKeys={["name", "email", "plan"]}
        filters={filters}
        filterKey="status"
        emptyMessage="No members found"
      />
    </div>
  );
}
