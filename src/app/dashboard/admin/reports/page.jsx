"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import { toast } from "react-toastify";
import NextLink from "next/link";
import {
  FaFlag,
  FaTrash,
  FaXmark,
  FaCircleCheck,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaTriangleExclamation,
} from "react-icons/fa6";

const STATUS_TABS = [
  { label: "Pending",   value: "pending"   },
  { label: "Dismissed", value: "dismissed" },
  { label: "All",       value: "all"       },
];

const REASON_COLORS = {
  "Spam":              "bg-warning/10 text-warning",
  "Offensive Content": "bg-danger/10 text-danger",
  "Copyright Issue":   "bg-accent/10 text-accent",
};

// ── Confirm modal ─────────────────────────────────────────
function ConfirmModal({ title, description, confirmLabel, variant, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-separator bg-surface p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${variant === "danger" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}>
            <FaTriangleExclamation className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-surface-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="flex-1" onPress={onClose}>Cancel</Button>
          <Button variant={variant} className="flex-1" onPress={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function AdminReportsPage() {
  const [reports, setReports]         = useState([]);
  const [totalPages, setTotalPages]   = useState(1);
  const [page, setPage]               = useState(1);
  const [status, setStatus]           = useState("pending");
  const [loading, setLoading]         = useState(true);
  const [actionId, setActionId]       = useState(null); // id of row being actioned
  const [confirm, setConfirm]         = useState(null); // { type, reportId, recipeName }

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/admin/reports?status=${status}&page=${page}`
      );
      const data = await res.json();
      setReports(data.reports ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      toast.error("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // Reset to page 1 on tab switch
  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handleDismiss = async (reportId) => {
    setActionId(reportId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/admin/reports/${reportId}/dismiss`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error();
      toast.success("Report dismissed.");
      fetchReports();
    } catch {
      toast.error("Failed to dismiss report.");
    } finally {
      setActionId(null);
      setConfirm(null);
    }
  };

  const handleRemoveRecipe = async (reportId) => {
    setActionId(reportId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/admin/reports/${reportId}/remove-recipe`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      toast.success("Recipe removed and all reports cleared.");
      fetchReports();
    } catch {
      toast.error("Failed to remove recipe.");
    } finally {
      setActionId(null);
      setConfirm(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          Admin
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          Recipe reports
        </h1>
        <p className="mt-1 text-sm text-muted">
          Review community reports and take action on flagged recipes.
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 rounded-xl border border-separator bg-surface p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleStatusChange(tab.value)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-separator">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted">
            <FaSpinner className="size-5 animate-spin" />
            <span className="text-sm">Loading reports…</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface text-muted">
              <FaFlag className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">No reports found</p>
              <p className="mt-1 text-xs text-muted">
                {status === "pending" ? "No pending reports — all clear!" : `No ${status} reports.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-separator bg-surface">
                  <th className="px-4 py-3 text-left font-semibold text-surface-foreground">Recipe</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground sm:table-cell">Reporter</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground md:table-cell">Reason</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-surface-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-surface-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator bg-background">
                {reports.map((report) => (
                  <tr key={report._id?.toString()} className="hover:bg-surface/50">
                    {/* Recipe */}
                    <td className="px-4 py-3">
                      <NextLink
                        href={`/recipes/${report.recipeId}`}
                        className="font-medium text-foreground hover:text-accent"
                        target="_blank"
                      >
                        {report.recipeName}
                      </NextLink>
                    </td>

                    {/* Reporter */}
                    <td className="hidden px-4 py-3 text-muted sm:table-cell">
                      {report.reporterEmail}
                    </td>

                    {/* Reason */}
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${REASON_COLORS[report.reason] ?? "bg-surface text-muted"}`}>
                        {report.reason}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="hidden px-4 py-3 text-muted lg:table-cell">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      {report.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning">
                          <FaFlag className="size-3" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                          <FaCircleCheck className="size-3" /> Dismissed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {report.status === "pending" && (
                          <>
                            {/* Dismiss */}
                            <button
                              type="button"
                              disabled={actionId === report._id?.toString()}
                              onClick={() =>
                                setConfirm({
                                  type: "dismiss",
                                  reportId: report._id?.toString(),
                                  recipeName: report.recipeName,
                                })
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-separator bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-success/50 hover:text-success disabled:opacity-50"
                            >
                              {actionId === report._id?.toString() ? (
                                <FaSpinner className="size-3 animate-spin" />
                              ) : (
                                <FaXmark className="size-3" />
                              )}
                              Dismiss
                            </button>

                            {/* Remove recipe */}
                            <button
                              type="button"
                              disabled={actionId === report._id?.toString()}
                              onClick={() =>
                                setConfirm({
                                  type: "remove",
                                  reportId: report._id?.toString(),
                                  recipeName: report.recipeName,
                                })
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-separator bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-danger/50 hover:text-danger disabled:opacity-50"
                            >
                              {actionId === report._id?.toString() ? (
                                <FaSpinner className="size-3 animate-spin" />
                              ) : (
                                <FaTrash className="size-3" />
                              )}
                              Remove
                            </button>
                          </>
                        )}

                        {report.status === "dismissed" && (
                          <span className="text-xs text-muted">No actions</span>
                        )}
                      </div>
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
        <div className="flex items-center justify-center gap-2">
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

      {/* Confirm modal */}
      {confirm?.type === "dismiss" && (
        <ConfirmModal
          title="Dismiss report"
          description={`Mark this report on "${confirm.recipeName}" as dismissed? The recipe will remain visible.`}
          confirmLabel="Dismiss"
          variant="primary"
          onConfirm={() => handleDismiss(confirm.reportId)}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm?.type === "remove" && (
        <ConfirmModal
          title="Remove recipe"
          description={`Permanently delete "${confirm.recipeName}"? This also clears all its reports, likes and favorites. This cannot be undone.`}
          confirmLabel="Remove recipe"
          variant="danger"
          onConfirm={() => handleRemoveRecipe(confirm.reportId)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}