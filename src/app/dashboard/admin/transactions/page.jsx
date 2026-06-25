"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  FaReceipt,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaCircleCheck,
  FaCircleXmark,
  FaClock,
  FaCopy,
  FaCircleUser,
} from "react-icons/fa6";

const STATUS_CONFIG = {
  succeeded: {
    label: "Succeeded",
    icon: FaCircleCheck,
    className: "bg-success/10 text-success",
  },
  failed: {
    label: "Failed",
    icon: FaCircleXmark,
    className: "bg-danger/10 text-danger",
  },
  pending: {
    label: "Pending",
    icon: FaClock,
    className: "bg-warning/10 text-warning",
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
      <Icon className="size-3" />
      {config.label}
    </span>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy transaction ID"
      className="ml-1 text-muted transition-colors hover:text-accent"
    >
      {copied ? (
        <FaCircleCheck className="size-3 text-success" />
      ) : (
        <FaCopy className="size-3" />
      )}
    </button>
  );
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const [page, setPage]                 = useState(1);
  const [loading, setLoading]           = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/admin/transactions?page=${page}`
      );
      const data = await res.json();
      setTransactions(data.transactions ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotalCount(data.totalCount ?? 0);
    } catch {
      toast.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Summary stats
  const succeeded = transactions.filter((t) => t.paymentStatus === "succeeded");
  const totalRevenue = succeeded.reduce((sum, t) => sum + (t.amount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          Admin
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-muted">
          All payments processed through RecipeHub.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-separator bg-surface p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <FaReceipt className="size-5" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold text-surface-foreground">
              {totalCount}
            </p>
            <p className="text-xs text-muted">Total transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-separator bg-surface p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
            <FaCircleCheck className="size-5" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold text-surface-foreground">
              {succeeded.length}
            </p>
            <p className="text-xs text-muted">Successful payments</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-separator bg-surface p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <FaReceipt className="size-5" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold text-surface-foreground">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-muted">Revenue (this page)</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-separator">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted">
            <FaSpinner className="size-5 animate-spin" />
            <span className="text-sm">Loading transactions…</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface text-muted">
              <FaReceipt className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">No transactions yet</p>
              <p className="mt-1 text-xs text-muted">
                Payments will appear here once users start purchasing recipes.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-separator bg-surface">
                  <th className="px-4 py-3 text-left font-semibold text-surface-foreground">
                    User
                  </th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground sm:table-cell">
                    Recipe
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-surface-foreground">
                    Amount
                  </th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground md:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-surface-foreground">
                    Status
                  </th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground lg:table-cell">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator bg-background">
                {transactions.map((txn) => (
                  <tr
                    key={txn._id?.toString()}
                    className="hover:bg-surface/50"
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-muted">
                          <FaCircleUser className="size-4" />
                        </span>
                        <span className="max-w-35 truncate text-xs text-foreground">
                          {txn.userEmail}
                        </span>
                      </div>
                    </td>

                    {/* Recipe */}
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="max-w-40 truncate text-xs text-muted block">
                        {txn.recipeName}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">
                        ${(txn.amount ?? 0).toFixed(2)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="hidden px-4 py-3 text-muted md:table-cell">
                      {txn.paidAt
                        ? new Date(txn.paidAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={txn.paymentStatus} />
                    </td>

                    {/* Transaction ID */}
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {txn.transactionId ? (
                        <div className="flex items-center gap-1">
                          <span className="max-w-35 truncate font-mono text-xs text-muted">
                            {txn.transactionId}
                          </span>
                          <CopyButton text={txn.transactionId} />
                        </div>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex size-9 items-center justify-center rounded-full border border-separator bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
          >
            <FaChevronLeft className="size-3" />
          </button>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex size-9 items-center justify-center rounded-full border border-separator bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
          >
            <FaChevronRight className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}