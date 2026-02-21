"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/dashboard/data-table";
import { InvoiceDetail } from "@/components/dashboard/invoice-detail";
import { AnimatedNumber, CardHover, PageEntrance } from "@/components/dashboard/motion";
import { PaymentMethodCard } from "@/components/dashboard/payment-method-card";
import { RefundDialog } from "@/components/dashboard/refund-dialog";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SubscriptionManager } from "@/components/dashboard/subscription-manager";
import { useToast } from "@/components/dashboard/toast";
import {
  failedPayments,
  paymentMethodDistribution,
  revenueData,
} from "@/lib/mock-data";
import { useGymStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

import type { Invoice, TransactionFull } from "@/lib/types";

// ─── Tabs ───────────────────────────────────────────────────────

const tabs = ["Overview", "Invoices", "Subscriptions", "Payment Methods", "Refunds"] as const;
type Tab = (typeof tabs)[number];

// ─── Invoice columns ────────────────────────────────────────────

const invoiceColumns = [
  {
    key: "member",
    label: "Member",
    render: (row: Invoice) => <span className="text-sm font-medium text-peec-dark">{row.memberName}</span>,
  },
  {
    key: "total",
    label: "Total",
    render: (row: Invoice) => <span className="text-sm text-peec-dark">{formatCurrency(row.total)}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (row: Invoice) => (
      <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
        row.status === "paid" ? "bg-green-50 text-green-700" :
        row.status === "pending" ? "bg-amber-50 text-amber-700" :
        row.status === "void" ? "bg-stone-100 text-stone-600" :
        "bg-red-50 text-red-700"
      }`}>{row.status}</span>
    ),
  },
  {
    key: "date",
    label: "Date",
    render: (row: Invoice) => <span className="text-xs text-peec-text-muted">{formatDate(row.issuedAt)}</span>,
    className: "hidden tablet:table-cell",
  },
];

// ─── Transaction columns ────────────────────────────────────────

const txnColumns = [
  {
    key: "member",
    label: "Member",
    render: (row: TransactionFull) => <span className="text-sm font-medium text-peec-dark">{row.memberName}</span>,
  },
  {
    key: "amount",
    label: "Amount",
    render: (row: TransactionFull) => (
      <span className={`text-sm ${row.amount < 0 ? "text-red-600" : "text-peec-dark"}`}>
        {row.amount < 0 ? "-" : ""}{formatCurrency(Math.abs(row.amount))}
      </span>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (row: TransactionFull) => (
      <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
        row.type === "subscription" ? "bg-blue-50 text-blue-700" :
        row.type === "refund" ? "bg-amber-50 text-amber-700" :
        "bg-green-50 text-green-700"
      }`}>{row.type}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row: TransactionFull) => (
      <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
        row.status === "completed" ? "bg-green-50 text-green-700" :
        row.status === "pending" ? "bg-amber-50 text-amber-700" :
        "bg-red-50 text-red-700"
      }`}>{row.status}</span>
    ),
  },
  {
    key: "method",
    label: "Method",
    render: (row: TransactionFull) => <span className="text-xs capitalize text-peec-text-secondary">{row.method}</span>,
    className: "hidden tablet:table-cell",
  },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const { toast } = useToast();
  const [retrying, setRetrying] = useState<string | null>(null);

  // Store data
  const invoices = useGymStore((s) => s.invoices);
  const subscriptions = useGymStore((s) => s.subscriptions);
  const paymentMethods = useGymStore((s) => s.paymentMethods);
  const transactions = useGymStore((s) => s.transactions);

  // Invoice detail
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Refund
  const [refundTxn, setRefundTxn] = useState<TransactionFull | null>(null);

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
          <h1 className="text-lg font-semibold text-peec-dark">Payments</h1>
          <p className="text-sm text-peec-text-muted">Revenue tracking and payment management</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-peec-border-light bg-stone-50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-peec-dark shadow-sm"
                  : "text-peec-text-muted hover:text-peec-dark"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "Overview" && (
              <OverviewTab
                retrying={retrying}
                onRetry={handleRetry}
                transactions={transactions}
              />
            )}
            {activeTab === "Invoices" && (
              <div>
                <DataTable<Invoice>
                  data={invoices}
                  columns={invoiceColumns}
                  searchable
                  searchKeys={["memberName"]}
                  filters={[
                    { label: "Paid", value: "paid" },
                    { label: "Pending", value: "pending" },
                    { label: "Overdue", value: "overdue" },
                    { label: "Void", value: "void" },
                  ]}
                  filterKey="status"
                  emptyMessage="No invoices found"
                  onRowClick={(inv) => setSelectedInvoice(inv)}
                />
                <InvoiceDetail invoice={selectedInvoice} open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} />
              </div>
            )}
            {activeTab === "Subscriptions" && (
              <div className="space-y-3">
                {subscriptions.length === 0 ? (
                  <p className="text-sm text-peec-text-muted">No subscriptions</p>
                ) : (
                  subscriptions.map((sub) => (
                    <SubscriptionManager key={sub.id} subscription={sub} />
                  ))
                )}
              </div>
            )}
            {activeTab === "Payment Methods" && (
              <div className="space-y-3">
                {paymentMethods.length === 0 ? (
                  <p className="text-sm text-peec-text-muted">No payment methods</p>
                ) : (
                  paymentMethods.map((pm) => (
                    <PaymentMethodCard key={pm.id} paymentMethod={pm} />
                  ))
                )}
              </div>
            )}
            {activeTab === "Refunds" && (
              <div>
                <DataTable<TransactionFull>
                  data={transactions.filter((t) => t.status === "completed" && t.type !== "refund")}
                  columns={txnColumns}
                  searchable
                  searchKeys={["memberName"]}
                  emptyMessage="No transactions available for refund"
                  onRowClick={(txn) => setRefundTxn(txn)}
                />
                <p className="mt-2 text-2xs text-peec-text-muted">Click a transaction to process a refund</p>
                <RefundDialog transaction={refundTxn} open={!!refundTxn} onClose={() => setRefundTxn(null)} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageEntrance>
  );
}

// ─── Overview Tab (original content) ────────────────────────────

function OverviewTab({
  retrying,
  onRetry,
  transactions,
}: {
  retrying: string | null;
  onRetry: (id: string, member: string) => void;
  transactions: TransactionFull[];
}) {
  return (
    <div className="space-y-6">
      {/* Revenue KPIs */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
        <CardHover>
          <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <p className="mb-1 text-xs text-peec-text-muted">Monthly Recurring Revenue</p>
            <p className="text-2xl font-bold text-peec-dark">
              <AnimatedNumber value={127400} prefix="$" />
            </p>
            <p className="mt-1 text-xs text-green-600">+5.8% from last month</p>
          </div>
        </CardHover>
        <CardHover>
          <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <p className="mb-1 text-xs text-peec-text-muted">Annual Run Rate</p>
            <p className="text-2xl font-bold text-peec-dark">
              <AnimatedNumber value={1528800} prefix="$" />
            </p>
            <p className="mt-1 text-xs text-green-600">+12.4% YoY</p>
          </div>
        </CardHover>
        <CardHover>
          <div className="rounded-xl border border-peec-border-light bg-white p-5">
            <p className="mb-1 text-xs text-peec-text-muted">Avg Revenue / Member</p>
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
                  <div className="h-full rounded-full bg-peec-dark transition-all" style={{ width: `${pm.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/30 p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-peec-dark">Failed Payments</h3>
          </div>
          <div className="space-y-3">
            {failedPayments.map((fp) => (
              <div key={fp.id} className="rounded-lg border border-red-200 bg-white p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-peec-dark">{fp.member}</span>
                  <span className="text-sm font-medium text-red-600">{fp.amount}</span>
                </div>
                <p className="text-2xs text-peec-text-muted">{fp.reason}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xs text-peec-text-muted">{fp.date} &middot; {fp.retryCount} retries</span>
                  <button
                    type="button"
                    onClick={() => onRetry(fp.id, fp.member)}
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

      {/* Recent Transactions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-peec-dark">Recent Transactions</h2>
        <DataTable<TransactionFull>
          data={transactions.slice(0, 20)}
          columns={txnColumns}
          searchable
          searchKeys={["memberName"]}
          filters={[
            { label: "Completed", value: "completed" },
            { label: "Pending", value: "pending" },
            { label: "Failed", value: "failed" },
          ]}
          filterKey="status"
          emptyMessage="No transactions found"
        />
      </div>
    </div>
  );
}
