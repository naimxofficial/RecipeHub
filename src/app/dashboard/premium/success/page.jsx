"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  FaCrown,
  FaCircleCheck,
  FaSpinner,
  FaCircleXmark,
} from "react-icons/fa6";

export default function PremiumSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("No session ID found. If you completed payment, your account will be updated shortly.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/payments/verify-premium?session_id=${sessionId}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Verification failed.");
          setStatus("error");
          return;
        }

        // Refresh the Better Auth session so isPremium reflects immediately
        await authClient.getSession();
        router.refresh();
        setStatus("success");
      } catch {
        setError("Something went wrong verifying your payment.");
        setStatus("error");
      }
    };

    verify();
  }, [sessionId, router]);

  // ── Verifying ─────────────────────────────────────────
  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <FaSpinner className="size-10 animate-spin text-accent" />
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Confirming your payment…
          </h2>
          <p className="mt-1 text-sm text-muted">
            Please wait, this only takes a moment.
          </p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-danger/10 text-danger">
          <FaCircleXmark className="size-8" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted">{error}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <NextLink
            href="/dashboard/premium"
            className="inline-flex items-center gap-2 rounded-xl border border-separator bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:bg-background"
          >
            Back to Premium
          </NextLink>
          <NextLink
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            Go to Dashboard
          </NextLink>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      {/* Animated check */}
      <div className="relative">
        <span className="flex size-24 items-center justify-center rounded-full bg-warning/10">
          <FaCrown className="size-12 text-warning" />
        </span>
        <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-success text-white shadow-md">
          <FaCircleCheck className="size-4" />
        </span>
      </div>

      {/* Message */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Welcome to Premium! 🎉
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Your account has been upgraded to lifetime Premium. You can now add
          unlimited recipes and enjoy your Premium badge across the platform.
        </p>
      </div>

      {/* What's unlocked */}
      <div className="w-full max-w-sm rounded-2xl border border-warning/30 bg-warning/5 p-5 text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-warning">
          Now unlocked
        </p>
        <ul className="flex flex-col gap-2.5 text-sm">
          {[
            "Unlimited recipe posts",
            "Premium crown badge on your profile",
            "Priority visibility in browse results",
            "Early access to new features",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-surface-foreground">
              <FaCircleCheck className="size-4 shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <NextLink
          href="/dashboard/add-recipe"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Add your first unlimited recipe →
        </NextLink>
        <NextLink
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-separator bg-surface px-6 py-3 text-sm font-medium text-foreground hover:bg-background"
        >
          Go to Dashboard
        </NextLink>
      </div>
    </div>
  );
}