"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  FaCrown,
  FaCircleCheck,
  FaInfinity,
  FaStar,
  FaLock,
  FaBolt,
  FaSpinner,
} from "react-icons/fa6";

const FEATURES = [
  {
    icon: FaInfinity,
    title: "Unlimited recipes",
    description: "Post as many recipes as you want — no 2-recipe cap.",
  },
  {
    icon: FaCrown,
    title: "Premium badge",
    description: "A golden crown badge displayed on your profile and recipes.",
  },
  {
    icon: FaStar,
    title: "Priority in listings",
    description: "Your recipes get boosted visibility in browse results.",
  },
  {
    icon: FaBolt,
    title: "Early access",
    description: "Be the first to try new RecipeHub features as they launch.",
  },
  {
    icon: FaLock,
    title: "Lifetime access",
    description: "Pay once, keep premium forever. No subscriptions.",
  },
];

export default function PremiumPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const session = await authClient.getSession();
      const user = session?.data?.user;

      if (!user) {
        toast.error("Please log in to continue.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/payments/create-premium-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to start checkout.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          Upgrade
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Go Premium
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          One payment. Lifetime access. Everything you need to share your
          recipes without limits.
        </p>
      </div>

      {/* Pricing card */}
      <div className="mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-warning/40 bg-surface shadow-lg shadow-warning/5">
          {/* Top accent strip */}
          <div className="h-1.5 w-full bg-linear-to-r from-warning via-accent to-warning" />

          <div className="p-8">
            {/* Badge */}
            <div className="mb-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                <FaCrown className="size-3.5" />
                Premium — Lifetime
              </span>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                One-time payment
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-end gap-1">
                <span className="font-display text-5xl font-bold text-foreground">
                  $9.99
                </span>
                <span className="mb-1.5 text-sm text-muted">/ forever</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                No recurring charges. Pay once, keep premium for life.
              </p>
            </div>

            {/* Features */}
            <ul className="mb-8 flex flex-col gap-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                    <Icon className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-surface-foreground">
                      {title}
                    </p>
                    <p className="text-xs text-muted">{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              variant="primary"
              className="w-full bg-warning text-warning-foreground hover:opacity-90"
              onPress={handleUpgrade}
              isDisabled={loading}
            >
              {loading ? (
                <FaSpinner className="size-4 animate-spin" />
              ) : (
                <FaCrown className="size-4" />
              )}
              {loading ? "Redirecting to checkout…" : "Upgrade to Premium — $9.99"}
            </Button>

            <p className="mt-3 text-center text-xs text-muted">
              Secured by Stripe. Your card details are never stored.
            </p>
          </div>
        </div>
      </div>

      {/* Free vs Premium comparison */}
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-separator">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-separator bg-surface">
              <th className="px-4 py-3 text-left font-semibold text-surface-foreground">
                Feature
              </th>
              <th className="px-4 py-3 text-center font-semibold text-muted">
                Free
              </th>
              <th className="px-4 py-3 text-center font-semibold text-warning">
                Premium
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-separator bg-background">
            {[
              { feature: "Add recipes",       free: "Up to 2",   premium: "Unlimited" },
              { feature: "Browse recipes",    free: "✓",         premium: "✓"         },
              { feature: "Save favorites",    free: "✓",         premium: "✓"         },
              { feature: "Like recipes",      free: "✓",         premium: "✓"         },
              { feature: "Premium badge",     free: "—",         premium: "✓"         },
              { feature: "Priority listings", free: "—",         premium: "✓"         },
              { feature: "Early access",      free: "—",         premium: "✓"         },
            ].map(({ feature, free, premium }) => (
              <tr key={feature} className="hover:bg-surface/50">
                <td className="px-4 py-2.5 text-foreground">{feature}</td>
                <td className="px-4 py-2.5 text-center text-muted">{free}</td>
                <td className="px-4 py-2.5 text-center font-semibold text-warning">
                  {premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}