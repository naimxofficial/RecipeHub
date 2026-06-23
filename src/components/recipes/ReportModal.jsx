"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { FaFlag, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";

const REASONS = ["Spam", "Offensive Content", "Copyright Issue"];

export default function ReportModal({ recipeId, reporterEmail, onClose }) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected) {
      toast.error("Please select a reason.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/recipes/${recipeId}/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reporterEmail, reason: selected }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to submit report.");
        return;
      }
      toast.success("Report submitted. Our team will review it.");
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-separator bg-surface p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-danger/10 text-danger">
              <FaFlag className="size-4" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-surface-foreground">
                Report recipe
              </h2>
              <p className="text-xs text-muted">Select the reason below</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <FaXmark className="size-3.5" />
          </button>
        </div>

        {/* Reasons */}
        <ul className="flex flex-col gap-2">
          {REASONS.map((reason) => (
            <li key={reason}>
              <button
                type="button"
                onClick={() => setSelected(reason)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  selected === reason
                    ? "border-danger bg-danger/10 text-danger"
                    : "border-separator bg-background text-surface-foreground hover:border-danger/40 hover:text-danger"
                }`}
              >
                {reason}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onPress={onClose}
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onPress={handleSubmit}
            isDisabled={loading || !selected}
          >
            {loading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <FaFlag className="size-3.5" />
            )}
            {loading ? "Submitting…" : "Submit report"}
          </Button>
        </div>
      </div>
    </div>
  );
}