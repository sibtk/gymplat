"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/dashboard/data-table";
import { AnimatedNumber, CardHover, PageEntrance } from "@/components/dashboard/motion";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { useToast } from "@/components/dashboard/toast";
import {
  failedPayments,
  paymentMethodDistribution,
  revenueData,
  transactions,
} from "@/lib/mock-data";

import type { Transaction } from "@/lib/mock-data";

const transactionColumns = [
  {
    key: "member",
    label: "Member",
    render: (row: Transaction) => (
      <span className="text-sm font-medium text-peec-dark">{row.member}</span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (row: Transaction) => (
      <span className="text-sm text-peec-dark">{row.amount}</span>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (row: Transaction) => (
      <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
        row.type === "subscription"
          ? "bg-blue-50 text-blue-700"
          : row.type === "refund"
            ? "bg-amber-50 text-amber-700"
            : "bg-green-50 text-green-700"
      }`}>
        {row.type}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row: Transaction) => (
      <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
        row.status === "completed"
          ? "bg-green-50 text-green-700"
          : row.status === "pending"
            ? "bg-amber-50 text-amber-700"
            : "bg-red-50 text-red-700"
      }`}>
        {row.status}
      </span>
    ),
  },
  {
    key: "method",
    label: "Method",
    render: (row: Transaction) => (
      <span className="text-xs capitalize text-peec-text-secondary">{row.method}</span>
    ),
    className: "hidden tablet:table-cell",
  },
  {
    key: "date",
    label: "Date",
    render: (row: Transaction) => (
      <span className="text-xs text-peec-text-muted">{row.date}</span>
    ),
    className: "hidden tablet:table-cell",
  },
];

const transactionFilters = [
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export default function PaymentsPage() {
  const { toast } = useToast();
  const [retrying, setRetrying] = useState<string | null>(null);

  const handleRetry = (id: string, member: string) => {
    setRetrying(id);
    setTimeout(() => {
      setRetrying(null);
      toast(`Payment retry initiated for ${member}`);
    }, 1000);
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-peec-dark">Payments</h1>
          <p className="text-sm text-peec-text-tertiary">
            Revenue tracking and payment management
          </p>
        </div>

        {/* Revenue KPIs */}
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
            <CardHover>
              <div className="rounded-xl border border-peec-border-light bg-white p-5 shadow-card">
                <p className="mb-1 text-xs text-peec-text-tertiary">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold text-peec-dark">
                  <AnimatedNumber value={127400} prefix="$" />
                </p>
                <p className="mt-1 text-xs text-green-600">+5.8% from last month</p>
              </div>
            </CardHover>
            <CardHover>
              <div className="rounded-xl border border-peec-border-light bg-white p-5 shadow-card">
                <p className="mb-1 text-xs text-peec-text-tertiary">Annual Run Rate</p>
                <p className="text-2xl font-bold text-peec-dark">
                  <AnimatedNumber value={1528800} prefix="$" />
                </p>
                <p className="mt-1 text-xs text-green-600">+12.4% YoY</p>
              </div>
            </CardHover>
            <CardHover>
              <div className="rounded-xl border border-peec-border-light bg-white p-5 shadow-card">
                <p className="mb-1 text-xs text-peec-text-tertiary">Avg Revenue / Member</p>
                <p className="text-2xl font-bold text-peec-dark">
                  $<AnimatedNumber value={44.76} />
                </p>
                <p className="mt-1 text-xs text-green-600">+2.1% from last month</p>
              </div>
            </CardHover>
        </div>

        {/* Revenue Chart */}
        <RevenueChart data={revenueData} />

        {/* Payment Methods + Failed Payments */}
        <div className="grid grid-cols-1 gap-6 desktop:grid-cols-2">
            {/* Payment Method Distribution */}
            <div className="rounded-xl border border-peec-border-light bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold text-peec-dark">Payment Methods</h3>
              <p className="mb-4 text-xs text-peec-text-muted">Distribution by payment type</p>
              <div className="space-y-4">
                {paymentMethodDistribution.map((pm) => (
                  <div key={pm.method}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-peec-dark">{pm.method}</span>
                      <span className="text-xs text-peec-text-secondary">{pm.percentage}% ({pm.count})</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-peec-dark transition-all"
                        style={{ width: `${pm.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Failed Payments */}
            <div className="rounded-xl border border-red-200 bg-red-50/30 p-5">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-semibold text-peec-dark">Failed Payments</h3>
              </div>
              <div className="space-y-3">
                {failedPayments.map((fp) => (
                  <div
                    key={fp.id}
                    className="rounded-lg border border-red-200 bg-white p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-peec-dark">{fp.member}</span>
                      <span className="text-sm font-medium text-red-600">{fp.amount}</span>
                    </div>
                    <p className="text-2xs text-peec-text-muted">{fp.reason}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-2xs text-peec-text-muted">
                        {fp.date} &middot; {fp.retryCount} retries
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRetry(fp.id, fp.member)}
                        disabled={retrying === fp.id}
                        className="flex items-center gap-1 rounded bg-peec-dark px-2 py-1 text-2xs font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3 w-3 ${retrying === fp.id ? "animate-spin" : ""}`} />
                        Retry
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Transactions Table */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-peec-dark">Transactions</h2>
            <DataTable<Transaction>
              data={transactions}
              columns={transactionColumns}
              searchable
              searchKeys={["member"]}
              filters={transactionFilters}
              filterKey="status"
              emptyMessage="No transactions found"
            />
        </div>
      </div>
    </PageEntrance>
  );
}
